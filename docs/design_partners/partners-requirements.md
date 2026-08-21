# partners.correlius.org — Implementation-ready requirements package

**Status:** Proposed requirements baseline  
**Prepared:** 2026-08-20  
**Product owner:** Brian Payne  
**Scope:** Invitation-only partner portal  
**Legal posture:** Product and technical requirements; not legal advice

## 1. Executive summary and feasibility recommendation

The partner portal is feasible as a small, static, invitation-only site, but it is not yet implemented. The repository currently contains a public sign-in handoff, a binding-free bootstrap Worker, a closed former application endpoint, and automated public/private-boundary tests. It does not contain the approved separate private partner repository, substantive portal pages, protected downloads, protected film delivery, role-specific authorization, or complete approved-user/revocation test evidence.

Proceed with a **content-safe, one-tier MVP** in the approved private repository and Cloudflare Pages/Access architecture. Give community, media, and funding/professional partners task-specific paths without storing a role or implying that one partner has been profiled. Put only material safe for every approved portal user in that shared tier. Keep privileged legal advice, insurance records, detailed financial records, personal information, raw research, identity maps, and donor records outside the portal.

Do not add private film playback until both legal clearance and a technical design prove that the media bytes and direct playback URLs—not just the surrounding HTML—are protected. Publicly released films may be linked or embedded from Cloudflare Stream. Restricted films require a separately approved signed-delivery design; Cloudflare Access in front of a static page alone does not protect a Stream playback URL.

Do not add a public application, fundraising transaction, CRM, forum, or identity-linked analytics. For the MVP, contact, editorial decisions, feedback, and voluntary outcome reports use a structured email handoff. This meets the partner workflow without creating a new form database or retention burden. Raw traffic, accounts, and views are operational measures, not social impact.

### Repository-review finding

The prompt names `docs/design_partners/`; that directory does not exist. The governing files are under `docs/design/`. Documents 01–09 were approved on 2026-08-15 by [10-approved-architecture-decisions.md](../design/10-approved-architecture-decisions.md), and the 2026-08-19 [vetted-only decision](../design/12-vetted-partner-portal-decision.md) supersedes older application-flow language. This package uses the later decision when historical documents conflict.

### Current-state evidence

- `src/pages/for-partners/index.astro` contains an invitation-only handoff and no form.
- `functions/api/partner-access.js` returns non-cacheable HTTP 410 and has no bindings.
- `infra/partner-portal/worker.mjs` is a content-free bootstrap origin with crawler-denying and security headers.
- The three repository partner-boundary test suites passed on 2026-08-20.
- [launch-readiness.json](../acceptance/launch-readiness.json) still blocks the complete partner-access, evidence, media-kit, donor/professional, accessibility, operational, and security acceptance criteria.

## 2. Confirmed decisions, recommended assumptions, conflicts, and unresolved questions

### 2.1 Confirmed decisions

| ID | Confirmed constraint |
|---|---|
| CD-01 | Two independent repositories and Cloudflare Pages projects; the partner repository is private before substantive content is added. |
| CD-02 | Astro static output, schema-validated content, minimal client JavaScript, no application database or CMS. |
| CD-03 | Cloudflare Access email OTP, exact individually approved emails, deny by default, one authorization tier, eight-hour sessions, fewer than 50 active users. |
| CD-04 | No public registration, application, access request, automated approval, or account creation. Authorization is administered out of band. |
| CD-05 | Every partner page, file, preview, provider hostname, alias, and direct URL is protected before origin bytes are returned. |
| CD-06 | Public and partner builds contain no allowlists, secrets, credentials, raw research, identity maps, privileged legal material, insurance records, or source masters. |
| CD-07 | WCAG 2.2 AA is the implementation baseline. |
| CD-08 | Cloudflare-native aggregate traffic and Stream measurement are preferred; browser analytics, NEL, third-party trackers, session replay, fingerprinting, and identity joins are excluded. |
| CD-09 | Partner editorial independence is preserved; resources are optional and no unauthorized endorsement may be implied. |
| CD-10 | The system is operated primarily by one creator under the approved free/near-free cost envelope. |

### 2.2 Recommended assumptions

| ID | Recommended default | Reason |
|---|---|---|
| RA-01 | Treat all portal content as visible to every approved portal user. | Preserves the approved one-tier authorization model. |
| RA-02 | Segment by self-selected task path, not stored user role. | Gives relevant experiences without profiling or new authorization state. |
| RA-03 | Rename the visible “Donor Brief” experience to “Funding & Professional Brief,” while retaining the route until redirects are approved. | Supports grants, fiscal-sponsorship, advisory, and prospective-donor review without a donation solicitation. |
| RA-04 | Offer only public film playback in the initial MVP. | Private Stream delivery is not protected by Access alone and needs counsel plus a signed-delivery decision. |
| RA-05 | Use structured `mailto:` actions for decisions, questions, feedback, and optional outcome reporting. | Matches the approved minimal-contact architecture and avoids a form datastore. |
| RA-06 | Provide reviewed HTML transcripts when available and always require captions for any playable film. | Improves accessibility and search within the private page without making unreviewed transcripts authoritative. |
| RA-07 | Keep permission records and sensitive due diligence in an approved private records system outside both site repositories. | The shared portal tier is not an appropriate confidential-record system. |
| RA-08 | Review active partner access quarterly and content/permissions before every release. | Sustainable cadence for a solo operator. |

### 2.3 Conflicts, omissions, and outdated assumptions

| ID | Finding | Conflict or gap | Recommended disposition |
|---|---|---|---|
| CF-01 | Documents 01 and older diagrams mention a partner applicant/public form. | Superseded by AAD-08 and Decision 12. | Treat all applicant-flow language as historical; retain HTTP 410. |
| CF-02 | Existing design has one authorization tier and says approved partners can access all portal pages. The new brief says categories should not automatically see the same information. | True restricted role separation would change AAD-04/AAD-17. | Use relevance-based paths with shared-safe content in MVP; defer distinct security tiers. |
| CF-03 | Existing designs include a Donor Brief and Fractured Atlas donation CTA. The new brief says Correlius is not presently accepting public donations and excludes MVP fundraising. | The contribution action is outdated for this portal scope. | Present fiscal-sponsorship facts and readiness only; omit donation CTA until a new owner/legal decision. |
| CF-04 | Existing partner design assumes a protected evidence room but does not define film-evaluation pages or protected film playback. | The new portal purpose includes preview/access to authorized content. | Add evaluation pages; use public playback initially; defer restricted playback pending signed-media architecture and legal approval. |
| CF-05 | Existing design uses Contact Brian mailto and has no feedback workflow. | The new purpose includes decisions, feedback, requests, and voluntary outcomes. | Add structured email templates and a measurement rubric; do not add an MVP form. |
| CF-06 | Existing evidence model emphasizes an exploratory `n=11` panel. | That evidence cannot substantiate reach, broad demand, or social impact. | Retain limitations and separate resonance evidence from distribution/outcome evidence. |
| CF-07 | Current partner origin is a bootstrap Worker in the public repository. | Approved substantive portal must live in a separate private repository/Pages project. | Do not grow the Worker into the portal; replace its origin only after the private project and Access coverage pass. |
| CF-08 | Existing runbook says “Review the public request manually.” | There is no public request after Decision 12. | Correct operational language to “Review the privately sourced prospective relationship.” |
| CF-09 | Existing cost figures and provider capabilities are time-sensitive. | Prices, quotas, retention, and product behavior may change. | Revalidate before implementation and quarterly; do not silently exceed the owner-approved ceiling. |

### 2.4 Decisions that cannot responsibly be inferred

| ID | Decision needed | Recommended default until decided |
|---|---|---|
| UQ-01 | Final private repository and Cloudflare Pages project names/owners. | Create an owner-controlled private repository dedicated to the portal. |
| UQ-02 | Which films, if any, may be privately distributed, to whom, and for how long. | No restricted film delivery in MVP. |
| UQ-03 | Whether the `n=11` evidence is approved for partner release and in what exact wording. | Do not publish it until source, privacy, and claims review pass. |
| UQ-04 | Final partner contact address and response expectations. | Use one monitored role address and promise no response time. |
| UQ-05 | Approved stills, clips, biographies, descriptions, credits, and reuse terms. | Publish nothing downloadable without an item-level rights record. |
| UQ-06 | What financial/governance facts may appear in the shared professional brief. | Show only public or share-safe summary facts; share confidential due diligence out of band. |
| UQ-07 | Retention period and storage location for permission records and feedback emails. | Store privately, minimize content, review annually, delete when no longer needed or legally required. |
| UQ-08 | Whether reviewed HTML transcripts are available for each film. | Mark transcript status honestly; captions remain a playback release gate. |
| UQ-09 | Numeric monthly/annual operating ceiling and Stream alert threshold. | Do not enable a new paid capability until the owner records the ceiling. |
| UQ-10 | Who has emergency takedown authority if Brian is unavailable. | Designate one named backup operator in a private response plan before substantive launch. |

