# Correlius.org MVP — Security and Access Control

## Security objectives

1. Public films remain anonymously available while common browser/web threats are reduced.
2. No unauthenticated request can retrieve partner HTML or files, including via direct or alternate URLs.
3. Partner, participant, donor, legal, and credential information is not exposed through public source, builds, analytics, or logs.
4. Compromise of one deployment credential or contributor change is constrained by least privilege, 2FA, review, and atomic deployment.
5. Controls are concrete and testable at MVP scale; no Enterprise-only or undocumented protection is claimed.

This is a lightweight threat model, not a penetration test or legal/privacy opinion.

## Assets

| Asset | Sensitivity | Required protection |
|---|---|---|
| Public pages/films | Public; integrity/availability matter | TLS, origin restrictions, deploy integrity, CDN/alerts |
| Partner pages/downloads | Partner-confidential | Access before origin, no alternate public URL, controlled repository |
| Approved-email allowlist | Operational-sensitive | Cloudflare configuration only, least privilege, no client/repo copy |
| Authentication/audit logs | Operational-sensitive | Restricted administrators, defined review/retention |
| Aggregate audience report | Partner-confidential | De-identification and Access |
| Raw research/identity map | Restricted | Separate private storage; never deployed |
| Legal/insurance/source masters | Restricted | Separate private storage/backups; never public repository |
| GitHub/Cloudflare/registrar/email accounts | Administrative crown jewels | Unique credentials, phishing-resistant 2FA where supported, recovery controls |
| Deployment/API/email secrets | Restricted | Provider secret stores, scoped tokens, rotation |
| Domain/DNS/email reputation | High-integrity | Registrar lock, DNSSEC, auto-renew, SPF/DKIM/DMARC |

## Actors

- Legitimate anonymous viewer or privately vetted partner.
- Approved partner on a trusted or lost/compromised device.
- Brian/authorized administrator.
- Opportunistic bot, spammer, scraper, credential/PIN guesser.
- Malicious or compromised dependency/contributor/account.
- Search crawler/link-preview bot.
- Third-party provider/operator and email recipient provider.
- Good-faith security researcher.

## Trust boundaries

1. Untrusted browser to Cloudflare edge.
2. Cloudflare Access authorization decision to partner Pages origin.
3. Public repository/build to private partner repository/build.
4. GitHub workflow/build dependencies to production artifact.
5. Public page/player to Cloudflare Stream.
6. Website to external Fractured Atlas and email systems.
7. Deployed content to restricted research/legal/master storage.

The system-context and logical diagrams in documents 01 and 02 visualize these boundaries.

## Authentication and authorization design

### Access application coverage

Create a self-hosted Cloudflare Access application for `partners.correlius.org/*` and protect the partner Pages `*.pages.dev` production hostname and wildcard previews/aliases. Inventory every hostname during launch and quarterly review. An HTTP `GET` or `HEAD` without authorization must receive Access challenge/denial and no resource body for HTML, PDF, ZIP, image, and missing-file paths.

The policy has:

1. an Allow action matching individually approved exact email addresses;
2. no broad email-domain, “everyone,” country, or valid-email Allow rule;
3. one-time PIN identity provider enabled;
4. 8-hour application/policy session;
5. deny-by-default behavior for every nonmatch.

Allowlist configuration is maintained only in Cloudflare, not repository files or client code. Adding/removing a person never redeploys the partner site (US-15).

### OTP behavior

Cloudflare sends approved addresses a single-use PIN with a provider-defined short expiration (current documented behavior is 10 minutes). Requesting a new PIN invalidates the prior PIN. The hosted flow uses a generic “code sent” response even for blocked addresses, reducing email enumeration. Correlius must not add a custom membership-check endpoint.

### Sessions, logout, and revocation

