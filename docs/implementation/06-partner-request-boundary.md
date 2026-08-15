# Stage 6 — Partner Request Boundary

## Scope

Stage 6 implements the repository-owned, fail-closed portion of WP-07 and records the operational gates for WP-08 through WP-10. It does not enable the public form, create or populate the private partner repository, configure a Cloudflare account, grant Access, or authorize deployment.

## Implemented public request path

- `/for-partners/` renders the complete minimum request contract as a disabled preview. No personal information can be submitted while the required production services and reviewed privacy copy are absent.
- The contract accepts name, email, affiliation, one approved collaboration type, a short message, an explicit privacy acknowledgement, and the Turnstile response. It rejects missing, repeated, unknown, malformed, control-character, and over-limit values.
- `/api/partner-access` is a same-origin, form-encoded POST boundary implemented as a Cloudflare Pages Function. It applies declared and actual body limits, requires a Cloudflare client address, and returns uncached, noindex HTML outcomes without echoing submitted values.
- The handler hashes the client address before using the rate-limit binding, validates Turnstile server-side against the expected hostname and action, and HMACs the normalized email before checking KV.
- A recent digest produces a neutral on-page result and no second notification. A delivered request sends plain text only to the configured verified reviewer, then writes a one-byte KV marker with a 24-hour TTL.
- Success is an on-page receipt. The applicant is not emailed. The request path has no Access administration binding or code and cannot grant access.
- Optional analytics accepts only the fixed aggregate outcomes `accepted`, `duplicate`, `invalid`, `rate_limited`, and `provider_error`; no form field, applicant identity, raw IP, or digest enters the event.

## Automated evidence

- Contract tests cover successful delivery, normalization, hashed rate and duplicate keys, exact recipient restrictions, TTL, duplicate suppression, same-origin enforcement, content type and size limits, malformed and injected fields, privacy acknowledgement, and response non-reflection.
- Provider tests cover rate-limit, Turnstile, KV, email, and configuration failures. Each failure is controlled and no false success is returned.
- Turnstile tests verify the server request includes the secret, response token, client address, and an idempotency key, then checks the expected hostname and action.
- Static checks require the production form to remain disabled without a site key, verify labels and submit-button semantics, and reject protected portal paths, Access credentials, or Access policy mutation code in this public repository.

## External gates still open

The following work requires account access, approved operational values, or a separate private trust boundary and is not represented as complete:

- Verify the reviewer and sender addresses; onboard Cloudflare Email Service; configure and test SPF, DKIM, and DMARC; define mailbox access and retention; and inspect production delivery headers.
- Create the Turnstile widget and secret, configure hostname/action restrictions, bind KV and Rate Limiting, optionally bind the aggregate Analytics Engine dataset, apply edge abuse controls, and test actual Free-tier behavior.
- Confirm a monitored privacy contact and approve final privacy/request wording. Only then may a reviewed change set `partnerRequestEnabled` and its public site key together.
- Deploy and test the Pages Function on production, including malicious/oversized/replayed submissions, expiration after 24 hours, delivery, response accessibility, sanitized logs, and proof that no Access policy changes.
- Create the separately owned private repository and partner Pages project before adding any portal source. Configure Cloudflare Access across every hostname and prove the deny-by-default matrix before WP-09 or WP-10 content enters that repository.
- Supply and review de-identified evidence, downloadable resources, donor facts, contact details, rights/credit records, and accessible document assets inside the private workflow only.

The accepted KV simultaneous-request race remains as recorded in AAD-08 and the approved requirement interpretations. No database, paid Workers plan, applicant email, custom identity service, or Access automation was added. All public pages remain noindex, the legacy root site is unchanged, and no deployment is authorized. Stage 7 must not begin without Brian's approval.