## 3. Stakeholder map and jobs to be done

| Stakeholder | Job to be done | Primary concern | Portal response |
|---|---|---|---|
| Blerd moderator/community host | Decide whether a film deserves scarce community attention and prepare a respectful discussion. | Trust, relevance, content fit, accessibility, moderation burden. | Concise evaluation facts, content notes, optional starters, hosting checklist, no prescribed endorsement. |
| Blerd podcaster | Research an episode/interview efficiently and avoid factual or rights mistakes. | Preparation time, usable bio/copy, topics, clips, attribution. | Media path, interview topics, copy blocks, approved assets, terms, contact. |
| Blerd influencer/social creator | Share authentically without becoming scripted promotion. | Voice, disclosure, audience trust, platform format. | Optional copy variants, approved visuals, clear reuse boundaries, explicit editorial independence. |
| Journalist/reviewer | Verify claims and obtain accurate source material. | Accuracy, attribution, availability, independence. | Fact sheet, version dates, evidence limits, press assets, direct questions channel. |
| Film-grants officer | Assess artistic purpose, public benefit, readiness, and credible outcomes. | Governance, feasibility, budget use, non-inflated impact. | Professional brief, milestones, plans, measurement ladder, share-safe evidence. |
| Prospective Black HNWI donor | Evaluate credibility, stewardship, risk, and readiness before a private conversation. | Governance, fiscal sponsorship, rights risk, use of funds, no pressure. | Share-safe overview and private-contact path; no public donation solicitation or control promise. |
| Legal/insurance/industry advisor | Understand distribution, rights, claims, and operating controls. | Privilege, confidentiality, chain of title, access is not permission. | Share-safe issue summary only; confidential records exchanged outside the shared portal. |
| Brian/administrator | Publish and revoke safely without an internal product team. | Low burden, clear gates, reversibility, cost. | Static schemas, checklists, provider-managed access, manifests, tests, concise runbooks. |

### Stakeholder conflicts and resolution

- **Promotional convenience vs editorial independence:** provide optional, editable materials and facts; never require wording, positive coverage, or prepublication approval.
- **Donor diligence vs confidentiality:** keep the shared portal concise and share-safe; send sensitive records out of band after individual review, under counsel-approved conditions where needed.
- **Partner convenience vs access security:** use email OTP and eight-hour sessions; accept modest login friction rather than expose direct assets.
- **Outcome evidence vs audience privacy:** ask partners for aggregate, optional reports; never request audience names, handles, email addresses, or unnecessary demographics.
- **Protected screening vs static simplicity:** do not fake protection. Use public films in MVP or approve a real signed-media architecture later.
- **Breadth vs solo maintainability:** ship a small reusable content system and a curated essential kit; defer CRM, CMS, granular roles, and dashboards.

## 4. Personas and principal user journeys

### P-COM — Community steward

Arrives with an invitation, authenticates, chooses “Community host,” evaluates runtime/themes/content notes/accessibility, watches an authorized film, downloads a host-ready image and description, selects optional conversation starters, decides independently, and emails a yes/no/not-now decision or later aggregate outcome.

### P-MED — Media maker

Authenticates, chooses “Media,” scans the fact sheet and creator bio, reviews film context, downloads approved stills/copy, checks permissions and expiry, selects interview topics, and contacts Brian with format and timing.

### P-PRO — Funding/professional evaluator

Authenticates, chooses “Funding & professional,” reviews artistic purpose, completed/planned work, fiscal-sponsorship status, risks, governance, and measurement definitions, then requests specific due-diligence material privately. No confidential record is exposed in the shared portal.

### P-ADM — Solo administrator

Approves an exact email in Cloudflare outside source control, publishes reviewed static content through the private repository, verifies Access on every hostname/path, updates or withdraws an asset, records permission privately, reviews aggregate measures, and revokes access when the relationship ends.

### Cross-cutting journeys

1. **Invitation and sign-in:** private outreach → portal URL → generic OTP → policy match → requested page → explicit logout.
2. **Evaluate a film:** task path → film facts → content/accessibility notes → authorized playback → optional supporting evidence → independent decision.
3. **Prepare coverage:** media/community path → approved facts/assets → permissions/credits → download → direct question if needed.
4. **Professional diligence:** share-safe brief → limitations/risks → private request for restricted records → out-of-band review.
5. **Report voluntarily:** structured email action → partner supplies aggregate outcome only → Brian classifies evidence privately → publication only with separate permission.
6. **Revoke:** remove exact email → revoke active tokens → test prior session and unauthenticated direct URLs → record result privately.

## 5. Proposed information architecture and navigation

### Authenticated primary navigation

| Route | Label | Purpose |
|---|---|---|
| `/` | Overview | Decision-oriented summary and self-selected Community, Media, or Funding & Professional path. |
| `/films/` | Films | Authorized film catalog with evaluation metadata and availability state. |
| `/films/{slug}/` | Film evaluation | Runtime, synopsis, themes, content notes, accessibility, rights-cleared playback/link, and relevant resources. |
| `/audience-evidence/` | Audience Evidence | Reviewed methods, findings, limitations, and report, if approved. |
| `/feature-correlius/` | Feature Correlius | Community and media use cases, optional topics, discussion starters, and formats. |
| `/media-kit/` | Media Kit | Approved copy, images, clips, biography, credits, terms, and packages. |
| `/donor-brief/` | Funding & Professional Brief | Artistic purpose, public benefit, milestones, plans, fiscal-sponsorship facts, measurement, risk, and private diligence contact. |
| `/contact/` | Contact & Feedback | Direct questions, decision response, support, and voluntary aggregate outcome templates. |
| `/downloads/{file}` | Protected resource | Manifested file; never linked or retrievable from a public origin. |
| `/robots.txt` | Crawler directive | `Disallow: /`; supplemental to Access. |

The home page asks what the partner is trying to do; it does not ask who they are, store a role, or change authorization. Contextual cross-links surface only relevant next steps. A visible logout action is available on every page.

## 6. Role and content-access matrix

| Content class | Public | Approved partner: community | Approved partner: media | Approved partner: funding/professional | Brian/admin | Advisor out of band |
|---|---:|---:|---:|---:|---:|---:|
| Portal shell and general project/film facts | No | Yes | Yes | Yes | Publish | As invited |
| Community hosting guidance | No | Primary | Available | Available | Publish | Not needed |
| Media kit and reuse terms | No | Available | Primary | Available | Publish | Review as needed |
| Share-safe evidence and professional brief | No | Available | Available | Primary | Publish | Review as needed |
| Public film playback | Public film page | Link/embed | Link/embed | Link/embed | Configure | Same as public |
| Restricted film master or private playback | No | No in MVP | No in MVP | No in MVP | Private source only | Only by separate approval |
| Raw research/identity map | No | No | No | No | Restricted private store | Individually approved |
| Privileged legal advice, insurance files | No | No | No | No | Restricted private store | Individually approved |
| Detailed financial/donor/personal records | No | No | No | No | Restricted private store | Individually approved |
| Access allowlist and authentication logs | No | No | No | No | Cloudflare only | No |
| Permission/consent register | No | No | No | No | Private record system | Counsel as needed |

“Primary” denotes relevance, not a distinct authorization grant. Introducing confidential portal tiers requires a new architecture decision, threat model, policy model, and tests.

## 7. Requirement conventions

- **Priority:** Must, Should, Could, Won't (MVP).
- **Phase:** Foundation, MVP, Release 1, Deferred, or Continuous.
- **Sources:** P-COM, P-MED, P-PRO, P-ADM; CD/RA/CF above; approved architecture decisions (AAD); user brief (UB); legal review (LR).
- A dependency of **Owner input** means the value cannot be invented by implementation.
- “Legal review” flags qualified-counsel review; the requirement is not a legal conclusion.

## 8. Functional requirements