- Application/policy session: 8 hours.
- Logout: visible `/cdn-cgi/access/logout` link.
- Routine removal: delete exact email from the Allow rule so future policy checks fail.
- Urgent removal: delete from Allow and use Access per-user token revocation; verify within the provider's documented propagation window from an incognito client.
- Application-wide emergency: revoke all application tokens, understanding approved users may reauthenticate unless the policy is also changed.
- Quarterly or event-driven review: reconcile allowlist with current partner relationships and inspect authentication logs.

### Authentication logging

Access authentication logs record successful and failed code submissions and policy decisions. They do not necessarily log an email entry if no code is submitted and do not equal a full record of page actions. Access logs are restricted to Brian/authorized admins. Cloudflare's Free plan currently retains Access logs for 24 hours; paid 30-day retention is excluded by the cost guardrail. Brian must either accept 24 hours as “long enough” and review after approvals/incidents, or amend US-24. The design does not add a paid log plan or a new PII log archive merely to extend retention.

## Network, edge, and browser protections

### HTTPS/TLS and HSTS

- Cloudflare SSL/TLS mode must prevent insecure origin paths; Pages origin is provider-managed.
- Redirect all HTTP to HTTPS and normalize to one canonical public hostname.
- Verify both hosts/certificate chains before enabling HSTS.
- Enable HSTS with an initially conservative `max-age`, then raise to at least 6–12 months after validation. Add `includeSubDomains` only after every subdomain is confirmed HTTPS-ready. Submit to the preload list only as a later conscious decision, not an MVP assumption.
- Scan production hosts with SSL Labs or equivalent before launch and after meaningful TLS/DNS changes.

### Response headers

Start with a report-only CSP in preview, eliminate violations, then enforce in production. A representative policy design is:

- `default-src 'self'`
- `base-uri 'self'`
- `object-src 'none'`
- `frame-ancestors 'none'` (or equivalent X-Frame-Options `DENY` as legacy defense)
- `form-action 'self'`
- narrowly enumerated `script-src`, `style-src`, `img-src`, `font-src`, `connect-src`, `frame-src`, and `media-src` for Cloudflare Stream and first-party endpoints only
- no `'unsafe-eval'`; avoid `'unsafe-inline'` through hashes/nonces or static external scripts
- `upgrade-insecure-requests` after preview validation

Also set `X-Content-Type-Options: nosniff`, strict `Referrer-Policy` (recommended `strict-origin-when-cross-origin`), conservative `Permissions-Policy`, and secure cache policies. Partner responses also send `X-Robots-Tag: noindex, nofollow, noarchive`. The CSP must be tested against actual Stream origins; do not copy a placeholder policy into production.

Third-party CDN scripts are avoided. If one is unavoidable and the provider publishes stable versioned bytes, pin the version and use SRI plus `crossorigin`; SRI is not used for scripts whose provider intentionally changes content at the same URL.

### WAF, bots, scraping, and DDoS

- Enable Cloudflare's available managed WAF rules for the selected plan on both hostnames.
- Enable Bot Fight Mode or the plan-equivalent bot control; do not claim Enterprise Bot Management.
- Keep the retired `/api/partner-access` route binding-free, non-cacheable, and fixed at HTTP 410 for every method.
- Do not aggressively challenge ordinary cached `GET` traffic or verified search bots on public pages; static CDN delivery absorbs viral reads.
- Public scraping yields only public content. The partner origin remains behind Access regardless of path knowledge.
- Cloudflare's platform DDoS/CDN protection and static cache provide graceful scale; no availability guarantee beyond provider capability is claimed.

### Access PIN rate-limit constraint

US-09 and US-25 explicitly require repeated failed PIN attempts “against a single email address” to be rate-limited. The OTP entry endpoint is hosted on Cloudflare's Access domain, not the Correlius application path. Public documentation describes anti-abuse cookies, single-use PINs, expiry, generic responses, and authentication logs, but not a customer-configurable per-email failed-PIN threshold or an audit field proving that threshold. A zone WAF rule on `partners.correlius.org` must not be represented as controlling the hosted PIN endpoint.

