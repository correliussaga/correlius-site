# Vetted-only partner portal decision

- **Approved by:** Brian Payne
- **Decision date:** 2026-08-19
- **Status:** Governing requirement and implementation decision

## Decision

Correlius does not accept partner applications online. Brian identifies, vets, and approves partners privately. The public site may explain the partner model and link to `https://partners.correlius.org/`, but it must not collect an application, contact details, collaboration details, or any other prospective-partner submission.

`partners.correlius.org` is a secure portal for already-approved partners. Cloudflare Access remains deny by default. Only exact email addresses that Brian has approved privately may match the portal Allow policy. Visiting the portal, attempting sign-in, or entering an unapproved email must not create an application, account, or allowlist entry.

## Implementation consequences

- Remove the public partner application form and its disabled preview.
- Remove the Turnstile client, request contract, request-processing Worker, KV duplicate marker, rate limiter, email notification path, and request analytics.
- Keep `/api/partner-access` fail closed with HTTP 410 during the transition so stale clients cannot submit data.
- Link the public For Partners page only to the protected portal root; do not reveal protected resource paths.
- Keep approved-email administration and vetting records outside the public repository.
- Continue to protect the portal custom hostname, provider hostname, previews, pages, and direct downloads with Cloudflare Access.

## Superseded requirements

This decision supersedes the former US-08 public partner-access request flow, WP-07 application work package, AAD-08 request Worker decision, Success Criterion 3 application test, and any planned Turnstile/KV/Email Service deployment for partner applications. Historical implementation notes remain records of earlier work but are not instructions for current or future implementation.

## Acceptance criteria

1. `/for-partners/` states that applications are not accepted online and that access is privately vetted.
2. `/for-partners/` links to `https://partners.correlius.org/` with a neutral sign-in action.
3. No public application form, application client script, Turnstile dependency, request-processing binding, or application data store remains.
4. `GET` and `POST` requests to the former endpoint return HTTP 410 with `Cache-Control: no-store` and do not access provider bindings.
5. The portal remains deny by default and only privately approved exact emails may authenticate through Cloudflare Access.

## Production bootstrap — 2026-08-19

The protected hostname is active on a binding-free bootstrap Worker that contains no partner-confidential material. Cloudflare Access is configured before the hostname with one-time email codes, an eight-hour session, and one exact-email Allow entry. `workers.dev` and Worker preview URLs are disabled. The complete partner experience and confidential resources still belong in a separate private repository and deployment origin when they are ready.