| ID | Requirement statement | Source | Rationale | Priority | Phase | Dependencies | Testable acceptance criteria | Risks / flags |
|---|---|---|---|---|---|---|---|---|
| PAR-FR-001 | The public site **shall** provide only an invitation-only portal handoff and shall provide no registration, application, access-request, or account-creation workflow. | UB, CD-04, AAD-08 | Prevents unauthorized collection and false expectations. | Must | Foundation | Existing public site | DOM/build scans find no form or request code; GET and POST to retired endpoint return 410/no-store; link targets portal root only. | Privacy; enumeration. |
| PAR-FR-002 | The portal **shall** return an unauthenticated user to the originally requested authorized path after successful Cloudflare Access OTP and policy evaluation. | P-COM, P-MED, AAD-05 | Reduces partner friction. | Must | MVP | Access configuration | Approved test identity reaches three deep links after OTP; unapproved control reaches none. | Provider behavior. |
| PAR-FR-003 | The overview **shall** offer self-selected Community, Media, and Funding & Professional task paths without persisting a role. | UB, RA-02 | Relevance without role-state complexity. | Must | MVP | Approved IA/content | Each path is reachable in one action, changes page emphasis only, and creates no role cookie/profile/API record. | Users may infer tiers; label clearly. |
| PAR-FR-004 | The portal **shall** list each authorized film with title, runtime, one-sentence purpose, availability, caption status, transcript status, and evaluation link. | All partner personas | Supports fast screening decisions. | Must | MVP | Film metadata schema | Schema fixture with four films renders ordered cards; missing required fields fail build; unavailable films show no player. | Rights review. |
| PAR-FR-005 | Each film page **shall** present synopsis, intended audience, themes, content notes, runtime, accessibility assets, distribution status, and approved next actions before playback. | P-COM, P-MED, UB | Lets partners assess fit and risk. | Must | MVP | Approved film content | Content-review checklist passes; all fields appear as text; page remains useful when media fails. | Mental-health and claims review. |
| PAR-FR-006 | The portal **shall** play or link only to film content whose distribution state authorizes that audience and channel. | UB, CD-05, CF-04 | Access must follow permission. | Must | MVP | Legal decision per film; media architecture | Every rendered action maps to a release record with approval date/scope; unauthorized states produce no URL/player in output. | **Legal review.** |
| PAR-FR-007 | The portal **shall not** present restricted film playback until direct media URLs and bytes pass unauthenticated-denial tests independent of page protection. | UB, CF-04 | Access-protected HTML is not media protection. | Must | Foundation | Signed-delivery architecture addendum | Before any restricted film release, GET/HEAD/playback-token tests from unauthenticated and expired sessions return no playable bytes; otherwise build blocks the item. | **Security and legal gate.** |
| PAR-FR-008 | Audience Evidence **shall** present approved methodology, sample composition, balanced findings, limitations, counts/denominators, and accessible alternatives to charts. | P-PRO, P-MED, AAD-14 | Enables credible evaluation without overclaiming. | Should | MVP | Approved de-identified evidence | Reviewer traces every claim to a private evidence ID; percentages recompute; critical findings and limitations are present; no identifier scan findings. | Privacy; claims review. |
| PAR-FR-009 | Feature Correlius **shall** provide optional community-hosting and media-preparation guidance, no more than a small set of conversation starters, and no required talking points. | P-COM, P-MED, UB | Reduces preparation burden while preserving autonomy. | Must | MVP | Approved editorial content | Page labels resources optional, includes 3–7 starters, and contains no instruction to endorse, moderate in a prescribed way, or submit coverage for approval. | Reputational risk. |
| PAR-FR-010 | The Media Kit **shall** provide individually downloadable approved assets and one essential package, each generated from a validated manifest. | P-MED, P-COM, AAD-14 | Makes accurate coverage easier. | Must | MVP | Rights-cleared files | Manifest/file parity passes; each link names format/size/version; unauthenticated direct retrieval returns no file bytes; ZIP includes README/manifest. | **Rights review.** |
| PAR-FR-011 | The portal **shall** provide copy-and-paste project descriptions in at least short and standard lengths, plus optional social copy, all versioned and dated. | P-MED, P-COM | Reduces factual drift. | Should | MVP | Approved copy | Copy blocks are selectable without script, match canonical facts, include review date/version, and are labeled optional/editable. | Endorsement and platform disclosure. |
| PAR-FR-012 | The portal **shall** provide approved creator biography, headshot metadata, interview topics, and factual media information. | P-MED | Supports episode/interview preparation. | Must | MVP | Owner input; asset permissions | A media usability test locates each item within two minutes; download records carry credits and terms. | Publicity/likeness permission. |
| PAR-FR-013 | The Funding & Professional Brief **shall** distinguish completed work, planned work, artistic purpose, public benefit, fiscal-sponsorship facts, risk/readiness, measurement definitions, and private diligence next steps. | P-PRO, UB | Supports serious evaluation without public fundraising. | Must | MVP | Approved professional facts | Reviewer correctly distinguishes completed/planned and operational/social-impact evidence; no donation CTA, investment return, ownership, control, or tax claim appears. | **Legal/financial review.** |
| PAR-FR-014 | Contact & Feedback **shall** provide structured email actions for a question, editorial decision, support request, and optional aggregate outcome report. | All personas, RA-05 | Covers communication without a form datastore. | Must | MVP | Monitored role mailbox | Each action opens an editable draft with purpose-specific subject/body prompts; no message is sent automatically; no analytics payload contains draft content. | Mail-client variability; privacy. |
| PAR-FR-015 | The outcome-report template **shall** make every field optional except the partner's chosen reply content and shall instruct partners not to send audience-level personal data. | P-COM, P-MED, UB | Minimizes collection. | Must | MVP | Privacy copy | Template asks only for aggregate attendance/reach, format, notable themes, optional resonance, and follow-up interest; it explicitly rejects names, emails, handles, and raw comments. | Privacy; small-group re-identification. |
| PAR-FR-016 | The portal **shall** expose a visible logout action on every authenticated page. | All personas, AAD-05 | Supports shared/lost device safety. | Must | MVP | Access logout endpoint | Keyboard/mobile tests find logout; use ends session as provider documents; the next protected request requires authentication. | Provider-wide logout behavior must be explained. |
| PAR-FR-017 | Brian **shall** add, change, or retire portal content by editing validated records and manifested files without changing authentication code or navigation templates. | P-ADM, AAD-02 | Solo maintainability. | Must | MVP | Private repository schemas/runbook | Owner rehearsal publishes one content update and retires one asset through documented steps; invalid content fails CI. | Operator error. |
| PAR-FR-018 | Brian **shall** approve, remove, and urgently revoke an exact partner identity in Cloudflare Access without a site deployment. | P-ADM, AAD-05 | Separates authorization from content. | Must | Foundation | Access admin rights/runbook | Live rehearsal adds a test identity, authenticates, removes it, revokes active tokens, and verifies page/direct-file denial. | Identity data remains provider-side. |

## 9. Nonfunctional and accessibility requirements

| ID | Requirement statement | Source | Rationale | Priority | Phase | Dependencies | Testable acceptance criteria | Risks / flags |
|---|---|---|---|---|---|---|---|---|
| PAR-NFR-001 | The portal **shall** conform to WCAG 2.2 Level AA for portal HTML and supported interactions. | CD-07, all personas | Equal access and approved baseline. | Must | MVP | Accessible design/components | Automated checks have no serious violations; manual keyboard, screen-reader, focus, 200% zoom, 320 CSS px reflow, forced-colors, and reduced-motion checks pass. | Manual evidence required. |
| PAR-NFR-002 | Every playable film **shall** have human-reviewed synchronized English captions; every transcript labeled available **shall** be reviewed and structurally navigable. | P-COM, P-MED, UB | Media accessibility and accurate dialogue. | Must | MVP | Caption/transcript source | Caption QA passes timing/names/sounds/selection on released asset; transcript headings/speakers/order pass review; absence blocks the claimed state. | Caption rights/accuracy. |
| PAR-NFR-003 | The portal **shall** remain usable on current major desktop and mobile browsers, touch, keyboard, and viewport widths from 320 CSS pixels upward without horizontal content scrolling. | UB, AAD-11 | Partner work is often mobile. | Must | MVP | Responsive UI | Browser/device matrix passes primary journeys; no content overlap, clipping, or two-dimensional scroll except intrinsically wide data with an accessible alternative. | Test-device availability. |
| PAR-NFR-004 | Core pages **shall** remain understandable when client JavaScript, analytics, or video delivery fails. | AAD-02, P-ADM | Static resilience and low complexity. | Must | MVP | Static rendering | With JavaScript blocked, navigation, film facts, downloads, copy, and contact work; media failure shows text status and recovery path. | External provider outage. |
| PAR-NFR-005 | The portal **shall** use the approved free/near-free services and shall not enable an unapproved paid plan, seat, database, CMS, tracker, or monitoring product. | CD-10, AAD-16 | Sustainable operation. | Must | Continuous | Numeric owner ceiling | Monthly audit lists actual services/costs; threshold alert is tested; any projected breach pauses the dependent feature. | Provider pricing changes. |
| PAR-NFR-006 | The content model **shall** support at least four films, three partner task paths, and 50 active partner identities without route-template redesign. | UB, AAD-05 | Prevents immediate rework. | Must | MVP | Schema and fixture set | Four-film/three-path fixture builds successfully; performance and navigation tests pass; no hard-coded title sequence controls layout. | Access Free-plan cap. |
| PAR-NFR-007 | The authenticated overview **shall** let a first-time invited partner identify the relevant path and reach a film evaluation or resource within two minutes. | All personas | Measures usefulness, not accounts. | Should | MVP | Representative usability testers | At least 4 of 5 representative testers complete the relevant task within two minutes without moderator help; findings are resolved or accepted. | Small test sample. |
| PAR-NFR-008 | The portal **shall** use explicit, plain-language status, permission, expiry, content-note, and external-destination text rather than color or icons alone. | P-COM, P-PRO | Avoids ambiguity and inaccessible cues. | Must | MVP | Content/UI system | Automated semantics and human review confirm every status/permission/action is conveyed in text and remains visible in forced-colors. | Copy accuracy. |

