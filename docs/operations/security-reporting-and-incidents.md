# Security Reporting and Incident Handling

This is a public-repository operational outline, not the private legal/IP response plan and not legal advice.

## Publish `security.txt` only when ready

Before adding `public/.well-known/security.txt`, confirm a monitored security contact, a future expiry date with an earlier reminder, preferred language `en`, and canonical URL `https://correlius.org/.well-known/security.txt`. Test delivery and triage first. Do not publish a placeholder address or imply a bounty, paid program, broad safe harbor, or guaranteed response time.

The final RFC 9116 fields should include `Contact`, `Expires`, `Preferred-Languages`, and `Canonical`. The deployed file and canonical URL must match, remain reachable over HTTPS, and be reviewed before expiry.

## Initial triage

1. Acknowledge through the monitored channel without requesting unnecessary personal data or sensitive proof in public issue text.
2. Classify the report: public integrity/availability, partner access or protected-file exposure, request/applicant data, credential/account compromise, domain/email, dependency/supply chain, Stream/media, or legal/IP.
3. Preserve only necessary evidence in the restricted record. Do not paste tokens, allowlists, request bodies, participant data, private URLs, or legal correspondence into GitHub issues.
4. Contain the affected boundary before ordinary rollback. Revoke tokens/sessions, disable bindings/assets, or stop a deployment as appropriate.
5. Use the appropriate private advisor/contact and notification decision process. Repository runbooks do not determine legal obligations.

## Recovery and verification

1. Rotate exposed secrets and review adjacent scopes; never use a global Cloudflare API key as the replacement.
2. Audit source, history, CI artifacts/logs, Pages deployments/previews, Workers bindings/logs, Access policy/logs, Stream assets, DNS, and mailbox rules as relevant.
3. Deploy a reviewed clean state and verify canonical plus alternate URLs, direct protected files, sessions, response headers, form behavior, and smoke checks.
4. Record timeline, affected data/services, containment, recovery, evidence, and follow-up privately. Update public documentation only with non-sensitive lessons or controls.
5. Rehearse security-report delivery and triage before launch and at least annually.
