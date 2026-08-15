import { parsePartnerRequest, requestLimits } from "../lib/partner-request-contract.mjs";

const encoder = new TextEncoder();
const allowedOutcomes = new Set([
  "accepted",
  "duplicate",
  "invalid",
  "rate_limited",
  "provider_error",
]);

function responseHeaders(extra = {}) {
  return {
    "Cache-Control": "private, no-store",
    "Content-Security-Policy": "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; style-src 'self'",
    "Content-Type": "text/html; charset=utf-8",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    ...extra,
  };
}

function resultPage({ title, heading, message, details = [] }) {
  const detailMarkup = details.length
    ? `<ul>${details.map((detail) => `<li>${detail}</li>`).join("")}</ul>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <title>${title} — Correlius</title>
  </head>
  <body>
    <main>
      <h1>${heading}</h1>
      <p>${message}</p>
      ${detailMarkup}
      <p><a href="/for-partners/">Return to the partner request page</a></p>
    </main>
  </body>
</html>`;
}

function htmlResponse(body, status = 200, extraHeaders = {}) {
  return new Response(body, { status, headers: responseHeaders(extraHeaders) });
}

function recordOutcome(env, outcome) {
  if (!allowedOutcomes.has(outcome)) throw new Error("Unsupported analytics outcome.");
  try {
    env.ANALYTICS?.writeDataPoint({
      blobs: [outcome],
      indexes: ["partner_request"],
    });
  } catch {
    // Aggregate analytics must never block the request path.
  }
}

