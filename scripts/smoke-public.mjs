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
  if (response.headers.get("Content-Security-Policy-Report-Only")) {
    throw new Error(`${label}: CSP is still report-only.`);
  }
  if (
    response.headers.get("NEL") ||
    /\.nel\.cloudflare\.com/iu.test(response.headers.get("Report-To") ?? "")
  ) {
    throw new Error(`${label}: Cloudflare Network Error Logging is still enabled.`);
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

export async function smokePublic({ baseUrl, episodeUrl = null, fetchImplementation = globalThis.fetch }) {
  const base = configuredUrl(baseUrl, "PUBLIC_SMOKE_BASE_URL");
  if (base.pathname !== "/") throw new Error("PUBLIC_SMOKE_BASE_URL must be an origin URL.");
  const episode = episodeUrl
    ? configuredUrl(episodeUrl, "PUBLIC_SMOKE_EPISODE_URL", base.origin)
    : null;
  if (episode && (!episode.pathname.startsWith("/watch/") || episode.pathname === "/watch/")) {
    throw new Error("PUBLIC_SMOKE_EPISODE_URL must identify a released episode detail route.");
  }
  const launchReady = Boolean(episode);

  const htmlByUrl = new Map();
  for (const path of [...publicRoutes, ...(episode ? [episode.pathname] : [])]) {
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
    const pageIsNoindex = /name="robots" content="[^"]*noindex/iu.test(html);
    if (launchReady && pageIsNoindex) {
      throw new Error(`${path}: launch-ready page is still noindex.`);
    }
    if (!launchReady && !pageIsNoindex) {
      throw new Error(`${path}: pre-launch page unexpectedly permits discovery.`);
    }
    if (!html.includes(`rel="canonical" href="${url.href}"`)) {
      throw new Error(`${path}: canonical URL is missing or incorrect.`);
    }
    if (/static\.cloudflareinsights\.com|data-cf-beacon|beacon\.min\.js/iu.test(html)) {
      throw new Error(`${path}: client-side analytics beacon detected.`);
    }
    htmlByUrl.set(url.href, html);
  }

  const robotsUrl = new URL("/robots.txt", base);
  const robotsResponse = await request(fetchImplementation, robotsUrl);
  if (!robotsResponse.ok) throw new Error(`/robots.txt: returned HTTP ${robotsResponse.status}.`);
  requireSecurityHeaders(robotsResponse, "/robots.txt");
  const robotsBlocksDiscovery = /^\s*Disallow:\s*\/\s*$/imu.test(await robotsResponse.text());
  if (launchReady && robotsBlocksDiscovery) {
    throw new Error("/robots.txt: launch-ready discovery remains blocked.");
  }
  if (!launchReady && !robotsBlocksDiscovery) {
    throw new Error("/robots.txt: pre-launch discovery is unexpectedly enabled.");
  }

  const requestEndpoint = new URL("/api/partner-access", base);
  const endpointResponse = await request(fetchImplementation, requestEndpoint);
  if (endpointResponse.status !== 405 || endpointResponse.headers.get("Allow") !== "POST") {
    throw new Error("Partner request endpoint did not reject GET with Allow: POST.");
  }
  if (!endpointResponse.headers.get("Cache-Control")?.includes("no-store")) {
    throw new Error("Partner request endpoint response is cacheable.");
  }

  let player = null;
  if (episode) {
    const episodeHtml = htmlByUrl.get(episode.href);
    const playerUrl = episodeHtml?.match(/\bdata-player-src="(https:\/\/[^"\s]+)"/iu)?.[1];
    if (!playerUrl) throw new Error("Released episode does not contain a consent-first player source.");
    player = new URL(playerUrl.replaceAll("&amp;", "&"));
    if (!/^customer-[a-z0-9]+\.cloudflarestream\.com$/u.test(player.hostname)) {
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
  }

  return { checkedPages: publicRoutes.length + (episode ? 1 : 0), playerUrl: player?.href ?? null };
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
    const player = url.pathname === "/watch/released-film/"
      ? '<div data-player-src="https://customer-test.cloudflarestream.com/uid/iframe"></div>'
      : "";
    return response({
      url: url.href,
      body: `<main>Ready</main><link rel="canonical" href="${url.href}">${player}`,
    });
  };

  const result = await smokePublic({ baseUrl, episodeUrl, fetchImplementation });
  assert.equal(result.checkedPages, 7);

  const prelaunchResult = await smokePublic({
    baseUrl,
    fetchImplementation: async (input) => {
      const result = await fetchImplementation(input);
      if (new URL(input).pathname === "/robots.txt") {
        result.text = async () => "User-agent: *\nDisallow: /\n";
      } else if (result.headers.get("Content-Type")?.startsWith("text/html")) {
        const body = await result.text();
        result.text = async () => `${body}<meta name="robots" content="noindex, nofollow">`;
      }
      return result;
    },
  });
  assert.deepEqual(prelaunchResult, { checkedPages: 6, playerUrl: null });

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
    episodeUrl: process.env.PUBLIC_SMOKE_EPISODE_URL || null,
  });
  console.log(
    result.playerUrl
      ? `Production smoke check passed for ${result.checkedPages} pages and the Stream player.`
      : `Pre-launch smoke check passed for ${result.checkedPages} public pages.`,
  );
}
