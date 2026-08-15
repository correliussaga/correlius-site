# Partner Request Deployment

This runbook configures the public request boundary already present in the repository. It does not authorize production enablement and contains no secret or real mailbox value.

## Required bindings

| Binding | Kind | Constraint |
|---|---|---|
| `PUBLIC_ORIGIN` | Plain-text variable | Exact canonical origin, with no path or trailing slash beyond the origin serialization |
| `TURNSTILE_SECRET` | Secret | Secret for the reviewed widget; never commit it |
| `TURNSTILE_HOSTNAME` | Plain-text variable | Exact hostname expected from Siteverify |
| `HMAC_SECRET` | Secret | Random value of at least 32 bytes; never reuse a public identifier |
| `REQUEST_RECIPIENT` | Plain-text variable | Brian's verified, monitored destination |
| `REQUEST_SENDER` | Plain-text variable | Approved sender on the configured sending domain |
| `REQUEST_MARKERS` | KV binding | Dedicated namespace for 24-hour keyed email digests only |
| `REQUEST_RATE_LIMITER` | Rate Limiting binding | Conservative reviewed limit for the request route |
| `EMAIL` | Email Service binding | Restricted to the approved sender and Brian's verified destination |
| `ANALYTICS` | Optional Analytics Engine binding | Aggregate request outcomes only |

Production values belong in Cloudflare bindings or secrets, not source control, build logs, issue text, or preview output. The request Worker must never receive an Access API token.

## Provision and review

1. Confirm the canonical public origin and the monitored privacy, reviewer, and sender addresses.
2. Onboard the sending domain to Email Service. Publish and validate the provider-required records, then phase SPF, DKIM, and DMARC according to the approved mail plan.
3. Create a managed Turnstile widget restricted to the public hostname. Record the public site key separately from its secret and retain the action name `partner_request`.
4. Create a dedicated KV namespace and Rate Limiting binding. Review a conservative threshold against the expected low-volume workflow; record the chosen value and Free-tier limits in the private operations record.
5. Restrict the Email binding to the approved sender and verified reviewer destination. Do not use an applicant-controlled recipient, reply-to, or subject.
6. Bind an Analytics Engine dataset only if aggregate measurement has been reviewed. Inspect a test point and verify it contains one allowed outcome and the constant index only.
7. Apply available edge abuse controls to the exact route. Preserve the application-level origin, field, body, rate, Turnstile, duplicate, and delivery checks.
8. Deploy to a protected preview with non-production bindings. Exercise the automated suite plus actual Turnstile, KV, rate-limit, and email behavior; inspect logs for form bodies, raw IPs, addresses, and digests.
9. Confirm final privacy/request wording and manually verify keyboard operation, error recovery, 320-pixel reflow, 200% zoom, and screen-reader announcements for every result.
10. In one reviewed change, set `partnerRequestEnabled` to `true` and provide the public Turnstile site key. Verify the built page contains the widget and that the endpoint remains fail closed if any server binding is absent.

## Production evidence

Record without applicant data: deployment identifier, configuration reviewer, mail-authentication result, successful reviewer delivery, absence of applicant email, valid and invalid Turnstile results, rate-limit result, duplicate result inside and outside the 24-hour window, KV TTL, sanitized log and aggregate-event samples, result-page accessibility, and confirmation that Access configuration did not change.

If email succeeds but the marker write fails, the handler reports that confirmation could not complete; it does not claim success. Investigate the provider failure before asking for a retry because a notification may already exist.