## 10. Security requirements

| ID | Requirement statement | Source | Rationale | Priority | Phase | Dependencies | Testable acceptance criteria | Risks / flags |
|---|---|---|---|---|---|---|---|---|
| PAR-SEC-001 | Cloudflare Access **shall** authorize every request to every partner hostname and path before origin content is returned. | CD-03, CD-05, AAD-04 | Central security invariant. | Must | Foundation | Host inventory | Unauthenticated GET/HEAD to HTML, PDF, ZIP, image, missing path, and query variant on every custom/provider/preview/alias host returns challenge/denial and zero origin bytes. | Launch blocker. |
| PAR-SEC-002 | The Access policy **shall** allow only exact individually approved emails, use OTP only, contain no broad domain/everyone/login-method rule, and deny every nonmatch. | UB, AAD-05 | Invitation-only access. | Must | Foundation | Cloudflare config | Restricted screenshot/export review shows only approved selectors; approved and unapproved control tests produce expected policy results without storing identities in Git. | Human config error. |
| PAR-SEC-003 | Authentication responses **shall not** publicly disclose whether an entered email is approved. | UB, CD-03 | Prevents allowlist enumeration. | Must | Foundation | Hosted Access behavior | Paired approved/unapproved tests show indistinguishable public acknowledgement/error shape before mailbox delivery; no custom lookup endpoint exists. | Email delivery inherently informs mailbox owner. |
| PAR-SEC-004 | Partner sessions **shall** expire after eight hours and the portal **shall** support explicit logout. | AAD-05 | Limits exposure. | Must | Foundation | Access settings | Config audit confirms duration; expired-session and logout tests require new OTP before retrieving a protected page/file. | Provider propagation. |
| PAR-SEC-005 | Urgent revocation **shall** remove the email from policy and revoke active user tokens, followed by verification. | AAD-05, P-ADM | Policy removal alone may leave a session. | Must | Continuous | Revocation rights/runbook | Prior authenticated session and fresh request both fail within documented propagation window; dated result stored privately. | Response delay. |
| PAR-SEC-006 | Protected assets **shall** exist only in the private partner repository/project and shall have no public bucket, repository, build, sitemap, email-attachment, or alternate-origin copy. | CD-05, AAD-13 | Direct URL secrecy is not authorization. | Must | MVP | Separate private repo | Cross-repo artifact scans and hostname probes find no protected bytes; public manifest contains no partner route/file names beyond root handoff. | Historical Git exposure. |
| PAR-SEC-007 | Restricted video **shall** use an approved delivery mechanism that authorizes media requests and prevents reusable public playback URLs from bypassing the portal. | CF-04, UB | Page Access does not protect a media CDN URL. | Must if restricted video | Deferred | Architecture addendum; counsel; token service | Threat test covers copied manifest/segment/iframe URLs, expired/revoked sessions, alternate hosts, and direct requests; no test bypasses authorization. | **Security/legal no-go until approved.** |
| PAR-SEC-008 | Partner responses **shall** set tested CSP, `nosniff`, referrer, permissions, framing, cache, and `X-Robots-Tag` protections appropriate to each content type. | AAD-04, security design | Browser defense and leak reduction. | Must | MVP | Route/header inventory | Automated header tests pass on HTML/files/errors; CSP report-only trial precedes enforcement; protected sensitive files use private/no-store unless explicitly reviewed. | Overly strict CSP can break media. |
| PAR-SEC-009 | Portal secrets, credentials, tokens, account identifiers used for privileged operations, and allowlists **shall** remain in provider secret/configuration stores and never enter client code, source, logs, analytics, or artifacts. | UB, AAD-13 | Protects crown jewels. | Must | Continuous | Secret management | Secret scanners cover working tree/history/build/log samples; client bundle inspection finds none; rotation rehearsal succeeds for a scoped test token. | Historical exposure response required. |
| PAR-SEC-010 | Public and partner repositories, build outputs, deployment credentials, and Cloudflare projects **shall** remain independently scoped. | AAD-01 | Limits accidental publication and compromise blast radius. | Must | Foundation | Private repo/project | Repo visibility and deployment integration review pass; public build has no read path to private files; tokens have project-minimum scopes. | Account compromise remains residual risk. |
| PAR-SEC-011 | All administrative GitHub, Cloudflare, registrar, and monitored-mail accounts **shall** use unique credentials, 2FA where supported, controlled recovery, and least privilege. | Security design, P-ADM | Administrative accounts are crown jewels. | Must | Foundation | Provider/account access | Dated owner checklist confirms 2FA/recovery/scopes; no shared credential; recovery tabletop completes. | Avoid secrets in evidence. |
| PAR-SEC-012 | The private repository **shall** require reviewed changes, passing CI, pinned/controlled dependencies, and protected production deployment. | AAD-18 | Protects content integrity and supply chain. | Must | MVP | GitHub Pro approved | Branch/ruleset evidence shows direct push blocked, required checks enforced, dependency alerts enabled; an intentionally failing change cannot deploy. | Provider plan/cost. |
| PAR-SEC-013 | Download handling **shall** validate manifest paths, MIME/extension, file existence, size, metadata, malware/type checks, and orphan-file absence before deployment. | AAD-14, P-MED | Reduces malicious or accidental file exposure. | Must | MVP | Manifest tooling | CI rejects path traversal, MIME mismatch, missing file, extra file, and disallowed type fixtures; approved sample downloads correctly. | Malware tooling limits documented. |
| PAR-SEC-014 | Authentication and security logs **shall** be restricted to authorized administrators, reviewed after approval/revocation/incidents within available retention, and never joined to content analytics. | AAD-07, CD-08 | Security evidence without surveillance. | Must | Continuous | Cloudflare logs | Access review permissions and 24-hour retention are recorded; an event review is rehearsed; analytics query has no identity join. | Limited retention accepted. |
| PAR-SEC-015 | The portal **shall** fail closed during Access or origin misconfiguration and shall never use an unprotected fallback hostname or temporary public file link. | CD-05 | Availability must not defeat confidentiality. | Must | Continuous | Rollback/runbook | Misconfiguration tabletop selects protected rollback/maintenance behavior; inventory probe finds no bypass before and after rollback. | Availability tradeoff accepted. |

## 11. Privacy requirements