Therefore this criterion is **NO-GO AS WRITTEN / not exactly verifiable with the mandated Access OTP design**. Launch choices are:

1. amend the acceptance criterion to accept Cloudflare's provider-managed OTP abuse controls and document the evidence available (recommended, free, and closest to the mandated architecture); or
2. obtain written Cloudflare confirmation/plan capability; or
3. introduce a custom/third-party identity flow, which expands scope and security risk and is not recommended.

## Vetted-only partner boundary

The public site does not accept partner applications or prospective-partner contact data. It contains no application form, Turnstile integration, request contract, request email, KV marker, or automated approval path. Brian vets partners privately and separately administers exact approved email addresses in Cloudflare Access.

The public For Partners page links only to the protected portal root. It does not expose protected resource paths or reveal allowlist membership. The retired `/api/partner-access` route returns HTTP 410 with non-cacheable headers for every method, does not read request bodies, and does not access provider bindings. Visiting the portal or attempting sign-in cannot create an application, account, or allowlist entry.

## Secrets management

| Secret | Location | Scope/rotation |
|---|---|---|
| Cloudflare deployment token, if used | GitHub Actions environment secret | Pages project edit only; prefer native Git integration requiring no token |
| Stream API credential | None in MVP CI | Dashboard publishing; if later added, narrowly scoped secret |

No global Cloudflare API key is used. Secret scanning runs in GitHub. `.env` files are ignored and sample files contain placeholders only. Build output is searched for secret-shaped values and private host/path markers.

## GitHub and supply-chain security

- Require 2FA on owner/organization; prefer passkeys/security keys and store recovery codes offline.
- Protect `main`: no direct push, pull request required, required successful checks, no force-push/deletion, and self-review checklist. If GitHub cannot enforce approving one's own PR, the checklist plus branch rules and audit trail satisfy the sole-owner intent; no fictitious second approver is required.
- Install Cloudflare Pages GitHub App only on the needed repository/project.
- Pin runtime and package-manager versions; commit lockfiles; use deterministic clean installs.
- Minimize dependencies and client scripts. Dependabot (or equivalent) opens updates; code scanning and dependency review run where available.
- Pin GitHub Actions to immutable commit SHAs, constrain permissions at workflow/job level, avoid untrusted PR secrets, and separate production environment credentials.
- CI must complete build, schema/content checks, tests, and security checks before production deployment. Cloudflare Pages publishes atomically; a failed build leaves last success.
- Review generated output for partner paths/private files before public deploy and generate a file manifest/SBOM as practical.

## Account and domain security

- Cloudflare, GitHub, registrar, and monitored email accounts use unique credentials and 2FA; phishing-resistant methods preferred.
- Registrar transfer lock, current recovery contacts, least-privilege delegated access, auto-renew, and renewal/billing alerts are enabled.
- Cloudflare DNS hosts the zone; DNSSEC enabled and verified at registrar/registry.
- Remove stale DNS records and verify no dangling Pages/custom-domain claim is possible.
- Email sending domain is onboarded with SPF and DKIM. Publish DMARC in monitoring mode while validating all legitimate senders, then move toward quarantine/reject; the US-28 goal is rejected/flagged spoofing, so launch must at least have an enforcement plan and no unauthorized senders.
- Use a dedicated sending subdomain if it simplifies alignment/reputation. Verify DMARC alignment and end-to-end delivery to common providers.

## `security.txt`

Publish `/.well-known/security.txt` per RFC 9116 with at least `Contact`, `Expires`, preferred language, and canonical URL. The contact reaches a monitored address without exposing a private personal address unnecessarily. Set calendar reminders before `Expires`. State response expectations; do not imply a bounty, safe-harbor terms, or paid program unless separately approved.

## Privacy and research-data separation

