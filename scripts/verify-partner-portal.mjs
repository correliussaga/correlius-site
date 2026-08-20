import assert from "node:assert/strict";

import { onRequest } from "../functions/api/partner-access.js";

for (const method of ["GET", "POST"]) {
  const response = await onRequest({
    request: new Request("https://correlius.org/api/partner-access", { method }),
    env: new Proxy({}, { get: () => { throw new Error("Closed endpoint accessed a binding."); } }),
  });
  const body = await response.text();

  assert.equal(response.status, 410, method);
  assert.match(response.headers.get("Cache-Control"), /no-store/u, method);
  assert.match(body, /not accepted online/iu, method);
  assert.match(body, /private vetting and approval/iu, method);
  assert.doesNotMatch(body, /form|submit|Turnstile|email address/iu, method);
}

console.log("Vetted-only partner portal verification passed.");
