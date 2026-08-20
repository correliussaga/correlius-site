# Partner Request Deployment (Retired)

Do not deploy or provision an online partner-request workflow. Correlius accepts no online partner applications under [Decision 12](../design/12-vetted-partner-portal-decision.md).

Current operations are limited to:

1. Keep `/for-partners/` as a static explanation and link to `https://partners.correlius.org/`.
2. Keep `/api/partner-access` binding-free and fixed at non-cacheable HTTP 410 for every method.
3. Vet prospective partners privately, outside the public site and repository.
4. Add or remove only exact approved email addresses in Cloudflare Access.
5. Test approved and unapproved identities, direct protected-resource denial, logout, session expiry, and revocation using the partner Access runbook.

Restoring any public application mechanism requires a new owner-approved architecture and privacy decision.
