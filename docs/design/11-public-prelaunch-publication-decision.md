# Correlius.org — Public Pre-launch Publication Decision

## Approval record

- **Status:** Approved for public pre-launch publication
- **Approved by:** Brian Payne, project owner
- **Approval date:** 2026-08-15
- **Scope:** Publish the current validated Astro public-site build at `https://correlius.org`
- **Production MVP authorization:** Not granted

Brian explicitly authorized publication of the current Astro build as a public pre-launch site after reviewing the private Cloudflare Pages preview. This is a narrow exception to the final-launch ordering in AAD-18; it does not mark any blocked criterion in `docs/acceptance/launch-readiness.json` as passed and does not set `productionLaunchAuthorized` to `true`.

## Approved pre-launch state

- The canonical apex `https://correlius.org` is anonymously accessible through Cloudflare Pages.
- `www.correlius.org` redirects permanently to the canonical apex.
- The Pages production and preview provider hostnames remain protected by Cloudflare Access.
- Search indexing remains disabled through `robots.txt`, page metadata, and provider preview controls.
- No episode is represented as released or playable until its release schema and approval gates pass.
- Partner applications are not accepted online; the form and processing dependencies are removed under the 2026-08-19 vetted-only decision.
- Placeholder, private, rights-restricted, or unapproved media and evidence remain excluded.
- The formal 13-criterion production launch gate and later launch authorization remain unchanged.

## Security and operations constraints

- Cloudflare remains authoritative for DNS and provides edge TLS, HTTPS enforcement, HSTS, and the approved response-header boundary.
- The public custom domain is not placed behind Access; anonymous viewing is an approved public-site requirement.
- Existing safe Cloudflare Pages deployments are retained as rollback targets.
- Domain auto-renew is enabled at Brian's explicit direction on 2026-08-15; the registrar lock remains enabled.
- Any later removal of `noindex`, restoration of an online application path, release of an episode, or claim that the MVP is launched requires a new approved decision and must pass its applicable acceptance gates.