- Public and partner artifacts exclude Prolific IDs, personal emails, unnecessary names, and raw CSV.
- Public repository, build artifacts, source maps, Git history, CI logs/artifacts, and Pages deployments are scanned/reviewed for forbidden material.
- De-identified quotes have stable evidence IDs whose identity mapping remains in restricted storage.
- The partner report is still private even after de-identification and stays behind Access.
- Form submissions live in authorized mailboxes only; no dashboard/database/archive is created. Mailbox retention, forwarding, access, and deletion are configured consciously.
- Web analytics and Analytics Engine events contain no participant/applicant/partner identity and never join to survey data.
- Sensitive legal, insurance, participant, source-master, and donor records remain outside deployed repositories/sites.

## Legal/IP response document

US-21 creates a private operational document, not site functionality. Store it in Brian's approved private document system outside both web repositories. It names the legal advisor/contact order, who may disable Stream/site content, and what not to say before advice. The public disclaimer and partner legal summary are compared during each relevant release. This design provides removal runbooks but does not reproduce privileged legal analysis or offer legal advice.

## Threat scenarios and mitigations

| ID | Scenario | Controls | Residual risk / verification |
|---|---|---|---|
| T1 | Guessed partner PDF URL bypasses portal UI | Access on all hostnames/paths; separate private build; direct GET/HEAD tests | Misconfiguration is critical; continuous inventory and launch gate |
| T2 | Partner `pages.dev`/preview URL is public | Protect production and wildcard preview hostnames; no unprotected aliases | Provider configuration drift; quarterly test |
| T3 | Unapproved user enumerates allowlist | Access generic OTP response; no custom lookup; restricted logs | Approved users know their own status by receipt, inherently |
| T4 | PIN brute force/abuse | Provider single-use/expiry/anti-abuse, logs, session controls | Exact per-email rate-limit cannot be customer-verified; no-go until requirement amendment/provider proof |
| T5 | Lost approved device retains access | 8-hour session; remove email and revoke user tokens | Exposure until revocation/propagation; partner should report promptly |
| T6 | Stale client submits to retired application endpoint | HTTP 410 for every method; no body parsing or provider bindings; `no-store` | Edge request metadata still exists as ordinary hosting/security data |
| T7 | Public page implies or exposes an application path | Build scans reject forms, request scripts, Turnstile origins, and protected resource links | Copy drift requires review |
| T8 | Private vetting or allowlist data enters public source | Separate administration boundary; repository/build secret and identifier scans | Owner operational handling remains outside this repository |
| T9 | Public build contains partner/raw file | Separate repositories/projects, denylist scans, artifact manifest, human review | Historical Git exposure requires credential/data response if it occurs |
| T10 | XSS or malicious dependency | Static rendering/escaping, CSP, minimal JS, lockfile, Dependabot, SRI where viable | Supply-chain risk cannot be eliminated |
| T11 | Compromised deployment credential | 2FA, scoped token/App, protected branch, secret scanning, revocation runbook | Owner endpoint/email compromise remains material |
| T12 | Off-domain Stream embedding | Stream Allowed Origins, CSP | Does not prevent capture, screen recording, or determined copying |
| T13 | Traffic spike/outage | CDN caching, DDoS/WAF, optimized assets, Cloudflare alerts, rollback | Cloudflare regional/account outage remains external dependency |
| T14 | Domain hijack/lapse | Registrar 2FA/lock, DNSSEC, auto-renew/alerts, recovery review | Registrar/email compromise remains key risk |
| T15 | Email spoofing | SPF, DKIM, aligned DMARC progressing to enforcement | Forwarding/display-name spoofing still possible; educate recipients |
| T16 | Legal takedown mishandled | Private plan, named authority, Stream disable and deployment rollback/removal | Requires human/legal response; not application automation |
| T17 | Analytics overclaims outcomes | Defined metric vocabulary and source separation | Starts/minutes depend on vendor definitions and event loss |

## Logging and alerting