async function hmacDigest(value, secret, cryptoImplementation) {
  const key = await cryptoImplementation.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await cryptoImplementation.subtle.sign("HMAC", key, encoder.encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function requiredConfiguration(env) {
  if (!env || typeof env !== "object") return false;
  const values = [
    env.PUBLIC_ORIGIN,
    env.TURNSTILE_SECRET,
    env.TURNSTILE_HOSTNAME,
    env.HMAC_SECRET,
    env.REQUEST_RECIPIENT,
    env.REQUEST_SENDER,
  ];
  if (!values.every((value) => typeof value === "string" && value.length > 0)) return false;

  let publicOrigin;
  try {
    publicOrigin = new URL(env.PUBLIC_ORIGIN);
  } catch {
    return false;
  }

  const configuredEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
  return env.HMAC_SECRET.length >= 32 &&
    publicOrigin.protocol === "https:" &&
    publicOrigin.origin === env.PUBLIC_ORIGIN &&
    publicOrigin.pathname === "/" &&
    !/\s/u.test(env.REQUEST_RECIPIENT) &&
    configuredEmail.test(env.REQUEST_RECIPIENT) &&
    !/\s/u.test(env.REQUEST_SENDER) &&
    configuredEmail.test(env.REQUEST_SENDER) &&
    typeof env.REQUEST_MARKERS.get === "function" &&
    typeof env.REQUEST_MARKERS.put === "function" &&
    typeof env.REQUEST_RATE_LIMITER.limit === "function" &&
    typeof env.EMAIL.send === "function";
}

function notificationText(value) {
  return [
    "New Correlius partner request",
    "",
    `Name: ${value.name}`,
    `Email: ${value.email}`,
    `Affiliation: ${value.affiliation}`,
    `Collaboration type: ${value.collaborationType}`,
    "",
    "Message:",
    value.message,
    "",
    "This request has not granted access. Review it manually in Cloudflare Access.",
  ].join("\n");
}

export function createPartnerRequestHandler({
  fetchImplementation = globalThis.fetch,
  cryptoImplementation = globalThis.crypto,
} = {}) {
  return async function handlePartnerRequest(request, env = {}) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/partner-access") {
      return htmlResponse(
        resultPage({
          title: "Not found",
          heading: "Request path not found",
          message: "Return to the public partner request page.",
        }),
        404,
      );
    }

    if (request.method !== "POST") {
      return htmlResponse(
        resultPage({
          title: "Method not allowed",
          heading: "This request method is not accepted",
          message: "Use the partner request form to submit a request.",
        }),
        405,
        { Allow: "POST" },
      );
    }

    if (!requiredConfiguration(env)) {
      recordOutcome(env, "provider_error");
      return htmlResponse(
        resultPage({
          title: "Temporarily unavailable",
          heading: "Partner requests are temporarily unavailable",
          message: "Nothing was accepted. Please try again later.",
        }),
        503,
        { "Retry-After": "300" },
      );
    }

    const origin = request.headers.get("Origin");
    const fetchSite = request.headers.get("Sec-Fetch-Site");
    if (
      url.origin !== env.PUBLIC_ORIGIN ||
      origin !== env.PUBLIC_ORIGIN ||
      (fetchSite && fetchSite !== "same-origin")
    ) {
      recordOutcome(env, "invalid");
      return htmlResponse(
        resultPage({
          title: "Request not accepted",
          heading: "The request could not be accepted",
          message: "Return to the public form and try again.",
        }),
        403,
      );
    }

    const mediaType = request.headers.get("Content-Type")?.split(";", 1)[0].trim().toLowerCase();
    if (mediaType !== "application/x-www-form-urlencoded") {
      recordOutcome(env, "invalid");
      return htmlResponse(
        resultPage({
          title: "Request not accepted",
          heading: "The request format is not accepted",
          message: "Return to the public form and try again.",
        }),
        415,
      );
    }

    const declaredLength = Number(request.headers.get("Content-Length") ?? 0);
    if (!Number.isFinite(declaredLength) || declaredLength < 0 || declaredLength > requestLimits.bodyBytes) {
      recordOutcome(env, "invalid");
      return htmlResponse(
        resultPage({
          title: "Request too large",
          heading: "The request is too large",
          message: "Shorten the request and try again.",
        }),
        413,
      );
    }

    let requestBody;
    try {
      requestBody = await request.arrayBuffer();
    } catch {
      recordOutcome(env, "invalid");
      return htmlResponse(
        resultPage({
          title: "Request not accepted",
          heading: "The request could not be read",
          message: "Nothing was accepted. Return to the public form and try again.",
        }),
        400,
      );
    }
    if (requestBody.byteLength > requestLimits.bodyBytes) {
      recordOutcome(env, "invalid");
      return htmlResponse(
        resultPage({
          title: "Request too large",
          heading: "The request is too large",
          message: "Shorten the request and try again.",
        }),
        413,
      );
    }

    let parameters;
    try {
      parameters = new URLSearchParams(new TextDecoder("utf-8", { fatal: true }).decode(requestBody));
    } catch {
      recordOutcome(env, "invalid");
      return htmlResponse(
        resultPage({
          title: "Request not accepted",
          heading: "The request could not be read",
          message: "Return to the public form and try again.",
        }),
        400,
      );
    }

    const parsed = parsePartnerRequest(parameters);
    if (!parsed.success) {
      recordOutcome(env, "invalid");
      return htmlResponse(
        resultPage({
          title: "Review your request",
          heading: "Review the highlighted request details",
          message: "No request was sent. Correct these items and submit again:",
          details: parsed.errors,
        }),
        422,
      );
    }

    const clientAddress = request.headers.get("CF-Connecting-IP");
    if (!clientAddress) {
      recordOutcome(env, "invalid");
      return htmlResponse(
        resultPage({
          title: "Request not accepted",
          heading: "The request could not be verified",
          message: "Nothing was accepted. Please try again later.",
        }),
        403,
      );
    }

    let rateResult;
    try {
      const rateKey = `ip:${await hmacDigest(clientAddress, env.HMAC_SECRET, cryptoImplementation)}`;
      rateResult = await env.REQUEST_RATE_LIMITER.limit({ key: rateKey });
    } catch {
      recordOutcome(env, "provider_error");
      return htmlResponse(
        resultPage({
          title: "Temporarily unavailable",
          heading: "Partner requests are temporarily unavailable",
          message: "Nothing was accepted. Please try again later.",
        }),
        503,
        { "Retry-After": "60" },
      );
    }
    if (!rateResult.success) {
      recordOutcome(env, "rate_limited");
      return htmlResponse(
        resultPage({
          title: "Try again later",
          heading: "Too many requests",
          message: "Nothing was accepted. Wait before trying again.",
        }),
        429,
        { "Retry-After": "60" },
      );
    }

    let turnstileResult;
    try {
      const turnstileBody = new FormData();
      turnstileBody.set("secret", env.TURNSTILE_SECRET);
      turnstileBody.set("response", parsed.value.turnstileToken);
      turnstileBody.set("remoteip", clientAddress);
      turnstileBody.set("idempotency_key", cryptoImplementation.randomUUID());

      const turnstileResponse = await fetchImplementation(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: turnstileBody,
          signal: AbortSignal.timeout(5_000),
        },
      );
      if (!turnstileResponse.ok) throw new Error("Turnstile response failed.");
      turnstileResult = await turnstileResponse.json();
    } catch {
      recordOutcome(env, "provider_error");
      return htmlResponse(
        resultPage({
          title: "Verification unavailable",
          heading: "Verification is temporarily unavailable",
          message: "Nothing was accepted. Please try again later.",
        }),
        503,
        { "Retry-After": "60" },
      );
    }

    if (
      turnstileResult.success !== true ||
      turnstileResult.hostname !== env.TURNSTILE_HOSTNAME ||
      turnstileResult.action !== "partner_request"
    ) {
      recordOutcome(env, "invalid");
      return htmlResponse(
        resultPage({
          title: "Verification required",
          heading: "Verification was not completed",
          message: "Nothing was accepted. Complete a new verification and try again.",
        }),
        422,
      );
    }

    let markerKey;
    try {
      markerKey = `request:${await hmacDigest(parsed.value.email, env.HMAC_SECRET, cryptoImplementation)}`;
    } catch {
      recordOutcome(env, "provider_error");
      return htmlResponse(
        resultPage({
          title: "Temporarily unavailable",
          heading: "Partner requests are temporarily unavailable",
          message: "Nothing was accepted. Please try again later.",
        }),
        503,
        { "Retry-After": "60" },
      );
    }
    let recentMarker;
    try {
      recentMarker = await env.REQUEST_MARKERS.get(markerKey);
    } catch {
      recordOutcome(env, "provider_error");
      return htmlResponse(
        resultPage({
          title: "Temporarily unavailable",
          heading: "Partner requests are temporarily unavailable",
          message: "Nothing was accepted. Please try again later.",
        }),
        503,
        { "Retry-After": "60" },
      );
    }

    if (recentMarker) {
      recordOutcome(env, "duplicate");
      return htmlResponse(
        resultPage({
          title: "Request already pending",
          heading: "A recent request is already pending",
          message: "No duplicate notification was sent. Requests are reviewed manually and never grant access automatically.",
        }),
      );
    }

    try {
      await env.EMAIL.send({
        to: env.REQUEST_RECIPIENT,
        from: { email: env.REQUEST_SENDER, name: "Correlius website" },
        subject: "New Correlius partner request",
        text: notificationText(parsed.value),
      });
    } catch {
      recordOutcome(env, "provider_error");
      return htmlResponse(
        resultPage({
          title: "Notification unavailable",
          heading: "The request could not be delivered",
          message: "Nothing was confirmed. Please try again later.",
        }),
        503,
        { "Retry-After": "300" },
      );
    }

    try {
      await env.REQUEST_MARKERS.put(markerKey, "1", { expirationTtl: 86_400 });
    } catch {
      recordOutcome(env, "provider_error");
      return htmlResponse(
        resultPage({
          title: "Confirmation unavailable",
          heading: "The request could not be confirmed",
          message: "Delivery may have started, but confirmation could not be completed. Please try again later.",
        }),
        503,
        { "Retry-After": "300" },
      );
    }

    recordOutcome(env, "accepted");
    return htmlResponse(
      resultPage({
        title: "Request received",
        heading: "Your request was received",
        message: "It will be reviewed manually. This confirmation does not grant partner access, and no applicant email will be sent.",
      }),
    );
  };
}

export const handlePartnerRequest = createPartnerRequestHandler();
