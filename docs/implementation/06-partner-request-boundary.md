# Stage 6 — Partner Request Boundary (Superseded)

The former online partner-application implementation was retired on 2026-08-19 and must not be restored or deployed.

The governing requirement is [Decision 12](../design/12-vetted-partner-portal-decision.md):

- Correlius accepts no online partner applications.
- Brian vets and approves partners privately.
- The public For Partners page links only to the protected portal root.
- The retired `/api/partner-access` endpoint returns non-cacheable HTTP 410 for every method without reading request bodies or provider bindings.
- The public repository contains no application form, client, contract, data store, abuse challenge, request email, or approval automation.

Current automated evidence is provided by `npm run test:partner-portal`, `npm run test:partner-boundary`, and the public build/smoke checks.
