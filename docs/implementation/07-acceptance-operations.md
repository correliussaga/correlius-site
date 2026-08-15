# Stage 7 — Acceptance and Operations Closure

## Scope

Stage 7 completes the repository-owned portion of the seven-stage Correlius plan. It turns the remaining launch work into explicit, testable gates and sustainable owner procedures. It does not convert missing content or external configuration into false evidence, enable production discovery or data collection, deploy either site, create the private partner repository, or authorize launch.

## Implemented controls

- GitHub CI now runs the complete locked test suite, including content, request, boundary, smoke self-test, launch-ledger audit, build, shell, and static accessibility checks.
- Every static build generates a sorted SHA-256 manifest for its deployable files. The build boundary verifier requires the manifest and validates it before an artifact can be treated as ready for preview.
- An hourly GitHub production smoke workflow is present but gated by `PUBLIC_SMOKE_ENABLED`. With the variable absent or false, scheduled runs do not make production requests.
- When deliberately enabled, the smoke check requires canonical HTTPS public and released-episode URLs. It checks six core routes, one released episode, production indexing posture, canonical URLs, enforced security headers, `robots.txt`, the request endpoint's GET rejection/no-store behavior, and the referenced Cloudflare Stream player.
- `docs/acceptance/launch-readiness.json` is the source-of-truth launch ledger. Its validator requires exactly 13 success criteria, evidence for every passed criterion, a blocker for every blocked criterion, and explicit owner authorization.
- `npm run audit:launch` verifies ledger integrity without claiming readiness. `npm run verify:launch` is intentionally failing while any criterion is blocked or production authorization is absent.
- Owner runbooks now cover launch evidence, monitoring/maintenance, measurement language, security reporting, incident classification, rollback, backups, costs, and the private legal-plan boundary.

## Current acceptance result

All 13 MVP success criteria remain blocked for final launch evidence. This is expected and honest. The principal missing inputs are approved public and partner content/assets, two released Stream episodes and captions, real Cloudflare request/email bindings, the separate private partner repository and Access matrix, final legal/privacy/contact values, external account/DNS/security evidence, manual accessibility/browser review, owner operations rehearsals, and the private legal/IP plan tabletop.

The architecture-level amendments in AAD-06, AAD-07, and AAD-10 remain governing: provider-managed OTP abuse controls, the 24-hour Access log window, and the free Cloudflare notification plus GitHub smoke-check design are accepted for the MVP. They still require production configuration and observed evidence; an approval record is not proof that a control is live.

## Deliberately disabled or absent

- `finalLegalCopyApproved`, `publicDiscoveryEnabled`, and `partnerRequestEnabled` remain false.
- No public episode is released and no Stream customer code, social image, or Fractured Atlas URL is configured.
- No monitored address is invented, so `/.well-known/security.txt` is not published yet.
- The smoke workflow has no configured production variables and scheduled requests remain disabled.
- No Cloudflare, GitHub, registrar, email, or legal-system action was performed.
- No protected partner page, file, allowlist, identity, or Access credential entered this repository.

The local seven-stage implementation plan is complete with launch status correctly recorded as blocked. A production-readiness phase may proceed only by resolving the ledger gates with dated evidence and a separate final launch authorization from Brian.
