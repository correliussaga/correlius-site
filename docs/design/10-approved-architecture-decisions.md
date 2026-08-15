# Correlius.org MVP — Approved Architecture Decisions

## Approval record

- **Status:** Approved for implementation
- **Approved by:** Brian Payne, project owner
- **Approval date:** 2026-08-15
- **Scope:** The architecture package in `docs/design/01-system-context.md` through `docs/design/09-implementation-plan.md`
- **Stage:** Stage 2 of the seven-stage Correlius implementation plan

Brian's approval of Stage 2 authorizes implementation against the decisions below. This record resolves the approval questions and no-go conflicts identified in documents 01–09; where an earlier design document still labels one of these items open or no-go, this document is the governing disposition. Approval does not authorize production launch or the publication of placeholder, private, unreviewed, or rights-restricted material.

## Approved decision register

| ID | Approved decision | Implementation consequence |
|---|---|---|
| AAD-01 | Use two GitHub repositories and two Cloudflare Pages projects: the existing public site repository and a separate private partner-site repository. | Public and partner artifacts have independent build and deployment boundaries. The partner repository is private before any protected content is added. |
| AAD-02 | Use Astro in static-output mode with schema-validated content and minimal client-side JavaScript. | Public and partner pages are generated statically. Invalid or incomplete release records fail the build. A database or CMS is not introduced for site content. |
| AAD-03 | Use Cloudflare Pages and native Cloudflare services as the hosting and edge platform. | Pages provides atomic deployments and rollback. Cloudflare Stream provides public film playback with allowed-origin restrictions; public films do not use signed URLs. |
| AAD-04 | Keep public viewing anonymous and protect the complete partner origin with Cloudflare Access. | The partner site has one authorization tier, exact-email Allow rules, deny-by-default behavior, no unprotected alternate hostname, and no public object-storage path to protected files. Partner preview and provider hostnames must also be protected or disabled/redirected without exposing content. |
| AAD-05 | Use Cloudflare Access email one-time PIN as the sole partner identity method for the MVP. | Access sessions last eight hours. Logout is explicit. Urgent revocation removes the email from policy and revokes the user's active tokens. The portal remains below the Access Free-plan limit of 50 active users. |
| AAD-06 | Accept Cloudflare's provider-managed OTP abuse protections for the MVP. | US-09 and US-25 are interpreted as requiring the provider's single-use, short-lived PIN controls, generic response, anti-abuse behavior, and available authentication evidence—not a Correlius-configurable per-email failed-PIN threshold. A custom identity system is not added. |
| AAD-07 | Accept the Cloudflare Access Free-plan 24-hour authentication-log window. | US-24 is interpreted as requiring reviewable logs for the provider's available retention period. Paid Access log retention and a separate PII log archive are excluded. |
| AAD-08 | Implement partner requests with a narrow Cloudflare Worker/Pages Function route, Turnstile, a 24-hour keyed email-digest marker in KV, and Cloudflare Email Service to Brian's verified address. | The form validates input server-side, grants no access automatically, stores no application record, and returns an accessible on-page receipt. No applicant confirmation email is required. The rare simultaneous-request race in KV duplicate detection is accepted. |
| AAD-09 | Use native, privacy-conscious aggregate measurement only. | Use Cloudflare edge HTTP Traffic Analytics separated by hostname, Cloudflare Stream Analytics for playback, and a minimal Analytics Engine dataset for approved custom action events. Keep client-side Cloudflare Web Analytics and Network Error Logging disabled. Do not add third-party trackers, session replay, cross-surface identity joins, or research-data joins. |
| AAD-10 | Use free Cloudflare incident/deployment notifications plus a scheduled GitHub Actions smoke check for availability evidence. | US-22 is interpreted to allow this free combined monitoring path. Paid Cloudflare Health Checks and third-party APM are excluded. Monitoring failure never creates a local payment, playback, or authentication fallback. |
| AAD-11 | Use WCAG 2.2 Level AA as the implementation and test baseline. | Semantic static pages, keyboard operation, captions, reduced motion, responsive reflow, contrast, accessible errors, and the explicit US-06 acceptance criteria are release gates. |
| AAD-12 | Keep public films on Cloudflare Stream and restrict playback to approved Correlius origins. | Released films remain frictionless and anonymous. Origin restriction discourages off-domain embedding but is not represented as DRM or screen-recording prevention. Stream UIDs are content; privileged Stream operations remain out of source control. |
| AAD-13 | Keep content and sensitive records in their designated trust boundaries. | Only approved public material enters the public repository. Only reviewed, de-identified partner material enters the private partner repository. Raw research, identity maps, source masters, privileged legal material, allowlists, and operational response records remain outside both deployed artifacts. |
| AAD-14 | Use strict release schemas and a manual review gate for evidence, media, donor, legal, and episode content. | Builds reject invalid releases. Research percentages derive from counts, claims retain limitations, coming-soon content is opt-in and nonplayable, and protected download manifests must exactly match deployed files. |
| AAD-15 | Route all contributions to Fractured Atlas and keep contact/request workflows minimal. | Correlius does not process payments. “Contact Brian” in the protected portal is a mail action rather than a second personal-data form. Partner approval remains a manual Cloudflare Access administration step. |
| AAD-16 | Use free tiers by default and approve only the identified near-free baseline categories. | Domain renewal, low-volume Cloudflare Stream usage, and approximately $4/month GitHub Pro for private-repository branch protection are approved categories. No other paid plan, seat, retention upgrade, monitoring product, database, CMS, or identity service is authorized without a new decision. |
| AAD-17 | Preserve the explicit MVP non-goals in the architecture package. | Do not add viewer accounts, comments/forums, memberships, merchandise, custom donations, donor dashboards, CRM automation, multiple partner roles, live streaming, native apps, raw survey hosting, the full fair-use memo, a searchable CMS/database, a formal bug bounty, or a paid penetration test. |
| AAD-18 | Follow the ordered work packages and gates in `09-implementation-plan.md`. | Implementation begins with governance and a safe public vertical slice. Protected content, security hardening, operations, legal-response readiness, and final acceptance retain their dependencies and verification gates. Production launch still requires Brian's separate authorization. |

