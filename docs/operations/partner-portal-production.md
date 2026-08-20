# Partner Portal Production Evidence

## State established 2026-08-19

- `partners.correlius.org` routes to the binding-free `correlius-partner-portal` bootstrap Worker.
- The Worker contains no partner-confidential material, storage binding, form, registration path, or account-creation path.
- Cloudflare Access protects the hostname before the origin runs.
- The only permitted identity provider is the Correlius one-time email-code provider.
- The application session duration is eight hours.
- The Allow policy contains one exact-email rule. The approved address remains only in Cloudflare and is not recorded in this repository.
- No `everyone`, email-domain, generic login-method, account-member, or group selector is present.
- The Worker's `workers.dev` and preview URLs are disabled.
- The public For Partners page contains no application UI and links only to the protected portal root.
- The retired public application endpoint returns non-cacheable HTTP 410.

## Verification evidence

- Unauthenticated requests to `/`, `/audience-evidence/`, `/media-kit/private.pdf`, and `/robots.txt` all returned the Cloudflare Access authentication redirect without origin content.
- The hosted login page offered the configured email-code flow.
- Cloudflare's authoritative and public recursive DNS returned the proxied partner hostname record.
- Production public copy states that access is individually approved and authenticated.
- Production image assets and the public build returned HTTP 200 after deployment.

## Remaining acceptance rehearsal

Do not mark the complete partner-access success criterion passed until an approved user completes OTP authentication and the owner separately verifies unapproved-address behavior, logout, session expiry, removal, and active-session revocation. Record results without putting an approved email address or authentication token in Git.
