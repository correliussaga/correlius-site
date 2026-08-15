import assert from "node:assert/strict";
import { createPartnerRequestHandler } from "../src/server/partner-request.mjs";

const publicOrigin = "https://correlius.org";
const endpoint = `${publicOrigin}/api/partner-access`;

function validParameters(overrides = {}) {
  return new URLSearchParams({
    name: "Ada Example",
    email: "ADA@EXAMPLE.COM",
    affiliation: "Example Forum",
    collaborationType: "community",
    message: "A moderated conversation about the project.",
    privacyConsent: "yes",
    "cf-turnstile-response": "fresh-token",
    ...overrides,
  });
}

function requestFor(parameters = validParameters(), overrides = {}) {
  const headers = new Headers({
    Origin: publicOrigin,
    "Sec-Fetch-Site": "same-origin",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "CF-Connecting-IP": "203.0.113.20",
    ...overrides.headers,
  });
  return new Request(overrides.url ?? endpoint, {
    method: overrides.method ?? "POST",
    headers,
    body: overrides.method === "GET" ? undefined : (overrides.body ?? parameters),
  });
}

function fixture(overrides = {}) {
  const markers = overrides.markers ?? new Map();
  const messages = [];
  const outcomes = [];
  const rateKeys = [];
  const turnstileRequests = [];
  const markerWrites = [];

  const env = {
    PUBLIC_ORIGIN: publicOrigin,
    TURNSTILE_SECRET: "turnstile-secret",
    TURNSTILE_HOSTNAME: "correlius.org",
    HMAC_SECRET: "a-development-test-secret-at-least-32-bytes",
    REQUEST_RECIPIENT: "reviewer@correlius.org",
    REQUEST_SENDER: "website@correlius.org",
    REQUEST_MARKERS: {
      async get(key) {
        if (overrides.markerGetError) throw new Error("KV unavailable");
        return markers.get(key) ?? null;
      },
      async put(key, value, options) {
        if (overrides.markerPutError) throw new Error("KV unavailable");
        markerWrites.push({ key, value, options });
        markers.set(key, value);
      },
    },
    REQUEST_RATE_LIMITER: {
      async limit({ key }) {
        if (overrides.rateError) throw new Error("Rate limiter unavailable");
        rateKeys.push(key);
        return { success: overrides.rateLimited !== true };
      },
    },
    EMAIL: {
      async send(message) {
        if (overrides.emailError) throw new Error("Email unavailable");
        messages.push(message);
      },
    },
    ANALYTICS: {
      writeDataPoint(point) {
        outcomes.push(point);
      },
    },
    ...overrides.env,
  };

  const fetchImplementation = async (url, options) => {
    if (overrides.turnstileError) throw new Error("Turnstile unavailable");
    turnstileRequests.push({ url, options });
    return {
      ok: overrides.turnstileHttpError !== true,
      async json() {
        return overrides.turnstileResult ?? {
          success: true,
          hostname: "correlius.org",
          action: "partner_request",
        };
      },
    };
  };

  return {
    env,
    handler: createPartnerRequestHandler({ fetchImplementation }),
    markers,
    messages,
    outcomes,
    rateKeys,
    turnstileRequests,
    markerWrites,
  };
}

function outcomeNames(testFixture) {
  return testFixture.outcomes.map(({ blobs }) => blobs[0]);
}

async function responseText(response) {
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  assert.match(response.headers.get("Content-Security-Policy"), /default-src 'none'/u);
  return response.text();
}