| Source | Purpose | Sensitive? | Response |
|---|---|---:|---|
| Pages build/deploy logs | Build failure/change audit | May expose paths; no secrets | Notify on failure; restrict access |
| Worker sanitized logs | Error/abuse diagnosis | No form bodies by design | Alert on error/rate spikes; short retention |
| Email Service logs | Delivery diagnosis | Recipient metadata | Restricted; use only for delivery/abuse |
| Access authentication logs | Approval/use/security review | Yes, identity-bearing | Free plan retains 24 hours; review after approval/incident and accept or amend US-24 |
| Stream analytics/status | Playback and availability | Aggregate | Alert/check availability and trends |
| Edge HTTP Traffic Analytics/Analytics Engine | Utility metrics | Aggregate only | No browser analytics beacon or individual profiling |

Cloudflare's free notifications are configured for Pages deployment failures, security events where available, billing/usage, and provider incidents. A scheduled GitHub Actions smoke check can request the public site and one Stream playback resource within GitHub's included CI minutes and notify on workflow failure. Cloudflare standalone Health Checks require Pro or higher and are excluded. Public documentation also lists no on-demand Stream per-asset availability notification. US-22's exact requirement for Cloudflare-built-in site and Stream delivery alerts is therefore **NO-GO AS WRITTEN**; the free replacement requires amending it to allow Cloudflare Incident Alerts plus GitHub's scheduled smoke check.

## Cost-security guardrail

- Use Cloudflare Free tiers for Pages, edge HTTP Traffic Analytics, plan-appropriate WAF controls, and Access below 50 active users. Keep client-side Web Analytics and Network Error Logging disabled.
- Use GitHub Pro only because enforced branch protection on a private repository is required by US-24; at approximately $4/month it is the only fixed near-free security upgrade.
- Do not enable Cloudflare Pro Health Checks, paid Access seats/retention, Enterprise Logpush, advanced Bot Management, or third-party APM.
- Cloudflare Stream remains usage-priced; disable autoplay/preload, configure billing alerts, and review usage monthly. No security feature may trigger a plan upgrade automatically.
- If a quota is approached, fail/degrade optional aggregate measurement safely and review scope before purchasing capacity.

## Security launch checklist

### Accounts and source

- [ ] GitHub, Cloudflare, registrar, and domain email use 2FA; recovery paths reviewed.
- [ ] `main` is protected; PR/check/self-review required; force pushes/deletion disabled.
- [ ] Cloudflare GitHub App/token has only required repository/project access.
- [ ] Lockfiles committed; dependency/advisory/secret/code scans pass; Actions pinned/scoped.
- [ ] Public and partner repositories/projects are separate; partner repository is private.
- [ ] No secrets, raw data, allowlists, participant identifiers, or sensitive legal/insurance/donor files exist in current Git history or build artifacts.

### Domains and edge

- [ ] All HTTP redirects to HTTPS; certificates and canonical hosts verified.
- [ ] HSTS deployed safely; SSL Labs/equivalent scan passes agreed grade with no critical issue.
- [ ] CSP enforced after report-only testing; Stream works; removed Turnstile origins are absent.
- [ ] `nosniff`, frame restriction, Referrer-Policy, Permissions-Policy confirmed with automated header tests.
- [ ] WAF managed rules and plan-appropriate bot protection enabled on both hosts.
- [ ] Retired application endpoint returns non-cacheable HTTP 410 for GET and POST without binding access.
- [ ] DNSSEC validates; stale DNS removed; registrar transfer lock and auto-renew/alerts enabled.
- [ ] SPF/DKIM/DMARC alignment is verified for monitored domain mail; no application notification path exists.

### Partner access