| ID | Requirement statement | Source | Rationale | Priority | Phase | Dependencies | Testable acceptance criteria | Risks / flags |
|---|---|---|---|---|---|---|---|---|
| PAR-PRV-001 | The portal **shall** collect no public applicant data and shall create no data merely because an unapproved person visits or attempts sign-in beyond provider security logs. | UB, AAD-08 | Data minimization. | Must | Foundation | Access/provider behavior | No form/API/store exists; privacy mapping identifies only provider auth/security events for failed attempts. | Provider metadata disclosed in notice. |
| PAR-PRV-002 | Analytics **shall** contain no email, name, affiliation, Access identity, audience identifier, message, query string, free text, fingerprint, or precise individual journey. | CD-08, UB | Prevents surveillance. | Must | MVP | Event schema | Schema rejects forbidden fields/arbitrary keys; stored-event inspection contains only approved enums/count context. | Small counts may still reveal activity. |
| PAR-PRV-003 | Portal analytics, Access logs, mailbox records, Stream data, donations, and research records **shall not** be joined into an individual profile. | AAD-09, UB | Avoids hidden behavioral dossiers. | Must | Continuous | Data map | Architecture/queries contain no common person key; annual audit confirms no export or manual joined profile. | Manual inference risk. |
| PAR-PRV-004 | Raw audience research, direct identifiers, quote identity mappings, and unnecessary demographics **shall** remain outside both repositories and deployed systems. | AAD-13, UB | Protects research participants. | Must | Continuous | Private storage | Repo/history/build scans find none; released evidence traces through non-identifying IDs; authorized private location is documented. | Re-identification in small samples. |
| PAR-PRV-005 | Voluntary partner feedback **shall** request only aggregate or organization-level information necessary for the stated measurement purpose. | UB, P-COM | Learns without audience surveillance. | Must | MVP | Feedback template | Field audit finds no required audience personal data/demographics; instructions prohibit raw attendee lists, screenshots of members, or verbatim identifiable comments. | Partner may ignore instruction; triage required. |
| PAR-PRV-006 | If unsolicited personal data arrives, Brian **shall** minimize further copying, restrict access, and delete or retain it according to an approved private retention rule. | P-ADM, UB | Handles foreseeable mailbox data. | Must | Continuous | Private retention policy | Tabletop documents triage, storage, access, deletion, and escalation without placing sample PII in Git. | Legal retention advice may be needed. |
| PAR-PRV-007 | The portal privacy notice **shall** accurately describe Access, hosting, Stream, aggregate traffic measurement, email handoff, retention limits, data rights/contact, and excluded tracking. | UB, AAD-09 | Transparency. | Must | MVP | Final provider configuration | Data-flow review maps each notice statement to configuration; no undisclosed tracker/storage is found. | **Privacy/legal review.** |
| PAR-PRV-008 | Published partner names, logos, quotations, testimonials, screenshots, or outcome examples **shall** require explicit, scope-specific publication permission recorded outside the repository. | UB | Avoids unauthorized publicity. | Must | Continuous | Permission register | Release checklist links each item to permission scope, channels, wording, expiry/revocation; missing/expired permission blocks publication. | **Consent/publicity review.** |
| PAR-PRV-009 | Aggregate reports **shall** suppress, combine, or narratively generalize small cells when disclosure could identify a partner or audience member. | UB, P-COM | Small groups are re-identifiable. | Must | MVP | Suppression rule | Test report with one/two-partner cells is suppressed or combined; reviewer records rationale; no identity can be inferred from labels plus timing. | Threshold needs owner approval; default under 5. |

## 12. Content model and content requirements

| ID | Requirement statement | Source | Rationale | Priority | Phase | Dependencies | Testable acceptance criteria | Risks / flags |
|---|---|---|---|---|---|---|---|---|
| PAR-CNT-001 | Project content **shall** state that Correlius is an independently produced, nonprofit and noncommercial Star Wars fan-story project created first and foremost for the Blerd community. | UB | Core positioning. | Must | MVP | Approved copy | Exact fact review passes on overview, film, and professional surfaces without inconsistent variants. | **Trademark/fan-work disclaimer review.** |
| PAR-CNT-002 | Content **shall** describe the themes as allegorical exploration and shall not present diagnosis, treatment, clinical guidance, or therapeutic outcomes. | UB, P-COM | Mental-health safety and accuracy. | Must | MVP | Approved copy | Claims lexicon scan and human review find no diagnostic/treatment instruction or causal clinical claim; support disclaimer appears where relevant. | **Mental-health/legal review.** |
| PAR-CNT-003 | Content **shall** explain that established Blerd communities remain the place for discussion and that the portal is not a replacement community. | UB | Prevents platform drift. | Must | MVP | Overview/community copy | Overview and Feature pages state the boundary; no forum/comment/member-directory feature or invitation appears. | None. |
| PAR-CNT-004 | Each film record **shall** include stable ID, slug, title, version, runtime, synopsis lengths, themes, content notes, intended audience, distribution state, review date, captions, transcript, imagery, credits, and approval flags. | UB, AAD-14 | Single source of truth for evaluation. | Must | MVP | Schema | Missing/invalid/duplicate/reused IDs and inconsistent release states fail CI; versioned fixture renders all fields. | Rights and claims review. |
| PAR-CNT-005 | Distribution metadata **shall** identify public, partner-restricted, unavailable, or retired state; authorized audiences/channels; start/end or review date; and approving authority. | CF-04, UB | Prevents accidental over-distribution. | Must | MVP | Owner/legal input | Build renders playback/download only when state, scope, and approval are complete; expired/review-due records fail or withhold action. | **Legal review.** |
| PAR-CNT-006 | Every downloadable asset record **shall** include stable ID, title, description, file, MIME type, bytes, version/date, rights owner/source, allowed uses/channels, attribution, alterations, expiry/review date, accessibility description, and package membership. | P-MED, UB | Enables responsible reuse. | Must | MVP | Manifest/schema | CI rejects absent fields and expired approvals; rendered download row shows material terms before download. | **Rights review.** |
| PAR-CNT-007 | Approved copy blocks **shall** have a stable ID, audience/use, length, text, version, approver, review date, and claims/legal status. | P-MED, AAD-14 | Controls factual drift. | Should | MVP | Copy schema | Duplicate IDs and unapproved status fail build; rendered block matches source byte-for-byte and shows version/review date. | Platform-specific disclosures. |
| PAR-CNT-008 | Evidence records **shall** store counts and denominators, derive percentages, name the population, include limitations/direction, and use a non-identifying source evidence ID. | AAD-14, CF-06 | Credible and auditable evidence. | Must if evidence published | MVP | Approved evidence | Percentage mismatch fails build; every finding has limits and trace ID; source trace review passes without deployed identity map. | Privacy; claims. |
| PAR-CNT-009 | Professional-brief content **shall** separate completed milestones, planned work, funding purposes, governance facts, fiscal-sponsorship facts, risks, and assumptions. | P-PRO | Supports diligence without blurring fact/plan. | Must | MVP | Owner input | Reviewer classifies every statement correctly; status is textual; amounts are absent unless approved and dated. | Financial/legal review. |
| PAR-CNT-010 | Repeated project facts, film facts, creator facts, and disclaimers **shall** be sourced from canonical content records rather than copied independently across pages. | P-ADM, AAD-02 | Reduces maintenance and inconsistency. | Must | MVP | Content architecture | Static analysis/content tests detect duplicate canonical fields; one fixture update changes every intended rendering. | Over-normalization; keep schemas usable. |
| PAR-CNT-011 | Every portal page and resource **shall** display or expose a content version/review date appropriate to its risk, and stale/expired items shall be withdrawn or clearly marked. | P-MED, P-PRO | Partners need current material. | Must | MVP | Review cadence | CI flags past-due high-risk items; page/resource shows review date; withdrawn asset is absent from build and package. | Old downloaded copies remain residual risk. |
| PAR-CNT-012 | Conversation starters **shall** remain brief, optional, culturally respectful, and non-clinical, and shall not form a comprehensive curriculum or workshop. | UB, P-COM | Keeps MVP focused. | Must | MVP | Editorial review | 3–7 starters pass review; no lesson plan, assessment, learning objective system, or clinical facilitation claim exists. | Safeguarding/context. |

## 13. Film, media-kit, and asset-management requirements

The functional and content requirements above govern the experience and metadata. Operationally, a film or asset cannot be released until all applicable content, accessibility, rights, privacy, security, and legal flags are cleared. Source masters stay in backed-up private storage; public Stream assets and protected downloadable derivatives are delivery copies, not archives. Short clips are **Could / Release 1** and require clip-specific counsel/rights review. Stills, biographies, approved descriptions, and interview topics are **Must / MVP** when source materials are available. Restricted full-film playback is **Deferred** under PAR-FR-007 and PAR-SEC-007.

## 14. Partner feedback and impact measurement requirements

### Measurement ladder

| Level | Definition | Minimum evidence for the claim | Claims not justified by that evidence |
|---|---|---|---|
| Reach | Potential or delivered exposure in a defined channel. | Platform/provider aggregate with date range, scope, and known counting limits. | Unique people, viewing, resonance, or impact. |
| Consumption | Film start, completion proxy, or minutes consumed. | Verified Stream definition plus aggregate starts/minutes/completion metric where available. | Attention, comprehension, changed behavior, or unique persons unless proved. |
| Engagement | Observable low-friction action around the film. | Aggregate reactions, link selections, downloads, or partner-reported participation with method. | Meaningful conversation or resonance. |
| Conversation | A discussion, interview, Q&A, review, or moderated exchange occurred. | Partner confirmation plus format/date and aggregate attendance or publication link when volunteered. | Positive reception or social impact. |
| Reported resonance | Participants or partner report that themes felt relevant, memorable, or discussion-worthy. | Voluntary, clearly attributed method; count/denominator or contextual qualitative account; permission for quotes. | Representative audience demand, clinical benefit, or behavioral change. |
| Repeat partnership | The same organization voluntarily features or requests Correlius again. | Two or more separately dated partner-confirmed activities, recorded privately and aggregated. | Audience-level impact. |
| Social-impact evidence | A credible, bounded change connected to a stated public-benefit objective. | Predefined outcome, appropriate method/baseline, plausible contribution, documented limitations, privacy review, and preferably independent or qualified evaluation. | Causal or population-wide impact without a suitable study. |

