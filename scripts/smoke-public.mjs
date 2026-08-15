import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const publicRoutes = ["/", "/watch/", "/about/", "/support/", "/for-partners/", "/privacy/"];

function configuredUrl(value, label, expectedOrigin = null) {
  if (!value) throw new Error(`${label} is required.`);
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`${label} must use HTTPS.`);
  if (url.username || url.password || url.search || url.hash) {
    throw new Error(`${label} contains unsupported URL components.`);
  }
  if (expectedOrigin && url.origin !== expectedOrigin) {
    throw new Error(`${label} must use the canonical public origin.`);
  }
  return url;
}

function requireSecurityHeaders(response, label) {
  for (const header of [
    "Content-Security-Policy",
    "Referrer-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
  ]) {
    if (!response.headers.get(header)) throw new Error(`${label}: ${header} is missing.`);
  }
}

async function request(fetchImplementation, url, options = {}) {
  return fetchImplementation(url, {
    redirect: "follow",
    headers: { "User-Agent": "Correlius production smoke check" },
    signal: AbortSignal.timeout(15_000),
    ...options,
  });
}

export async function smokePublic({ baseUrl, episodeUrl, fetchImplementation = globalThis.fetch }) {
  const base = configuredUrl(baseUrl, "PUBLIC_SMOKE_BASE_URL");
  if (base.pathname !== "/") throw new Error("PUBLIC_SMOKE_BASE_URL must be an origin URL.");
  const episode = configuredUrl(episodeUrl, "PUBLIC_SMOKE_EPISODE_URL", base.origin);
  if (!episode.pathname.startsWith("/watch/") || episode.pathname === "/watch/") {
    throw new Error("PUBLIC_SMOKE_EPISODE_URL must identify a released episode detail route.");
  }

  const htmlByUrl = new Map();
  for (const path of [...publicRoutes, episode.pathname]) {
    const url = new URL(path, base);
    const response = await request(fetchImplementation, url);
    if (!response.ok) throw new Error(`${path}: returned HTTP ${response.status}.`);
    if (new URL(response.url || url).origin !== base.origin) {
      throw new Error(`${path}: redirected away from the canonical origin.`);
    }
    if (!response.headers.get("Content-Type")?.toLowerCase().startsWith("text/html")) {
      throw new Error(`${path}: did not return HTML.`);
    }
    requireSecurityHeaders(response, path);
    const html = await response.text();
    if (!/<main\b/iu.test(html)) throw new Error(`${path}: main content is missing.`);
    if (/name="robots" content="[^"]*noindex/iu.test(html)) {
      throw new Error(`${path}: production page is still noindex.`);
    }
    if (!html.includes(`rel="canonical" href="${url.href}"`)) {
      throw new Error(`${path}: canonical URL is missing or incorrect.`);
    }
    htmlByUrl.set(url.href, html);
  }

  const robotsUrl = new URL("/robots.txt", base);
  const robotsResponse = await request(fetchImplementation, robotsUrl);
  if (!robotsResponse.ok) throw new Error(`/robots.txt: returned HTTP ${robotsResponse.status}.`);
  requireSecurityHeaders(robotsResponse, "/robots.txt");
  if (/^\s*Disallow:\s*\/\s*$/imu.test(await robotsResponse.text())) {
    throw new Error("/robots.txt: production discovery remains blocked.");
  }

  const requestEndpoint = new URL("/api/partner-access", base);
  const endpointResponse = await request(fetchImplementation, requestEndpoint);
  if (endpointResponse.status !== 405 || endpointResponse.headers.get("Allow") !== "POST") {
    throw new Error("Partner request endpoint did not reject GET with Allow: POST.");
  }
  if (!endpointResponse.headers.get("Cache-Control")?.includes("no-store")) {
    throw new Error("Partner request endpoint response is cacheable.");
  }

  const episodeHtml = htmlByUrl.get(episode.href);
  const playerUrl = episodeHtml?.match(/<iframe\b[^>]*\bsrc="(https:\/\/[^"\s]+)"/iu)?.[1];
  if (!playerUrl) throw new Error("Released episode does not contain a hosted player iframe.");
  const player = new URL(playerUrl.replaceAll("&amp;", "&"));
  if (!player.hostname.endsWith(".cloudflarestream.com")) {
    throw new Error("Released episode player is not hosted by Cloudflare Stream.");
  }
  const playerResponse = await request(fetchImplementation, player, {
    headers: {
      "User-Agent": "Correlius production smoke check",
      Referer: episode.href,
    },
  });
  if (!playerResponse.ok) {
    throw new Error(`Cloudflare Stream player returned HTTP ${playerResponse.status}.`);
  }

  return { checkedPages: publicRoutes.length + 1, playerUrl: player.href };
}

async function selfTest() {
  const baseUrl = "https://correlius.org";
  const episodeUrl = `${baseUrl}/watch/released-film/`;
  const securityHeaders = {
    "Content-Security-Policy": "default-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000",
    "X-Content-Type-Options": "nosniff",
  };
  const response = ({ url, status = 200, type = "text/html", body = "" }) => ({
    ok: status >= 200 && status < 300,
    status,
    url,
    headers: new Headers({ "Content-Type": type, ...securityHeaders }),
    async text() { return body; },
  });
  const fetchImplementation = async (input) => {
    const url = new URL(input);
    if (url.hostname.endsWith(".cloudflarestream.com")) {
      return response({ url: url.href, body: "player" });
    }
    if (url.pathname === "/robots.txt") {
      return response({ url: url.href, type: "text/plain", body: "User-agent: *\nAllow: /\n" });
    }
    if (url.pathname === "/api/partner-access") {
      const result = response({ url: url.href, status: 405, body: "method not allowed" });
      result.headers.set("Allow", "POST");
      result.headers.set("Cache-Control", "private, no-store");
      return result;
    }
    const iframe = url.pathname === "/watch/released-film/"
      ? '<iframe src="https://customer.cloudflarestream.com/uid/iframe"></iframe>'
      : "";
    return response({
      url: url.href,
      body: `<main>Ready</main><link rel="canonical" href="${url.href}">${iframe}`,
    });
  };

  const result = await smokePublic({ baseUrl, episodeUrl, fetchImplementation });
  assert.equal(result.checkedPages, 7);

  await assert.rejects(
    smokePublic({
      baseUrl,
      episodeUrl,
      fetchImplementation: async (input) => {
        const result = await fetchImplementation(input);
        if (new URL(input).pathname === "/") {
          result.headers.delete("Strict-Transport-Security");
        }
        return result;
      },
    }),
    /Strict-Transport-Security is missing/u,
  );
  console.log("Production smoke-check self-test passed.");
}

if (process.argv.includes("--self-test")) {
  await selfTest();
} else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await smokePublic({
    baseUrl: process.env.PUBLIC_SMOKE_BASE_URL,
    episodeUrl: process.env.PUBLIC_SMOKE_EPISODE_URL,
  });
  console.log(`Production smoke check passed for ${result.checkedPages} pages and the Stream player.`);
}