- [ ] Exact-email Allow policy and deny-by-default behavior reviewed; no broad domain/everyone rule.
- [ ] Custom partner host, production `pages.dev`, previews, branch aliases, HTML, PDFs, ZIPs, and images all challenge/deny unauthenticated GET/HEAD.
- [ ] 8-hour session configured; logout works; remove-plus-revoke runbook tested.
- [ ] Generic approved/unapproved login behavior confirmed; authentication logs accessible.
- [ ] Free-plan 24-hour log retention recorded; Brian has accepted it as sufficient or US-24 is marked no-go/amended.
- [ ] US-09/US-25 per-email PIN rate-limit requirement is amended to provider-managed controls or resolved with provider evidence; it is not silently waived.

### Content and privacy

- [ ] Released captions verified; Stream origins restricted; public player needs no account.
- [ ] Audience report is de-identified, `n=11`, count-backed, balanced, and limitations-complete.
- [ ] Partner download manifest/rights/accessibility checks pass; no orphan file.
- [ ] Form stores only 24-hour HMAC marker; logs/analytics contain no body or identity.
- [ ] Mailbox access/retention/deletion documented; privacy notice matches actual processing.
- [ ] US-21 response plan exists privately, names authority/advisor, and matches public/partner legal summaries.
- [ ] `security.txt` is valid, reachable, monitored, and has a future expiry reminder.

### Verification and incident readiness

- [ ] Production/preview build failure leaves last successful version.
- [ ] Rollback, episode removal, partner approval/revocation, token/API secret revocation, and domain recovery runbooks exercised.
- [ ] Free Cloudflare alerts, Stream billing/usage thresholds, and the GitHub smoke-check failure notification reach Brian.
- [ ] Security contact triage expectation is documented; no bounty/pentest promise.

## Architectural decisions requiring approval

1. Accept 8-hour Access sessions and the Free-plan 24-hour Access-log window, or amend US-24; paid retention is excluded.
2. Amend US-09/US-25 to accept provider-managed OTP abuse controls unless Cloudflare supplies evidence for the exact per-email limit.
3. Accept KV's rare simultaneous duplicate race rather than introducing a database/strong state service.
4. Approve an on-page applicant receipt; email is sent only to Brian's verified address on the Free plan.
5. Approve two repositories/projects and the partner repository's private status.
6. Approve mailbox and restricted-record retention/access practices before collecting data.
7. Amend US-22 to accept free Cloudflare Incident Alerts plus a scheduled GitHub Actions smoke check; Cloudflare Pro Health Checks are excluded.
8. Confirm that approximately $4/month GitHub Pro, Stream usage, and domain renewal fit the near-free ceiling.

## Open questions

- Confirm the Cloudflare Free plan feature inventory and budget alerts; no paid upgrade is authorized.
- Does Brian accept the 24-hour Free-plan Access-log window as sufficient?
- Which exact security, privacy, partner, and sending addresses will be monitored?
- Where are private masters/research/legal response documents stored and backed up, and who besides Brian (if anyone) has emergency authority?
- Will US-09/US-25 be amended to accept provider-managed OTP protections, or should Cloudflare support be asked for a written capability statement?
- Will US-22 be amended to allow free GitHub scheduled smoke checks plus Cloudflare Incident Alerts?

## Official capability references

- [Access one-time PIN](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/)
- [Access session management and revocation](https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/session-management/)
- [Access authentication logs](https://developers.cloudflare.com/cloudflare-one/insights/logs/dashboard-logs/access-authentication-logs/)
- [WAF rate limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [Stream security and allowed origins](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/)
- [Cloudflare Email Service sending](https://developers.cloudflare.com/email-service/get-started/send-emails/)
- [Cloudflare available notifications](https://developers.cloudflare.com/notifications/notification-available/)
- [Cloudflare Health Check availability](https://developers.cloudflare.com/health-checks/)
- [Cloudflare Zero Trust log retention](https://developers.cloudflare.com/cloudflare-one/insights/logs/)
- [Cloudflare Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/)
- [Cloudflare Stream pricing](https://developers.cloudflare.com/stream/pricing/)
- [GitHub protected-branch plan availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
