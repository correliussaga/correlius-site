# Production Launch and Rollback

This runbook coordinates the final public launch. It is not launch authorization. The private partner site follows the same deployment discipline plus the Access denial matrix in `partner-access-administration.md`.

## Before production

1. Resolve every blocker in `docs/acceptance/launch-readiness.json` with dated evidence stored in the appropriate public or restricted record.
2. Confirm the exact deployed commit passes CI and `npm run verify:launch`. Read the build manifest and verify that no unexpected route, source map, private path, or sensitive file is present.
3. Review the public preview on required phones and desktop browsers. Complete keyboard, assistive-technology, captions, reflow, zoom, forced-colors, external-link, social-preview, and form-result evidence.
4. Verify Cloudflare Pages projects, bindings, DNS, TLS, enforced CSP, HSTS readiness, WAF/abuse controls, email authentication, alerts, budgets, and scoped integrations. Confirm no automatic paid upgrade is enabled.
5. Verify the partner custom, provider, preview, and alias hostnames deny unauthenticated HTML and direct file retrieval. Do not upload substantive partner content before this passes.
6. Confirm the current deployment and Stream rollback/removal targets. A security, privacy, or legal removal must not restore an older artifact that contains the material being removed.
7. Obtain Brian's explicit production authorization and record it in the ledger only after every criterion passes.

## Cutover

1. Merge the reviewed commit through protected `main`; do not bypass required checks.
2. Observe the correct Cloudflare Pages build and record the public deployment identifier and time in the restricted operational record.
3. Verify canonical apex and `www` behavior, TLS, enforced response headers, `robots.txt`, sitemap, public routes, two anonymous episodes and captions, external support destination, request delivery, and partner Access denial.
4. Configure GitHub repository variables `PUBLIC_SMOKE_BASE_URL` and `PUBLIC_SMOKE_EPISODE_URL`, manually dispatch the smoke workflow, and require a pass.
5. Set `PUBLIC_SMOKE_ENABLED` to `true` only after the manual production run passes. Confirm Brian receives a test workflow-failure notification through GitHub's configured notification path.
6. Recheck Cloudflare deployment/incident notifications, Stream usage visibility, request outcome metrics, sanitized logs, and Email Service delivery.

## Ordinary rollback

1. Classify the failure and select a known-good deployment that is safe for the current content/privacy/legal state.
2. Promote or restore that Cloudflare Pages deployment, then repeat the canonical-route, header, form, playback, and smoke checks.
3. Correct source through the normal branch and CI process so `main` again matches production.
4. Record the affected deployment, cause, rollback target, verification, and follow-up.

## Security, privacy, or legal removal

1. Contain the exposed service or asset first: Access policy/token, request secret/binding, Pages deployment, or Stream asset as applicable.
2. Do not select an older deployment until its manifest and content are confirmed free of the removed material.
3. Follow the private legal/IP response plan for legal inquiries; do not copy its contacts, advice, or communications into this repository.
4. Rotate affected secrets, revoke sessions/integrations, and preserve restricted evidence where required.
5. Publish a clean reviewed deployment, verify every alternate URL, and record the response privately.
