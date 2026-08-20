# Correlius.org MVP — Partner Evidence Room Design

## Purpose and boundary

The partner evidence room is a controlled professional site for individually approved people. It helps a partner evaluate Correlius, use approved feature materials, understand exploratory evidence and donor needs, and contact Brian. It is not a registration portal, CRM, file-sharing platform, donor dashboard, or separate set of permission tiers. The MVP is capped below Cloudflare Access's 50-active-user Free-plan limit; exceeding that cap is a scope and cost review, not an automatic upgrade.

The public handoff and authenticated experience must never be conflated:

| Journey | Host | Audience | Outcome |
|---|---|---|---|
| **Public partner sign-in handoff** | `correlius.org/for-partners/` | Already-vetted partner | Explains invitation-only access and links to the portal root; collects nothing |
| **Authenticated partner portal** | `partners.correlius.org/` | Exact approved email only | Access OTP session permits protected pages/downloads |

Brian vets prospective partners privately and administers approved exact email addresses outside the public repository. No public request Worker or automated approval path exists.

## Security invariant

Cloudflare Access evaluates the request before the partner Pages origin returns bytes. Every portal page and resource—including a guessed direct PDF/ZIP/image URL—must receive the Access challenge or denial without a valid token. The custom hostname, production `pages.dev` hostname, preview wildcard, and branch aliases are inventoried and protected. CI/link checks are not a substitute for testing unauthenticated `GET` and `HEAD` requests against every class of protected asset.

No partner artifact is copied into the public repository, public build output, Stream public library, public object URL, public sitemap, public navigation, email attachment, or analytics payload.

## Authenticated navigation and routes

Primary navigation follows the MVP exactly:

| Route | Navigation label | Purpose | Primary stories |
|---|---|---|---|
| `/` | Partner Overview | Concise decision-oriented project/evidence summary | US-09, US-11 |
| `/audience-evidence/` | Audience Evidence | Methodology, findings, limits, quotations, protected report | US-10, US-18 |
| `/feature-correlius/` | Feature Correlius | Editorial case, topics, formats, preparation resources | US-11, US-12 |
| `/donor-brief/` | Donor Brief | Accomplishments, future plan, funding categories, next action | US-13 |
| `/media-kit/` | Media Kit | Approved assets, usage guidance, individual/package downloads | US-12, US-18 |
| `/contact/` | Contact Brian | Direct professional contact/action | US-11–US-13, US-19 |
| `/downloads/{descriptive-file}` | Protected resource | Asset returned only after Access | US-10, US-12 |
| `/robots.txt` | Crawler directive | `Disallow: /`; supplemental only | US-15, US-18, US-20 |

A visible Logout action points to `https://partners.correlius.org/cdn-cgi/access/logout` and explains that it ends the Cloudflare Access session across protected applications as provider behavior dictates.

## Authentication entry experience

1. An already-vetted partner follows the neutral Partner sign-in link or enters the partner URL.
2. Access intercepts before Pages and presents its hosted email OTP form.
3. The login page does not reveal whether an email is approved; approved addresses receive a single-use PIN and unapproved addresses see the same generic acknowledgement.
4. After PIN and policy validation, Access returns the originally requested URL and issues an 8-hour application/policy token.
5. The portal header identifies the private nature of the site and offers Logout.

Portal content does not implement or restyle authentication. Cloudflare owns PIN generation, delivery, expiration, validation, and authorization cookies. The Access application name and help text explain that access is by prior private approval without exposing allowlist membership or offering an application path.

## Partner Overview (`/`)

**Purpose.** Let a programming or donor decision-maker understand the case without reading the full report.

**Content.** Project premise; intended audience; mental-health relevance without treatment claims; completed work; accurate headline evidence with panel limitations; collaboration formats; donor/feature pathways.

**Components.** Concise lead, key-facts definition list, evidence summary callout with `n=11`, completed-work list, collaboration-format cards, contextual links to every portal section.

**Actions.** Review Audience Evidence; Feature Correlius; Donor Brief; Contact Brian.

**Source.** Partner overview singleton plus approved values derived from evidence/funding collections. Repeated findings should reference one canonical content field to prevent drift.

**Accessibility.** One H1, prose before metrics, counts paired with percentages, no chart-only meaning, visible focus and mobile reflow.

**Relevant stories.** US-09, US-11, US-13.

## Audience Evidence (`/audience-evidence/`)

**Purpose.** Present exploratory methodology, findings, critical feedback, limitations, and de-identified quotations responsibly.