| ID | Requirement statement | Source | Rationale | Priority | Phase | Dependencies | Testable acceptance criteria | Risks / flags |
|---|---|---|---|---|---|---|---|---|
| PAR-ANA-001 | Correlius **shall** maintain a measurement dictionary that separately defines reach, consumption, engagement, conversation, reported resonance, repeat partnership, and social-impact evidence. | UB, CF-06 | Prevents metric inflation. | Must | MVP | Approved definitions | Every dashboard/report metric maps to one level, source, unit, limitation, and prohibited stronger claim. | Claims review. |
| PAR-ANA-002 | Reports **shall not** describe raw views, portal visits, account approvals, or account creation as social impact. | UB | Core measurement constraint. | Must | Continuous | Measurement dictionary | Automated copy scan and human report review find no prohibited equivalence; corrections are required before release. | Reputational risk. |
| PAR-ANA-003 | Reach and consumption **shall** be reported using the provider's current verified definitions, date range, hostname/asset scope, and limitations. | CD-08 | Provider metrics are often ambiguous. | Must | MVP | Cloudflare/Stream configuration | Sample report cites definition date/scope and reconciles a known test; it does not label starts as completions or people without proof. | Provider definition changes. |
| PAR-ANA-004 | Engagement **shall** count only enumerated aggregate actions and shall remain distinct from authentication and page traffic. | UB, AAD-09 | Avoids identity tracking. | Must | MVP | Event schema | Test events store approved enum/date/surface only; Access identities and arbitrary routes are absent; outage does not block action. | Sparse counts. |
| PAR-ANA-005 | Conversation **shall** be counted only when a partner voluntarily confirms that a discussion, interview, Q&A, review, or comparable exchange occurred. | P-COM, P-MED | A click is not a conversation. | Must | MVP | Feedback workflow | Recorded example includes format/date/source and no attendee PII; contact-link selection alone remains “contact selected.” | Self-report bias. |
| PAR-ANA-006 | Reported resonance **shall** state who reported it, how it was elicited, count/denominator when quantitative, limitations, and permission status for any quotation. | UB, P-PRO | Keeps qualitative evidence honest. | Must | MVP | Feedback/evidence process | Each released claim passes evidence and permission checklist; anonymous quote is traceable privately and non-identifying publicly/partner-wide. | Small samples; desirability bias. |
| PAR-ANA-007 | Repeat partnership **shall** require at least two separately dated, voluntarily confirmed partner activities and shall be reported in aggregate unless publication permission exists. | UB | Stronger than one-time interest. | Should | Release 1 | Private partner record | Test record satisfies two-event rule; report suppresses identity and small cells; a single invitation does not count. | Relationship data retention. |
| PAR-ANA-008 | Correlius **shall** make no social-impact claim from portal analytics alone and shall require a separately approved evaluation plan for any stronger outcome claim. | UB, P-PRO | Impact requires evidence design. | Must | Continuous | Owner/evaluator approval | Claims review rejects portal-only causal/outcome language; approved impact report includes objective, method, baseline/comparator where appropriate, limitations, privacy, and reviewer. | **Research/legal review.** |
| PAR-ANA-009 | Aggregate partner reports **shall** apply small-cell suppression and shall not publish partner names, logos, quotations, or campaign results without explicit permission. | UB, PAR-PRV-008 | Protects partners and audiences. | Must | Continuous | Permission register | Report fixture suppresses under-5 cells by default; permission check blocks named example; withdrawal process removes future use. | Re-identification. |

## 15. Administrative and operational requirements

| ID | Requirement statement | Source | Rationale | Priority | Phase | Dependencies | Testable acceptance criteria | Risks / flags |
|---|---|---|---|---|---|---|---|---|
| PAR-OPS-001 | Brian **shall** operate access, content, assets, releases, and takedowns from concise owner runbooks with no routine authentication-code edit. | P-ADM | Solo operability. | Must | MVP | Updated runbooks | Brian completes publish, withdrawal, approval, revocation, and rollback rehearsals without developer assistance. | Bus factor. |
| PAR-OPS-002 | The portal **shall** use a release checklist that gates accuracy, accessibility, privacy, rights, legal claims, permissions, manifest parity, Access coverage, and rollback safety. | AAD-14, AAD-18 | Human review is required. | Must | MVP | Checklist/CI | A release cannot be marked approved while any applicable gate is blank/failed; dated reviewer/owner decision is retained privately. | Self-review limitations. |
| PAR-OPS-003 | Brian **shall** inventory partner hostnames, aliases, previews, direct-file classes, and Access coverage at launch, quarterly, and after configuration changes. | PAR-SEC-001 | Prevents forgotten bypasses. | Must | Continuous | Host inventory | Denial matrix passes on every inventory entry; newly discovered host blocks release until protected or disabled. | Provider-created aliases. |
| PAR-OPS-004 | Brian **shall** review exact-email access entries quarterly and on relationship change, keeping active users below 50. | AAD-05 | Least privilege and cost control. | Must | Continuous | Private relationship record | Quarterly record shows each entry retained/removed with no email in Git; active count remains below 50 or triggers scope decision. | Identity retention. |
| PAR-OPS-005 | Brian **shall** maintain item-level permission and rights records outside the repositories and review them before every affected release. | UB, P-ADM | Assets and testimonials have different scopes. | Must | Continuous | Private register | Sample release traces every image/clip/name/quote to scope/approver/date/expiry; missing record blocks build approval. | **Legal review.** |
| PAR-OPS-006 | Brian **shall** monitor deployment failures, provider incidents, security/billing events, Access activity after changes, Stream usage, and the protected origin through the approved free mechanisms. | AAD-10, AAD-16 | Detects failure within cost constraints. | Must | Continuous | Alerts/smoke check | Test notifications arrive; scheduled smoke test detects induced safe failure; monitoring outage does not expose content or auto-upgrade. | Limited free-tier coverage. |
| PAR-OPS-007 | Brian **shall** maintain recoverable backups of repositories, source masters, approved derivatives, restricted records, and essential configuration inventories with annual restore rehearsal. | P-ADM, security design | Stream and Pages are not archives. | Must | Continuous | Private backup plan | Clean restore of repo plus sample master checksum succeeds annually; secrets/recovery codes remain outside repo backup. | Backup confidentiality. |
| PAR-OPS-008 | Brian **shall** have an ordinary rollback process and a distinct security/privacy/legal removal process that does not restore forbidden content from an older deployment. | AAD-18 | Safe reversibility. | Must | MVP | Deployment history/private response plan | Tabletop identifies safe deployment by manifest; urgent test disables content/access first and verifies all alternate URLs before restoration. | **Legal response.** |
| PAR-OPS-009 | Brian **shall** revalidate provider capabilities, quotas, pricing, retention, and documented security behavior before implementation and at least quarterly. | CF-09 | Approved documents contain time-sensitive assumptions. | Must | Continuous | Provider review checklist | Dated review records current limits without secrets; change affecting a requirement creates a decision/blocker before spend or launch. | External dependency. |
| PAR-OPS-010 | Administrative audit records **shall** capture content release, asset withdrawal, permission decision, access approval/revocation, incident, and measurement publication without storing secrets or unnecessary PII in Git. | P-ADM, UB | Accountability without surveillance. | Must | Continuous | Private record system | Sample records contain event type/date/authority/result/evidence location; Git scan finds no identity/secret payload. | Retention policy required. |

## 16. Legal, rights, disclaimer, and claims-governance requirements

