# Partner Access Administration

This runbook records the approved external boundary for the future private partner site. It does not create a private repository, store an allowlist, or configure Cloudflare Access from this public repository.

## Platform baseline

- Create a separate private GitHub repository and independent Cloudflare Pages project before adding any partner portal source or asset.
- Protect the custom hostname, production `pages.dev` hostname, preview wildcard, and every branch alias with Cloudflare Access before deploying substantive content.
- Use one authorization tier, exact-email Allow rules, deny by default, email one-time PIN only, and an eight-hour application/policy session.
- Keep active partners below 50 and accept the approved 24-hour Free-plan authentication-log window. A paid upgrade or different identity provider requires a new decision.
- Keep raw research, identity mappings, masters, privileged legal records, the allowlist, and incident records outside both website repositories.

## Approve a partner

1. Review the privately sourced prospective relationship outside the website. Correlius accepts no public request, and private outreach or context is not authorization.
2. Confirm the exact email and approval basis through the private owner process.
3. Add only that exact email to the single Access Allow policy. Do not add a whole domain, an `Everyone` rule, or a request-driven automation.
4. Test the generic OTP flow with the approved address and an unapproved control address. The visible response must not disclose allowlist membership.
5. Verify the eight-hour session, return-to-requested-path behavior, logout, and available authentication log.
6. Record approval and expiry/review context privately without placing the allowlist or applicant content in Git, analytics, or public issue systems.

## Remove or urgently revoke

1. Remove the exact email from the policy so future evaluations deny access.
2. For an urgent removal, also revoke that user's active Access tokens; policy removal alone is not evidence that an existing session ended.
3. Test in a fresh unauthenticated context and, where safe, with the revoked session. Confirm page and direct-resource retrieval both fail closed.
4. Review the 24-hour log window and preserve any necessary incident record in the approved private location.

## Deny-by-default verification matrix

For the custom host, production provider host, preview wildcard, and branch aliases, issue unauthenticated `GET` and `HEAD` requests to each class below:

| Resource class | Required unauthenticated result |
|---|---|
| Portal HTML route | Access challenge or denial; zero origin content |
| PDF, ZIP, image, and other direct download | Access challenge or denial; zero file bytes |
| Guessed or missing path | Access challenge or denial before a branded origin response |
| Query-string variation | Same challenge or denial as the canonical path |
| `robots.txt`, headers, and logout-related navigation | Behavior matches the reviewed Access and noindex design |

Repeat the matrix after Access policy changes, hostname additions, Pages project changes, rollback, and protected-file releases. `robots.txt`, meta robots, and `X-Robots-Tag` supplement Access; they are not authorization controls.

WP-09 evidence and WP-10 donor/media/contact content may enter only the private repository after this shell and matrix are proven with a test address. The public request Worker has no role in approval, revocation, or token administration.
