# Correlius.org MVP — Requirements Traceability

## Status definitions

- **DESIGN COMPLETE:** architecture and verification approach are defined; implementation/content work remains.
- **OPEN QUESTION:** an exact design outcome depends on owner approval or an unresolved provider capability/requirement conflict.
- **NO-GO AS WRITTEN:** the acceptance criterion cannot be delivered exactly within the free/near-free architecture; it must be amended or removed before launch.

Work-package IDs refer to `09-implementation-plan.md`.

## User-story traceability matrix

| Requirement | Short Description | Primary Design Artifact | Design Section | Technical Component(s) | Implementation Work Package | Verification Method | Status |
|---|---|---|---|---|---|---|---|
| US-01 | Understand project quickly | 03 | Home | Public static site, project content, responsive hero/CTAs | WP-02, WP-03 | Mobile timed usability; content/metadata review; no horizontal scroll | DESIGN COMPLETE |
| US-02 | Understand mental-health mission | 03 | Home; About | Approved mission content, semantic prose | WP-03, WP-05 | Copy review for healed/cured, no clinical claims; accessibility audit | DESIGN COMPLETE |
| US-03 | Creator and history credibility | 03 | About | Creator/history collections, approved image/legal summary | WP-03, WP-06 | Content/rights/alt/legal consistency review; no private memo in artifacts | DESIGN COMPLETE |
| US-04 | Watch public episode | 03, 05 | Episode detail; Stream configuration | Public Pages, Stream player, allowed origins, fallback | WP-04 | Anonymous cross-browser/device playback and controls; off-domain embed denied; failure test | DESIGN COMPLETE |
| US-05 | Browse multiple episodes | 03, 05 | Watch; Episode schema/state | Episode collection, derived routes/cards | WP-03, WP-04 | Fixture with 4+ ordered episodes; coming-soon/nonplayable checks; add N+1 test | DESIGN COMPLETE |
| US-06 | Captions/accessibility | 03, 05 | Accessibility verification; Captions | Semantic templates, Stream captions, responsive CSS | WP-04, WP-05 | Manual keyboard/zoom/screen-reader/contrast and caption timing; browser/device matrix | DESIGN COMPLETE |
| US-07 | Support via fiscal sponsor | 03 | Support | Validated external Fractured Atlas CTA | WP-06 | Link check; external-transition/fiscal-sponsor/rights wording review; no payment fields | DESIGN COMPLETE |
| US-08 | Request partner access | 02, 03, 06 | Request flow; For Partners; request security | Worker, Turnstile, rate limit, KV digest, Email Service | WP-07 | Field/privacy/manual-review tests; Brian notification and applicant on-page receipt; spam/rate/duplicate cases; no Access API | DESIGN COMPLETE |
| US-09 | Approved partner OTP access | 04, 06 | Authentication entry; Authentication/authorization; PIN constraint | Access exact-email policy, OTP, sessions, logs | WP-08, WP-12 | Approved/unapproved/direct-file/session/revocation tests; provider evidence for per-email PIN rate limit | NO-GO AS WRITTEN |
| US-10 | Audience evidence | 04, 05 | Audience Evidence; evidence structure/workflow | Protected content, accessible charts/tables, PDF | WP-09 | `n=11`, subgroup/count/percentage/limitations/critical/quote trace checks; identifier scan; protected download test | DESIGN COMPLETE |
| US-11 | Feature-worthy case | 04 | Overview; Feature Correlius | Protected editorial/topic/format content | WP-09 | Decision-maker review; small-panel claim audit; Contact action test | DESIGN COMPLETE |
| US-12 | Collaboration resources | 04, 05 | Media Kit; downloadable resources | Protected manifest/files/package | WP-10 | Completeness, filenames, usage/rights/a11y, individual/package and unauthenticated access tests | DESIGN COMPLETE |
| US-13 | Prospective contribution | 04 | Donor Brief | Milestone/funding collections, Fractured Atlas/contact CTAs | WP-10 | Completed/planned separation; category/fiscal/rights wording; external link/contact tests | DESIGN COMPLETE |
| US-14 | Affordable episode publishing | 05, 07 | Episode N+1 workflow; release runbook | Stream dashboard, episode record, Pages deploy | WP-04, WP-13 | Owner performs documented release in preview; existing episodes unchanged; billing visible | DESIGN COMPLETE |
| US-15 | Manage collaborator access | 04, 07 | Sessions/revocation; approval/revocation runbooks | Access policy/logs, protected host | WP-08, WP-13 | Add/remove without code/deploy; deny-default; logs and direct URL/sitemap tests | DESIGN COMPLETE |
| US-16 | Low-maintenance content | 05, 07 | Content gates; Git/deployment pipeline | GitHub, schemas, Pages atomic builds/rollback | WP-01, WP-13 | Routine content change, induced failed build, rollback exercise; no DB/CMS/auth code change | DESIGN COMPLETE |
| US-17 | Honest legal posture | 03, 06 | Footer/disclaimer; Legal/IP document | Global footer, approved public/partner summaries | WP-06, WP-14 | Every-page footer crawl; rights/credit review; no memo; cross-surface consistency | DESIGN COMPLETE |
| US-18 | Protect participant/partner data | 01, 04, 06 | Classification; boundary; privacy separation | Separate repos/projects, Access, log redaction, private storage | WP-07–WP-10, WP-12 | Git/history/build/output scans; direct-file denial; raw/identifier/secret absence; noindex header | DESIGN COMPLETE |
| US-19 | Privacy-conscious measurement | 02 | Analytics architecture | Web Analytics, Stream Analytics, Analytics Engine, Access logs | WP-11 | Metric dictionary/event tests; surface separation; payload/privacy audit; no survey join | DESIGN COMPLETE |
| US-20 | Search/social discovery | 03 | SEO/social rules | Static metadata, canonical, sitemap, robots | WP-06 | Metadata crawler; social preview tools; public-only sitemap; partner noindex/absence | DESIGN COMPLETE |
| US-21 | Legal/IP inquiry response | 06, 07 | Legal/IP response; removal/recovery | Private operational document, Stream/Pages controls | WP-14 | Private plan existence/review/tabletop; authority/contact and cross-copy checks | DESIGN COMPLETE |
| US-22 | Fast, reliable site | 03, 07 | Responsive/performance; monitoring/failures | Static Pages/CDN, optimized assets, free incident/deploy alerts, GitHub smoke check | WP-02, WP-04, WP-13 | Performance/cache/deploy tests; free smoke-check alert; requirement amendment | NO-GO AS WRITTEN |
| US-23 | Secure transport/browser | 06 | HTTPS/TLS; headers | Cloudflare TLS/HSTS, CSP, headers | WP-12 | HTTP redirect/header/CSP tests; SSL Labs; Stream/Turnstile CSP regression; SRI inventory | DESIGN COMPLETE |
| US-24 | Protect admin/partner accounts | 06, 07 | Supply chain; Access sessions; Git strategy | 2FA, GitHub Pro branch rules, scoped integration/tokens, revocation, 24h Access logs | WP-01, WP-08, WP-12 | Configuration screenshots/checklist; direct-push denial; token-scope/revoke/log test; accept 24h retention | OPEN QUESTION |
| US-25 | Resist bots/DoS | 06 | WAF/bots; request security; PIN constraint | Free CDN/WAF/Bot Fight, Turnstile, form limits, Access provider controls | WP-07, WP-12 | Form load/spam/rate tests; cached spike/protected scrape test; provider PIN evidence | NO-GO AS WRITTEN |
| US-26 | Supply-chain security | 06, 07 | GitHub/supply chain; build | Dependabot, lockfile, scoped/pinned CI, atomic Pages | WP-01, WP-12, WP-13 | Dependency/secret/workflow permission checks; induced build failure; self-review record | DESIGN COMPLETE |
| US-27 | Security reporting | 06 | `security.txt` | Static well-known file, monitored email/reminder | WP-12 | RFC 9116 validator; delivery/triage exercise; expiry check; no bounty language | DESIGN COMPLETE |
| US-28 | Domain/email spoofing protection | 06, 07 | Account/domain security; DNS | Registrar, Cloudflare DNS/DNSSEC, Email Service, SPF/DKIM/DMARC | WP-07, WP-12 | DNSSEC/lock/renewal evidence; message header/alignment and spoof-policy tests | DESIGN COMPLETE |