## Approved requirement interpretations

The following dispositions close the conflicts reported in the traceability matrix:

1. **US-09 and US-25 — OTP rate limiting.** “Rate-limited against a single email” is satisfied for the MVP by Cloudflare Access's provider-managed OTP and abuse protections together with available authentication logs. Correlius will not claim that a customer-configurable per-email threshold exists, and launch verification will record the provider behavior actually observed.
2. **US-22 — availability alerting.** “Cloudflare-native” is amended to permit Cloudflare Incident/Pages notifications plus a scheduled GitHub Actions smoke check. The GitHub check may test the public site and released playback path without introducing a third-party monitoring vendor.
3. **US-24 — log retention and protected branches.** The available 24-hour Access log window is accepted. GitHub Pro for protected branches in the private partner repository is within the approved near-free cost categories.
4. **US-08 — applicant confirmation.** A durable, accessible on-page success receipt satisfies applicant confirmation. Email Service sends the request only to Brian's verified destination; it does not email the applicant.
5. **Duplicate requests.** A 24-hour keyed digest in KV is sufficient abuse-control state. The known rare race between simultaneous requests is accepted and does not justify a database or stronger state service.

## Inputs still required during implementation

The architecture is approved even though the following operational and content values must be supplied or confirmed before their dependent work packages can be completed:

- Repository ownership and final repository/project names for the private partner site.
- Monitored security, privacy, partner-request, contact, and sending addresses.
- Production Fractured Atlas URL, canonical `www` behavior, and required Cloudflare account/zone identifiers.
- Approved project, creator, episode, image, caption, credit, disclaimer, privacy, evidence, media-kit, donor, and partner-help content.
- Private storage and backup locations for masters, raw research, identity mappings, and the legal/IP response plan, plus emergency removal authority.
- Numeric budget and Stream-usage alert thresholds within the approved cost categories.

These are implementation inputs, not permission to weaken the approved boundaries. A missing value blocks only the work package that depends on it. Any proposal to change an approved architecture decision, add an unapproved paid service, or expand MVP scope requires a new recorded decision.

## Post-approval trust amendment — 2026-08-15

Brian authorized the complete public trust-hardening recommendation after reviewing the production site from a visitor's perspective. AAD-09 is amended to prefer server/edge-side aggregate traffic measurement over a browser analytics beacon and to disable Cloudflare Network Error Logging. Stream and Turnstile are loaded only after the visitor chooses playback or submits the request form. This amendment narrows browser-side data transfer and does not expand scope, cost, identity collection, or analytics joins.

## Stage 2 completion gate

Stage 2 is complete when this approval record is committed to `main`. No Stage 3 implementation work begins until Brian explicitly authorizes Stage 3.
