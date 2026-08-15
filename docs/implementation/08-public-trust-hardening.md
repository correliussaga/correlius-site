# Public Trust Hardening

## Scope

This package implements Brian's 2026-08-15 approval to favor strong public-site security with minimal browser-side observation. It updates the deployed public shell and its operating model; it does not enable public discovery, the partner-request form, or unpublished films.

## Repository controls

- The content security policy is enforced, not report-only, and allows only the first-party site plus the exact Cloudflare Stream and Turnstile capabilities the application requires.
- Cloudflare Stream is click-to-load. No Stream iframe or request is created until a visitor chooses **Load video player**, and playback never autostarts.
- Turnstile is submit-time-only. Its script and widget are created only after a visitor submits an enabled partner-request form; the widget uses explicit execution and appears only if interaction is required.
- Privacy copy distinguishes ordinary Cloudflare edge/security processing from advertising tracking, client-side audience analytics, session replay, and visitor profiling, which Correlius does not use.
- The hourly smoke check rejects report-only CSP, Cloudflare browser analytics beacons, and Network Error Logging headers. It checks prelaunch privacy/discovery posture by default and automatically expands to released-episode playback checks when an episode URL is configured.
- The approved monitored address is published through an RFC 9116 `/.well-known/security.txt` with a future expiry, canonical HTTPS URL, English preference, and automated production validation.
- Obsolete GitHub Pages root artifacts were removed so there is one maintained public build. GitHub Pages must also be unpublished in repository settings to eliminate its old redirect surface.

## Live Cloudflare controls

- Keep Cloudflare Web Analytics disabled.
- Disable Network Error Logging and remove its browser response headers so future responses do not direct browsers to `a.nel.cloudflare.com`. Browsers that cached the earlier policy may retain it until its prior `max_age` expires.
- Use SSL/TLS **Full (strict)** and immediately verify the production origin remains healthy.
- Retain Always Use HTTPS, minimum TLS 1.2, TLS 1.3, HSTS, Browser Integrity Check, managed WAF/DDoS protection, registrar lock, and domain auto-renew.
- Keep Bot Fight Mode off unless measured abuse justifies its additional false-positive and browser-friction risk.
- Keep Turnstile pre-clearance off when the production widget is created.
- Keep DNSSEC under observation while Cloudflare Registrar completes automatic DS publication; do not manually disturb a pending enrollment.

## Remaining owner gates

- Unpublish the legacy GitHub Pages deployment, confirm branch protection on `main`, and confirm 2FA/recovery readiness for GitHub, Cloudflare, the registrar, and the monitored mailbox.
- Push this commit to `origin/main`, observe the Cloudflare build, and require the CI and production smoke workflows to pass.

## Live execution evidence — 2026-08-15

- Cloudflare SSL/TLS mode changed from **Full** to **Full (strict)** at 22:15 UTC. The API reported an active certificate with no validation errors, and an immediate production request returned HTTP 200.
- The zone NEL setting changed from enabled to disabled at 22:15 UTC and the API read-back confirmed `enabled: false`. Because edge responses still included the provider headers ten minutes later, a zone response-header transform was deployed at 22:26 UTC to remove only `NEL` and `Report-To`. A subsequent production response returned HTTP 200 with both headers absent. Browsers that cached the earlier seven-day NEL policy may retain it until expiration or site-data clearance, but new responses no longer advertise the endpoint.
- DNSSEC enrollment remained `pending`; Cloudflare Registrar controls the automatic DS publication, so no manual DNSSEC mutation was made.
- Cloudflare Email Routing was enabled for `correlius.org` with provider-managed MX, SPF, and DKIM records. The only enabled literal-address rule sends `contact@correlius.org` to the verified private security destination; catch-all forwarding remains disabled.
