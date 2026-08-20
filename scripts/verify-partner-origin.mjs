import assert from "node:assert/strict";

import portal from "../infra/partner-portal/worker.mjs";

const request = (path, method = "GET") =>
  portal.fetch(new Request(`https://partners.correlius.org${path}`, { method }));

for (const method of ["GET", "HEAD"]) {
  const response = request("/", method);
  assert.equal(response.status, 200, method);
  assert.equal(response.headers.get("cache-control"), "private, no-store", method);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive", method);
  assert.equal(response.headers.get("x-frame-options"), "DENY", method);
  assert.match(response.headers.get("content-security-policy"), /default-src 'none'/u, method);
  const body = await response.text();
  if (method === "GET") assert.match(body, /Authenticated access is active/u);
  else assert.equal(body, "");
}

const robots = request("/robots.txt");
assert.equal(robots.status, 200);
assert.equal(await robots.text(), "User-agent: *\nDisallow: /\n");

for (const path of ["/audience-evidence/", "/media-kit/private.pdf", "/missing"]) {
  const response = request(path);
  assert.equal(response.status, 404, path);
  assert.equal(await response.text(), "Not found", path);
}

const post = request("/", "POST");
assert.equal(post.status, 405);
assert.equal(post.headers.get("allow"), "GET, HEAD");

console.log("Partner portal origin verification passed.");