## Definition of MVP Success traceability

| # | Success criterion | Design implementation | Work package(s) | Launch verification | Status |
|---:|---|---|---|---|---|
| 1 | Understand and begin watching within two minutes | Film-led Home, stable Watch/detail routes, performance budget | WP-02–WP-04 | Timed first-time mobile usability test | DESIGN COMPLETE |
| 2 | Both completed episodes public without account | Released episode schema + anonymous Stream embed | WP-04 | Incognito playback of both episodes; no Access redirect | DESIGN COMPLETE |
| 3 | Collaborator can request access | Public minimum-data form and manual-review flow | WP-07 | Submission emails Brian, returns applicant receipt, and grants no access | DESIGN COMPLETE |
| 4 | Approved collaborator authenticates by email | Access exact-email OTP | WP-08 | Approved/unapproved OTP test and log evidence | DESIGN COMPLETE, but US-09 PIN-rate subcriterion is NO-GO |
| 5 | Evaluate evidence without identifiers | Protected de-identified evidence content/report | WP-09 | Research/privacy/content checklist and unauthenticated denial | DESIGN COMPLETE |
| 6 | Host can download enough material | Protected media manifest, individual assets and package | WP-10 | Completeness/rights/a11y/download exercise | DESIGN COMPLETE |
| 7 | Donor understands accomplishments, needs, sponsor, action | Protected Donor Brief and external/contact CTAs | WP-10 | Content review and action tests | DESIGN COMPLETE |
| 8 | Brian adds episode/manages partners without developer | Content-only episode workflow; Access dashboard runbooks | WP-04, WP-08, WP-13 | Brian performs rehearsal without auth-code changes | DESIGN COMPLETE |
| 9 | Accessible on likely devices, especially phones | WCAG 2.2 AA baseline and device matrix | WP-05, WP-15 | Manual/automated accessibility acceptance | DESIGN COMPLETE |
| 10 | No sensitive files/credentials/raw data public | Separation, scans, secret stores, Access direct-file gate | WP-01, WP-09, WP-12, WP-15 | Git/history/build/URL audit | DESIGN COMPLETE |
| 11 | Accurate shared-link preview | Per-page OG/Twitter metadata and images | WP-06 | Slack/Discord/X/Facebook debugger/manual previews | DESIGN COMPLETE |
| 12 | Private legal response plan reviewed | Private process artifact and tabletop | WP-14 | Brian sign-off and exercise | DESIGN COMPLETE |
| 13 | HTTPS, headers, 2FA, branch protection confirmed | Launch security checklist | WP-01, WP-12, WP-15 | Configuration evidence and scanners | DESIGN COMPLETE |