| ID | Requirement statement | Source | Rationale | Priority | Phase | Dependencies | Testable acceptance criteria | Risks / flags |
|---|---|---|---|---|---|---|---|---|
| PAR-LEG-001 | Portal and asset materials **shall** use counsel-reviewed fan-project, ownership, affiliation, and non-endorsement language consistently. | UB, CD-09 | Avoids false affiliation. | Must | MVP | Qualified counsel/approved copy | Public/partner/asset README comparison finds consistent current disclaimer; no Disney/Lucasfilm endorsement claim appears. | **Legal review.** |
| PAR-LEG-002 | Brian **shall** obtain film-specific legal review of whether earlier analysis applies to each work and its current public, restricted, screening, clip, and platform distribution model. | UB | Fair-use/risk analysis is fact-specific. | Must | Before each release | Film/distribution facts; counsel | Private release record identifies film/version/channels and counsel disposition; absent or stale disposition blocks the channel. | **Qualified counsel required.** |
| PAR-LEG-003 | Access control **shall not** be described or treated as a substitute for copyright, trademark, publicity, privacy, contract, or distribution permission. | UB | Security and permission are different controls. | Must | Continuous | Claims guidance | Architecture/copy/release review contains this distinction; no “safe because private” rationale approves an asset. | **Legal review.** |
| PAR-LEG-004 | Each downloadable still, clip, logo, headshot, biography, quotation, and package **shall** have documented source, rights basis, approved use, attribution, alteration rule, channel, and expiry/review status. | UB, P-MED | Partners need clear reuse authority. | Must | MVP | Permission register | Item-level trace passes; expired/unapproved asset is excluded; ZIP README matches manifest terms. | **IP/publicity review.** |
| PAR-LEG-005 | Partner resources **shall** state that partners retain editorial independence and are not required to use supplied wording, provide favorable coverage, or obtain Correlius approval of commentary. | UB, P-MED | Protects authenticity and avoids implied endorsement. | Must | MVP | Approved usage guidance | Guidance and copy blocks contain the statement; no workflow conditions access on coverage or sentiment. | Reputational/FTC-style disclosure review as applicable. |
| PAR-LEG-006 | Correlius **shall not** publish a partner name, logo, quotation, testimonial, advisor relationship, review, or outcome in a way that implies endorsement beyond explicit written permission. | UB | Prevents false endorsement. | Must | Continuous | PAR-PRV-008 register | Publication checklist matches exact name/wording/channel/term; revoked/expired permission prevents future publication. | **Legal review.** |
| PAR-LEG-007 | Mental-health content **shall** include appropriate context and shall not make diagnostic, therapeutic, crisis-service, efficacy, or clinical-supervision claims. | UB | Project is allegorical art, not healthcare. | Must | MVP | Approved claims lexicon | Human/copy scan passes; film content notes distinguish themes from advice; no unsupported outcome claim appears. | **Mental-health/legal review.** |
| PAR-LEG-008 | Fiscal-sponsorship and funding content **shall** accurately describe current Fractured Atlas status and shall not solicit public donations, promise deductibility, ownership, investment return, creative control, or benefit unless specifically approved. | UB, CF-03 | Current operating context excludes fundraising. | Must | MVP | Current sponsor facts/counsel | Professional brief has no donation transaction/CTA and passes factual review; future activation requires recorded decision and updated tests. | **Tax/fundraising legal review.** |
| PAR-LEG-009 | Confidential legal opinions, insurance claims/policies, detailed financial records, personal donor data, and privileged communications **shall not** be placed in the shared portal tier. | UB, RA-07 | Shared approved users have different need-to-know. | Must | Continuous | Information classification | Artifact/repo scans and human review find none; diligence requests route to a private, individually approved process. | Privilege/confidentiality. |
| PAR-LEG-010 | Claims about artistic purpose, public benefit, audience evidence, outcomes, readiness, governance, insurance, or legal review **shall** have an owner, source, permitted wording, review date, and approval status. | P-PRO, UB | Prevents stale or inflated claims. | Must | MVP | Claims register/schema | Each high-risk claim traces to current source and approver; expired/unapproved claim fails release; portal does not publish legal conclusions or insurance assurances. | **Legal/financial review.** |

## 17. Threat model and abuse cases

| Threat / abuse case | Asset at risk | Required controls | Residual risk / response |
|---|---|---|---|
| Guessed PDF/ZIP/image path bypasses UI | Partner assets | PAR-SEC-001, 006, 013; direct GET/HEAD matrix | Misconfiguration is a launch blocker; withdraw and audit every hostname. |
| Copied private-video URL plays outside portal | Restricted film | PAR-FR-007, PAR-SEC-007 | No restricted video in MVP; signed design still cannot prevent screen recording. |
| Unapproved person probes emails | Allowlist/privacy | Generic Access responses, no custom lookup, restricted logs | Mailbox delivery reveals status to the address owner; acceptable provider behavior. |
| Lost approved device/session | Portal content | Eight-hour session, logout, token revocation | Exposure until revocation propagates; partner reporting guidance needed. |
| Approved partner redistributes download | Rights/reputation | Least content, visible terms, expiry, watermark only if approved | Access cannot control post-download copying; legal/relationship response. |
| Public build accidentally includes partner file | Confidentiality | Separate repo/project, build scans, manifests, scoped integrations | Historical Git/deployment exposure requires incident response. |
| Raw feedback identifies audience member | Privacy | Aggregate-only instructions, minimization, small-cell rules, private triage | Unsolicited data may arrive by email; delete/restrict under policy. |
| Partner name/quote used without scope | Consent/reputation | Permission register and release gate | Remove future use; assess correction/notification with counsel. |
| Compromised admin/dependency alters content | Integrity/secrets | 2FA, branch protection, review, pinned dependencies, rollback | Account recovery and incident rehearsal required. |
| Search crawler indexes portal | Confidentiality/discovery | Access first; noindex/noarchive; robots; no sitemap | Crawler directives alone are insufficient; test unauthenticated bytes. |
| Analytics becomes surveillance | Partner/audience privacy | Enumerated aggregate schema, no identity joins, suppression | Manual reports can still leak small cohorts; privacy review each release. |
| Old deployment restores withdrawn content | Rights/privacy/legal | Safe-deployment manifest review and separate removal runbook | Disable source asset/access first for urgent cases. |
| False endorsement or impact claim | Trust/legal posture | Claims register, editorial independence, permission gates | Correct promptly; preserve evidence and consult qualified counsel. |
| Solo-operator unavailability | Availability/control | Backups, private emergency authority, concise runbooks | One trusted backup administrator is still an unresolved dependency. |

## 18. MVP, later releases, and explicitly out of scope

### Candidate capability disposition

| Candidate capability | Disposition | Reason / implementation boundary |
|---|---|---|
| Secure partner landing page and authentication handoff | **Required / Foundation** | Already bootstrapped; must pass the complete Access denial and identity rehearsal. |
| Role-appropriate dashboard | **Required / MVP, modified** | Use self-selected task paths with no stored role; this is relevance, not distinct authorization. |
| Film-evaluation pages | **Required / MVP** | Central to a partner's decision. |
| Protected video access | **Deferred** | Access-protected HTML does not protect Stream media; requires film-specific legal clearance and signed-delivery architecture. |
| Runtime, synopsis, themes, and content notes | **Required / MVP** | Minimum evaluation facts. |
| Captions and transcripts | **Captions required; reviewed transcripts optional / MVP** | Captions gate playback; transcripts ship only when accurate reviewed sources exist. |
| Creator biography and project background | **Required / MVP** | Needed for credibility and media preparation. |
| Downloadable approved images and short clips | **Images required; clips optional / Release 1** | Every derivative needs item-level permission; clips create additional fan-work/distribution risk. |
| Copy-and-paste descriptions and social captions | **Recommended / MVP** | Reduces partner work while remaining optional and editable. |
| Podcast interview topics and media information | **Required / MVP** | High-value, low-complexity support for media partners. |
| Asset permissions, attribution, and expiration rules | **Required / MVP** | A release gate, not optional guidance. |
| Contact and support workflow | **Required / MVP** | Structured email handoff avoids a new personal-data system. |
| Voluntary partner-feedback form | **Deferred; structured email required / MVP** | Meets the job without form storage, spam controls, retention, and operations. Reconsider only with evidence of need. |
| Privacy-conscious partner-specific or campaign links | **Deferred** | Individualized links can become identity tracking. A later design must use purpose-limited opaque campaign IDs, aggregate reporting, expiry, suppression, and no Access/log join. |
| Aggregate engagement reporting | **Required / MVP** | Must use the measurement ladder and privacy rules; authentication/page visits are not impact. |
| Permission management for partner names, quotes, and testimonials | **Required / MVP, private administration** | Maintain a scope-specific register outside both repositories; no portal UI is needed. |
| Separate professional due-diligence area | **Deferred** | Conflicts with the approved one-tier MVP; sensitive diligence remains individually shared out of band. |
| Administrative content and access management | **Required / MVP, provider/repository based** | Use Git/Astro for content and Cloudflare for identities; no custom CMS/admin panel. |
| Audit logging and access revocation | **Required / Foundation and continuous** | Use available Cloudflare logs plus private minimal decision records and tested active-token revocation. |

### Required for MVP

- Private Astro repository/Pages project; complete Access host/path coverage; approved/unapproved/session/logout/revocation evidence.
- Overview with self-selected partner paths; film catalog and evaluation pages; public-authorized playback links only.
- Captions for all playable films and honest transcript status; reviewed HTML transcripts where supplied.
- Feature/community guidance, concise optional conversation starters, media kit, approved copy, bio, stills, rights/attribution metadata, and essential package.
- Share-safe Funding & Professional Brief with no donation solicitation.
- Structured contact, decision, feedback, and aggregate outcome email actions.
- Privacy notice, claims/disclaimer governance, aggregate measurement dictionary, content/asset manifests, runbooks, and launch tests.