**Required content.** The panel has 11 responses; it is exploratory and nonrepresentative; all respondents were Star Wars fans and most casual; relationship-to-project categories are distinguished; creator/family/friend/advisor responses are not silently merged with independent responses. Approved findings may include the exact requirement-provided statistics, always with count and denominator as well as percentage. Encouraging and critical findings appear together. Claims describe resonance, not reach, impact, demand, or clinical effect.

**Components.** Methodology and limitations prose, sample composition, accessible charts with adjacent data tables/text summaries, finding cards, quotation blocks with anonymous stable evidence IDs, protected report download.

**Source.** Reviewed, de-identified aggregate content and quotations manually transcribed from private research records. The raw CSV never enters either repository. Stable evidence IDs allow Brian to trace a quotation in private source storage without exposing the lookup or identity mapping.

**Download.** Descriptively named PDF such as `correlius-exploratory-audience-report-v1.pdf`, stored in the partner repository and returned only through the protected host.

**Accessibility.** Charts have text alternatives and tables; color is redundant; counts accompany percentages; PDF must pass its own tag/order/contrast/alt/link checks.

**Relevant stories.** US-10, US-18, US-19.

## Feature Correlius (`/feature-correlius/`)

**Purpose.** Give hosts/moderators a concise editorial case and concrete, non-exaggerated ways to feature the project.

**Content.** Premise, intended audience, completed work, evidence summary/limitations, and proposed topics: Black mental health through science fiction; avoidance and unconventional heroism; Black masculinity, vulnerability, and self-worth; marriage/family within Star Wars storytelling; independent fan filmmaking as nonprofit cultural work. Collaboration formats may include interview, moderated discussion, screening/Q&A, panel, or written feature only when approved.

**Components.** Editorial rationale, topic list, format list, preparation checklist, links to Media Kit and Contact Brian.

**Source.** Approved feature singleton and collaboration-format collection; no invented availability or commitment.

**Accessibility.** Scannable headings/lists, descriptive downloads, no information embedded only in promotional images.

**Relevant stories.** US-11, US-12.

## Donor Brief (`/donor-brief/`)

**Purpose.** Explain completed milestones, the four-episode plan, funding purposes, fiscal sponsorship, and next actions without implying ownership/control.

**Content.** Completed versus planned work are visually and semantically separate. Funding categories include production, VFX/postproduction, LX-9 development, insurance, legal review, accessibility, audience research, and paid/diverse creative vendors where accurate. Fractured Atlas sponsorship and external donation processing are explicit. No unexplained total or rights/control promise appears.

**Components.** Milestone lists, planned-work list, funding-category definition list, Fractured Atlas CTA, Contact Brian CTA.

**Source.** Approved milestone and funding collections. Amounts are omitted unless Brian supplies reviewed data.

**Accessibility.** Status is textual, not color-only; external destination is disclosed; content reflows without dense comparison grids.

**Relevant stories.** US-07, US-13, US-17.

## Media Kit (`/media-kit/`)

**Purpose.** Let an approved host/moderator prepare a feature with minimal effort.

**Minimum resources.** Creator biography; approved headshot; project summary; film synopsis; suggested interview questions; suggested discussion questions; approved images/stills; contact information; and a clearly labeled package containing the essentials.

**Resource manifest.** Each item records display title, description, file path, MIME type, size, version/date, usage guidance, credit line, alt text/visual description where relevant, and inclusion in the package. Filenames are lowercase, descriptive, versioned only when useful, and contain no private production identifiers.

**Exclusions.** Copyrighted music files, unlicensed Star Wars promotional assets, private production documents, raw research, and privileged legal/insurance materials.

**Components.** Usage-guidance notice, resource groups, download rows with type/size, preview only when safe, package download, Contact Brian.

**Accessibility.** Links name the actual asset and format/size; image previews have correct alt; ZIP contents include a plain manifest/readme; downloadable DOCX/PDF assets require separate accessibility review.

**Relevant stories.** US-12, US-18.

## Contact Brian (`/contact/`)

**Purpose.** Provide a clear next action for an approved professional.

**Content/components.** Monitored professional email link and brief guidance on useful context (organization, proposed format/timing). Prefer a `mailto:` action for MVP so the portal does not create a second form-processing/retention path. A phone or scheduling link appears only if Brian explicitly approves it.

**Analytics.** A first-party aggregate `collaboration_contact_selected` event may fire; navigation/contact still works if it fails. The event contains no recipient address, partner identity, subject, or message.

**Accessibility.** Visible address or descriptive contact label, no copy-to-clipboard-only interaction, no time-sensitive widget.

**Relevant stories.** US-11, US-13, US-19.

## Protected downloads