## Explicitly Outside the MVP traceability

| Outside item | Architecture exclusion confirmation | Verification |
|---|---|---|
| Public comments/community forums | No comment UI, endpoint, account, or storage component | Route/API/dependency inventory |
| Ordinary viewer accounts | Public routes/Stream are anonymous; Access only protects partner host | Incognito playback and route inventory |
| Paid memberships/subscriptions | No entitlement, billing, account, or paywall component | Architecture/payment audit |
| Merchandise | No catalog/cart/fulfillment routes | Route/content audit |
| Comprehensive lore encyclopedia | About and episode content remain MVP-scoped | Content/route audit |
| Custom donation processing | All contribution actions leave for Fractured Atlas; no card fields/callback | Form/network/dependency audit |
| Personalized donor dashboards | Donor Brief is common protected static content | Route/auth-role audit |
| Automated CRM integration | Form sends email only; no CRM connector/data sync | Worker binding/dependency audit |
| Multiple collaborator permission tiers | One exact-email Allow policy grants one portal tier | Access policy review |
| Live streaming | Only on-demand released Stream assets are modeled | Stream/content configuration audit |
| Native mobile applications | Responsive website only | Repository/project inventory |
| Screen-recording prevention | Allowed Origins discourages embedding; no DRM claim/control | Copy/security review |
| Full fair-use memo publication | Only approved summaries; memo remains private | Repository/build/download scan |
| Raw survey data hosting | Build cannot access raw source; only reviewed aggregates | Repository/history/artifact scan |
| Searchable database/custom CMS | Static collections; KV is only TTL abuse marker, Analytics Engine is aggregate telemetry | Service/data-model inventory |
| Third-party monitoring/APM/error tracking | No dedicated service; the already-required GitHub platform may run the free scheduled smoke check | Dependency/script/account inventory |
| Formal bug bounty/paid pentest | `security.txt` provides reporting; no bounty/pentest promise | File/copy/vendor audit |