### Optional for MVP / Should if approved inputs exist

- De-identified Audience Evidence page and accessible report.
- Reviewed HTML transcripts.
- Multiple lengths of social copy and platform-neutral image variants.
- Share-safe high-level budget categories or timeline, without confidential figures.

### Release 1 or later

- Rights-cleared short clips with item-level terms.
- Repeat-partnership reporting after enough elapsed time and data.
- Additional languages/caption tracks based on demonstrated need.
- A separately approved restricted-video system using signed, session-bound delivery.
- Distinct confidential professional-diligence tier only after a new authorization/data architecture decision.
- A privacy-reviewed feedback form only if structured email becomes operationally inadequate.

### Explicitly out of scope / Won't for MVP

- Public partner registration, applications, access requests, waitlists, or automated approval.
- Forums, comments, member profiles/directories, DMs, feeds, notifications, or a new community platform.
- Public donations, fundraising transactions, merchandise, subscriptions, memberships, donor dashboards, or investment/control promises.
- CRM automation, marketing automation, public newsletter signup, identity-linked/campaign surveillance, session replay, ad tracking, or audience-level demographic collection.
- Extensive curricula, workshops, certifications, learning-management features, or clinical guidance.
- Raw research hosting, participant identity maps, confidential legal/insurance/financial/personal records, or source masters.
- DRM or promises to prevent screenshots, downloads, or screen recording.
- Custom identity provider, app database, general CMS, native app, live streaming, or paid enterprise security/observability absent a new decision.

## 19. Dependencies, risks, and mitigations

| Dependency / risk | Impact | Mitigation / gate |
|---|---|---|
| Private repository/project not created | No substantive portal can be safely implemented. | Create and protect it before content; do not expand bootstrap Worker. |
| Legal status of each film/distribution path unresolved | Playback or downloads could exceed permission. | Default to no restricted playback/download; obtain film- and use-specific counsel review. |
| Rights-cleared kit inputs unavailable | Media/community value reduced. | Launch only approved facts/bio/stills; label omissions; never substitute unlicensed Star Wars promotional material. |
| One-tier access conflicts with sensitive diligence | Overexposure or architectural drift. | Keep shared tier share-safe; use individually controlled out-of-band diligence; require new decision for tiers. |
| `n=11` evidence is small/nonrepresentative | Overclaiming and reputational harm. | Counts, subgroup context, limitations, balanced findings, no reach/impact claim. |
| Solo creator workload | Stale content, permissions, or access. | Minimal records, manifests, quarterly cadence, no CMS/form/CRM; withdraw stale content automatically. |
| Cloudflare product/price changes | Requirement/cost failure. | Revalidate before build and quarterly; fail closed; no automatic paid upgrade. |
| Email feedback brings unsolicited PII | Privacy burden. | Aggregate-only prompts, private triage/retention rule, no forwarding into Git/issues. |
| Download redistribution | Rights/reputation risk. | Curate low-risk derivatives, explicit terms/credits/expiry; accept that Access is not DRM. |
| Admin account compromise | Full portal/DNS exposure. | 2FA, least privilege, recovery controls, branch protection, scoped integrations, incident rehearsal. |
| No backup operator | Delayed takedown/recovery. | Designate and train one trusted emergency operator in private records. |

## 20. Test strategy and definition of done

### Test layers

1. **Schema/unit:** film, asset, copy, evidence, claim, and manifest validation; invalid/expired/path-traversal fixtures.
2. **Static artifact:** route inventory, no secrets/PII/restricted paths, no orphan downloads, correct metadata/headers, no public partner URLs beyond root.
3. **Access boundary:** approved/unapproved OTP, generic response, deep-link return, eight-hour expiry, logout, policy removal, active revocation, and unauthenticated GET/HEAD matrix for every hostname/file class/query/error.
4. **Media:** authorized-state gating, captions, transcripts, player failure, public origin restrictions, and—only after approval—restricted direct-media bypass tests.
5. **Accessibility:** automated HTML checks plus keyboard, screen reader, focus, captions, 200% zoom, 320 CSS px reflow, forced-colors, reduced-motion, downloadable-file accessibility, and mobile/desktop review.
6. **Content/legal/privacy:** source trace, rights/credit/permission, claims lexicon, disclaimer consistency, small-cell suppression, metadata stripping, and qualified-counsel flags.
7. **Usability:** task-based moderated tests for community, media, and professional partners; asset-preparation and decision tasks within stated targets.
8. **Operations:** owner rehearsals for publish, asset withdrawal, approval, active revocation, safe rollback, urgent removal, backup restore, alert delivery, and cost review.

### Definition of done

The MVP is done only when:

- every Must requirement is implemented or explicitly recorded as not applicable with owner evidence;
- the separate private repository/Pages origin exists and the bootstrap Worker is no longer the substantive-content plan;
- no unauthenticated request can retrieve any partner HTML or asset from any hostname or direct URL;
- no restricted video is present unless PAR-FR-007 and PAR-SEC-007 pass;
- all playable films have reviewed captions and every published content/asset/claim has required approval metadata;
- community, media, and professional testers can complete their core journey without category confusion;
- no public application, donation solicitation, forum, CRM, tracking profile, or confidential diligence material has been introduced;
- all automated tests and manual accessibility/security/content/operations gates pass with dated evidence;
- Brian completes the owner rehearsals, accepts residual risks and current costs, and separately authorizes launch.

## 21. Stakeholder-needs traceability matrix

| Need ID | Stakeholder need | Requirements | Verification |
|---|---|---|---|
| SN-01 | Protect community attention and trust. | PAR-FR-005, 009; PAR-CNT-002, 012; PAR-LEG-005, 007 | Community usability/content review. |
| SN-02 | Prepare an episode/interview efficiently. | PAR-FR-004, 010–012, 014; PAR-CNT-006–007 | Media task test and manifest audit. |
| SN-03 | Preserve authenticity and editorial independence. | PAR-FR-009, 011; PAR-LEG-005–006 | Copy/permissions review. |
| SN-04 | Assess artistic purpose, public benefit, readiness, and governance. | PAR-FR-008, 013; PAR-CNT-008–009; PAR-ANA-001–009; PAR-LEG-008–010 | Professional reviewer comprehension and claims audit. |
| SN-05 | Protect IP, privacy, claims, and direct assets. | PAR-SEC-001–015; PAR-PRV-001–009; PAR-LEG-001–010 | Threat tests, scans, counsel/privacy gates. |
| SN-06 | Preview/access only authorized film content. | PAR-FR-004–007; PAR-CNT-004–005; PAR-SEC-007; PAR-LEG-002–003 | Release-state and direct-media tests. |
| SN-07 | Communicate decisions, questions, and feedback. | PAR-FR-014–015; PAR-PRV-005–006 | Mail-action tests and data audit. |
| SN-08 | Report outcomes without exposing audience members. | PAR-FR-015; PAR-PRV-005, 009; PAR-ANA-001–009 | Feedback fixture and suppression tests. |
| SN-09 | Operate safely as a solo creator. | PAR-FR-017–018; PAR-NFR-004–006; PAR-OPS-001–010 | Owner rehearsals and cost audit. |
| SN-10 | Make the portal accessible and responsive. | PAR-NFR-001–004, 008 | WCAG/browser/device test suite. |

## 22. Ten questions Brian should answer before implementation begins

1. What exact private GitHub repository and Cloudflare Pages project should own the substantive partner portal?
2. Which films are approved for partner evaluation now, and is each one public, unavailable, or proposed for restricted distribution?
3. Do you accept the recommended MVP rule that no restricted film playback ships until counsel and a signed-media architecture are approved?
4. Which project descriptions, creator biography, headshot, stills, clips, captions, transcripts, credits, and reuse terms are currently approved?
5. Should the existing `/donor-brief/` route be visibly relabeled “Funding & Professional Brief,” with no donation CTA while public donations are paused?
6. Which share-safe governance, fiscal-sponsorship, budget-category, milestone, and risk facts may every approved partner see?
7. Is the exploratory `n=11` evidence approved for partner release; if so, what exact report, quotations, subgroup language, and limitations are final?
8. Which monitored role mailbox should receive partner questions, decisions, feedback, and voluntary outcome reports, and what private retention rule applies?
9. What numeric monthly/annual operating ceiling and Cloudflare Stream alert threshold should block additional usage or features?
10. Who is the emergency backup operator with authority to revoke access, disable media, and publish a safe rollback if Brian is unavailable?