- Files are committed only to the private partner repository under a dedicated download directory.
- Build rules copy only entries in the validated manifest; orphan or unmanifested downloads fail CI.
- No asset is uploaded to a public CDN bucket or linked from `correlius.org`.
- Access policy covers all paths and alternate hostnames; direct `GET`, `HEAD`, URL guessing, and query-string variations are tested unauthenticated.
- Responses use correct MIME type, `nosniff`, conservative caching, and `Content-Disposition` where download is intended.
- Sensitive resources use `Cache-Control: private, no-store`; approved reusable kit assets may use browser-private caching only after risk review. Shared CDN caching must not serve protected bytes across users unless Access integration behavior is explicitly verified.
- Filenames and metadata contain no participant identifiers or private claims.
- Removing a file requires removing its manifest entry and deployment; for urgent takedown, roll back/remove and verify old deployment/alternate URLs are not public.

Access controls retrieval, not post-download redistribution. Usage guidance and approved asset selection reduce risk; the MVP does not promise DRM or screen-recording prevention.

## Noindex and discovery controls

The partner host sends `X-Robots-Tag: noindex, nofollow, noarchive` for all responses after authentication and uses a matching meta robots tag. Its `robots.txt` disallows all crawling. It has no sitemap and is absent from the public sitemap and navigation except the neutral sign-in route. Preview deployments also remain noindex. These are supplemental; an unauthenticated crawler must receive Access rather than content.

## Session, denial, expiration, and logout

- **Session lifetime:** 8 hours at the Access policy/application level; confirm in launch audit.
- **Expiration:** next request re-enters the generic OTP flow; unsaved state is not expected because pages are read-only.
- **Logout:** visible link to provider logout; landing page explains that reauthentication is needed.
- **Access denied:** Cloudflare's generic result reveals neither allowlist status nor other partners and offers no application path.
- **Revocation:** remove exact email from the Allow policy, revoke that user's active tokens, then verify with an incognito/direct-resource request. Removal alone blocks future policy evaluation but does not satisfy urgent active-session revocation.
- **Logs:** authentication attempts are reviewed in restricted Access logs; page analytics remains aggregate. The Free plan retains Access logs for 24 hours. Brian must accept that window as sufficient and review after approvals/incidents, or US-24 is a no-go pending amendment; paid retention is excluded.

## Resource organization

```text
partner-site/
  src/content/
    overview/
    findings/
    feature-topics/
    funding-categories/
    collaboration-formats/
    resources/
  protected-downloads/
    audience-evidence/
    biographies/
    images/
    interview-resources/
    project-summaries/
    packages/
  src/pages/
  public/
    robots.txt
```

Only the partner build process can resolve `protected-downloads/`. Private source records and the quote-to-identity map are not beneath this tree.

## Error and fallback behavior

| State | Behavior |
|---|---|
| Unauthenticated direct resource URL | Access challenge; zero resource bytes |
| Unapproved email | Generic acknowledgement/failure identical in shape to approved flow; no identity disclosure |
| Invalid/expired PIN | Generic retry and request-new-code guidance |
| Session expires mid-navigation | Return to requested URL after successful reauthentication |
| Missing download | Branded protected 404 with portal navigation; no directory listing |
| Partner build failure | Last successful protected deployment remains; public site unaffected |
| Access outage/misconfiguration | Fail closed; never temporarily publish an unprotected hostname |
| Analytics failure | Page/download/contact path continues |

## Content and privacy review gates

Before any partner release, a human reviewer verifies: no direct identifiers; `n=11` and subgroup treatment are accurate; percentages include counts; critical findings and limitations remain; quotes match private source evidence IDs; legal summary matches public disclaimer; asset rights/credits are approved; all files are listed in the manifest; and unauthenticated requests cannot retrieve any artifact.

## Architectural decisions and open questions

- **Decision:** one authorization tier, exact-email Allow rules, deny by default.
- **Decision:** all protected assets stay inside the partner Pages origin rather than public storage with obscure URLs.
- **Decision:** 8-hour session and explicit per-user token revocation for urgent removal.
- **Decision:** Contact Brian is a protected mail action, avoiding a second personal-data form.
- **Open:** confirm the partner repository owner/visibility, acceptance of the 24-hour Free-plan log window, approved-email administration below 50 active users, and partner help/contact text.
- **Open:** provide the de-identified report, quote evidence IDs, approved media-kit assets/rights/credits, donor facts, and contact address.
- **No-go conflict:** Cloudflare Access does not document a customer-configurable per-email failed-PIN threshold. US-09/US-25 cannot be implemented exactly without changing the mandated identity architecture; amend them to accept provider-managed controls or obtain provider proof before launch.