{
  const testFixture = fixture();
  const response = await testFixture.handler(requestFor(), testFixture.env);
  const body = await responseText(response);

  assert.equal(response.status, 200);
  assert.match(body, /does not grant partner access/u);
  assert.doesNotMatch(body, /Ada Example|ada@example\.com|moderated conversation/iu);
  assert.equal(testFixture.messages.length, 1);
  assert.equal(testFixture.messages[0].to, "reviewer@correlius.org");
  assert.equal(testFixture.messages[0].from.email, "website@correlius.org");
  assert.match(testFixture.messages[0].text, /Email: ada@example\.com/u);
  assert.match(testFixture.messages[0].text, /has not granted access/u);
  assert.equal(testFixture.markerWrites.length, 1);
  assert.deepEqual(testFixture.markerWrites[0].options, { expirationTtl: 86_400 });
  assert.doesNotMatch(testFixture.markerWrites[0].key, /ada@example\.com/iu);
  assert.equal(testFixture.rateKeys.length, 1);
  assert.doesNotMatch(testFixture.rateKeys[0], /203\.0\.113\.20/u);
  assert.deepEqual(outcomeNames(testFixture), ["accepted"]);

  const verification = testFixture.turnstileRequests[0];
  assert.equal(verification.url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.equal(verification.options.body.get("secret"), "turnstile-secret");
  assert.equal(verification.options.body.get("response"), "fresh-token");
  assert.equal(verification.options.body.get("remoteip"), "203.0.113.20");
  assert.ok(verification.options.body.get("idempotency_key"));

  const duplicate = await testFixture.handler(
    requestFor(validParameters({ "cf-turnstile-response": "another-fresh-token" })),
    testFixture.env,
  );
  assert.equal(duplicate.status, 200);
  assert.match(await duplicate.text(), /recent request is already pending/u);
  assert.equal(testFixture.messages.length, 1);
  assert.deepEqual(outcomeNames(testFixture), ["accepted", "duplicate"]);
}

for (const [label, request, expectedStatus] of [
  ["wrong path", requestFor(validParameters(), { url: `${publicOrigin}/api/not-here` }), 404],
  ["wrong method", requestFor(validParameters(), { method: "GET" }), 405],
  [
    "wrong origin",
    requestFor(validParameters(), { headers: { Origin: "https://example.com" } }),
    403,
  ],
  [
    "alternate request host",
    requestFor(validParameters(), { url: "https://correlius-site.pages.dev/api/partner-access" }),
    403,
  ],
  [
    "cross-site fetch",
    requestFor(validParameters(), { headers: { "Sec-Fetch-Site": "cross-site" } }),
    403,
  ],
  [
    "wrong media type",
    requestFor(validParameters(), { headers: { "Content-Type": "application/json" } }),
    415,
  ],
  [
    "declared oversized body",
    requestFor(validParameters(), { headers: { "Content-Length": "16385" } }),
    413,
  ],
  [
    "negative declared body",
    requestFor(validParameters(), { headers: { "Content-Length": "-1" } }),
    413,
  ],
  [
    "actual oversized body",
    requestFor(validParameters(), { body: "x".repeat(16_385) }),
    413,
  ],
  [
    "missing client address",
    requestFor(validParameters(), { headers: { "CF-Connecting-IP": "" } }),
    403,
  ],
]) {
  const testFixture = fixture();
  const response = await testFixture.handler(request, testFixture.env);
  assert.equal(response.status, expectedStatus, label);
  assert.equal(testFixture.messages.length, 0, label);
}

for (const [label, parameters] of [
  ["unexpected field", (() => { const value = validParameters(); value.set("role", "admin"); return value; })()],
  ["duplicate field", (() => { const value = validParameters(); value.append("email", "other@example.com"); return value; })()],
  ["invalid email", validParameters({ email: "not-an-address" })],
  ["header control", validParameters({ name: "Ada\nBcc: someone@example.com" })],
  ["missing consent", validParameters({ privacyConsent: "no" })],
  ["invalid collaboration", validParameters({ collaborationType: "administrator" })],
]) {
  const testFixture = fixture();
  const response = await testFixture.handler(requestFor(parameters), testFixture.env);
  assert.equal(response.status, 422, label);
  assert.equal(testFixture.turnstileRequests.length, 0, label);
  assert.equal(testFixture.messages.length, 0, label);
}

for (const [label, overrides, status, outcome] of [
  ["rate limited", { rateLimited: true }, 429, "rate_limited"],
  ["rate provider failure", { rateError: true }, 503, "provider_error"],
  ["Turnstile provider failure", { turnstileError: true }, 503, "provider_error"],
  ["Turnstile HTTP failure", { turnstileHttpError: true }, 503, "provider_error"],
  [
    "Turnstile validation failure",
    { turnstileResult: { success: false, hostname: "correlius.org", action: "partner_request" } },
    422,
    "invalid",
  ],
  [
    "Turnstile hostname mismatch",
    { turnstileResult: { success: true, hostname: "example.com", action: "partner_request" } },
    422,
    "invalid",
  ],
  [
    "Turnstile action mismatch",
    { turnstileResult: { success: true, hostname: "correlius.org", action: "other" } },
    422,
    "invalid",
  ],
  ["KV read failure", { markerGetError: true }, 503, "provider_error"],
  ["email failure", { emailError: true }, 503, "provider_error"],
  ["KV write failure", { markerPutError: true }, 503, "provider_error"],
]) {
  const testFixture = fixture(overrides);
  const response = await testFixture.handler(requestFor(), testFixture.env);
  assert.equal(response.status, status, label);
  assert.deepEqual(outcomeNames(testFixture), [outcome], label);
  if (label !== "KV write failure") assert.equal(testFixture.markerWrites.length, 0, label);
  assert.equal(testFixture.messages.length, label === "KV write failure" ? 1 : 0, label);
}

for (const [label, env] of [
  ["missing bindings", {}],
  ["short HMAC secret", { ...fixture().env, HMAC_SECRET: "too-short" }],
  ["invalid public origin", { ...fixture().env, PUBLIC_ORIGIN: "https://correlius.org/path" }],
  ["insecure public origin", { ...fixture().env, PUBLIC_ORIGIN: "http://correlius.org" }],
  ["invalid recipient", { ...fixture().env, REQUEST_RECIPIENT: "reviewer@example.com\n" }],
]) {
  const testFixture = fixture({ env });
  const response = await testFixture.handler(requestFor(), env);
  assert.equal(response.status, 503, label);
  assert.equal(testFixture.messages.length, 0, label);
}

console.log("Partner request boundary verification passed.");