## Cost feasibility matrix

| Capability | Cost classification | Decision |
|---|---|---|
| Pages/static delivery, Workers/Functions, KV, Turnstile, Web Analytics, Analytics Engine | Free within published quotas | Include; alert/review before any quota or pricing change |
| Cloudflare Access | Free below 50 active users; Access logs retained 24 hours | Include with 50-user cap; US-24 retention remains an owner decision |
| Cloudflare Stream | Near-free usage pricing: $5 per 1,000 stored minutes and $1 per 1,000 delivered minutes | Include because explicitly required; no autoplay/preload and billing alerts |
| GitHub Pro for private-repository branch protection | Approximately $4/month | Include only if Brian confirms this is near-free; otherwise US-24 is no-go |
| Domain registration | Existing annual cost | Include and auto-renew |
| Applicant email confirmation | Requires Workers Paid for arbitrary recipients | Exclude; use free on-page confirmation |
| Cloudflare standalone Health Check | Requires Pro or higher | Exclude; US-22 exact wording is no-go |
| Paid Access retention/seats, Enterprise Logpush/Bot Management, third-party APM | Above MVP cost ceiling | Exclude |

## Acceptance-criteria validation summary

- No known acceptance criterion is contradicted by the proposed public, partner, content, donation, privacy, accessibility, or deployment architecture.
- The design needs no application database or custom CMS. KV holds only a 24-hour HMAC duplicate marker, not content/submission records.
- Public films are anonymous; partner resources are protected at the edge on direct URLs and alternate hostnames.
- All donations are external to Fractured Atlas.
- No raw survey data or sensitive legal/insurance material enters a deployed repository.
- A four-or-more-episode fixture validates stable catalog/navigation.
- Routine publishing is content-only and cannot modify Access configuration.
- Security and accessibility have implementation tasks and launch tests.
- US-09/US-25 are no-go as written because Cloudflare Access does not expose a customer-configurable, independently testable per-email failed-PIN rate limit. Amend them to accept provider-managed OTP protections or obtain provider proof.
- US-22 is no-go as written because Cloudflare-native public-site Health Checks require Pro or higher and no on-demand Stream per-asset availability alert is documented. Amend it to allow free Cloudflare Incident/Pages alerts plus a scheduled GitHub Actions smoke check.
- US-24 remains open until Brian accepts the Free-plan 24-hour Access-log window and approximately $4/month GitHub Pro for protected private branches. No higher-cost retention plan is authorized.
