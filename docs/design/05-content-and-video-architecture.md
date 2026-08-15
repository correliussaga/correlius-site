# Correlius.org MVP — Content and Video Architecture

## Goals

Content is versioned, static, schema-validated, and independent of authentication configuration. Brian can add Episode N+1 by uploading to Cloudflare Stream and adding one metadata record; he does not edit route templates, navigation, or Cloudflare Access code (US-05, US-14, US-16). Public, partner, and restricted source material have separate storage and release workflows.

## Content boundaries

| Content class | Repository/deployment | Examples |
|---|---|---|
| Public | Public site repository and Pages project | Released episode metadata, public captions reference, project/about/support copy, public images, disclaimer/credits |
| Partner-confidential | Private partner repository and Access-protected Pages project | De-identified report, donor brief, media kit, approved stills and packages |
| Restricted source | Neither website repository nor Pages | Source masters, raw survey CSV, identity/quote mapping, legal memo, insurance, private donor/participant documents, US-21 response plan |

The build has no filesystem path, secret, or integration that can pull restricted source material. Moving information from restricted source to partner/public content is a deliberate human-reviewed release action.

## Recommended repository organization

```text
correlius-public-site/
  src/
    content/
      config/                 # validation definitions
      episodes/               # one record per episode
      project/                # mission, history, creator
      calls-to-action/        # route labels and external destinations
      legal/                  # approved disclaimer and credits
    pages/                    # static route templates
    components/               # shared presentation components
  public/
    images/
    .well-known/security.txt
    robots.txt
  docs/                       # non-sensitive implementation/operations docs

correlius-partner-site/       # private repository
  src/
    content/
      overview/
      findings/
      feature-topics/
      funding-categories/
      collaboration-formats/
      resources/              # download manifest records
    pages/
    components/
  protected-downloads/
    audience-evidence/
    biographies/
    images/
    interview-resources/
    project-summaries/
    packages/
  public/
    robots.txt

private-records/              # outside both repositories
  source-masters/
  research-raw/
  quote-identity-map/
  legal-insurance/
  incident-response/
```

The illustrative `private-records` path names a conceptual location, not a request to create it in this repository.

## Episode content schema

Each episode is one data record validated at build time.

| Field | Type/rule | Purpose |
|---|---|---|
| `id` | stable lowercase identifier | Internal content identity; never reused |
| `slug` | unique URL-safe string | `/watch/{slug}/` |
| `sequence` | positive integer, unique | Deliberate catalog order |
| `title` | nonempty plain text | Page/card/player name |
| `shortSynopsis` | plain text, card-length limit | Watch catalog |
| `synopsis` | reviewed Markdown/plain prose | Episode page |
| `runtimeSeconds` | positive integer | Source of formatted runtime |
| `releaseDate` | ISO date or null | Published date; required when released |
| `status` | `draft`, `coming-soon`, `released`, `unpublished` | Controls generation and playback |
| `streamUid` | Cloudflare Stream UID or null | Streaming asset; required only for released |
| `captions` | list of track records | Language, label, kind, Stream track identity/status |
| `thumbnail` | approved local image record | Catalog card image and alt behavior |
| `poster` | approved image or Stream poster URL | Player fallback and episode page |
| `socialImage` | approved 1200×630 image | OG/Twitter share preview |
| `contentContext` | reviewed optional prose | Content advisory/context |
| `credits` | approved structured list | Required music/image/creative credits |
| `featured` | boolean; at most one released | Home selection |
| `seo` | title/description/canonical override rules | Unique page metadata |
| `publish` | boolean derived/validated | Prevents draft generation |

### Episode example (fictitious)

```yaml
id: journal-episode-03
slug: journal-episode-03-placeholder-title
sequence: 3
title: "Correlius Journal 3: Placeholder Title"
shortSynopsis: "Placeholder synopsis for design validation only."
synopsis: >-
  Placeholder episode summary. Replace with approved copy before release.
runtimeSeconds: 742
releaseDate: null
status: coming-soon
streamUid: null
captions: []
thumbnail:
  src: /images/episodes/journal-03-thumbnail-placeholder.webp
  alt: "Placeholder artwork for Correlius Journal episode 3"
poster:
  src: /images/episodes/journal-03-poster-placeholder.webp
  alt: "Placeholder poster for Correlius Journal episode 3"
socialImage: /images/social/journal-03-placeholder.jpg
contentContext: null
credits: []
featured: false
seo:
  title: "Correlius Journal 3 — Coming Soon"
  description: "Placeholder description; not approved production copy."
```

This is sample content, not a real episode requirement or release commitment.

## Episode validation and release-state rules

| State | Public catalog | Detail page | Player | Sitemap/indexing |
|---|---:|---:|---:|---|
| `draft` | No | No | No | No |
| `coming-soon` | Only if genuinely planned and explicitly approved | Optional | No | Default `noindex`; include only by approval |
| `released` | Yes | Yes | Yes | Yes |
| `unpublished` | No | Removed/410 or approved redirect | No | No |

A record cannot be `released` unless it has a Stream UID, synchronized English caption track marked ready, runtime, release date, synopsis, poster/thumbnail, unique metadata, and completed rights/credit review. `streamUid` on non-released records is never rendered. The build rejects duplicate slugs/sequences, multiple featured episodes, broken local assets, placeholder text in production, or missing release prerequisites.

## Other static content structures

### Project and creator

- Project identity, mission, intended audience, history/milestones, completed work.
- Creator name, approved biography, photo, alt text, credit.
- Separate approved claims for fiscal sponsorship, legal assessment, and research so they can be reviewed without rewriting layout.
- Required disclaimer reference applied globally.

### Calls to action

| Field | Rule |
|---|---|
| `id` | Stable enum such as `watch`, `support`, `partner-request` |
| `label` | Human-readable action |
| `href` | Internal route or allowlisted HTTPS external URL |
| `external` | Boolean derived from host |
| `analyticsEvent` | Optional enumerated non-identifying event |
| `context` | Surfaces on which the action may appear |

The production build validates the Fractured Atlas host rather than accepting an arbitrary content-supplied redirect.

### Audience findings

| Field | Rule |
|---|---|
| `id` | Stable de-identified finding ID |
| `headline` | Approved, non-causal summary |
| `count` / `denominator` | Integers; percentage derived, not hand-entered |
| `population` | Named subset or “all panel responses” |
| `direction` | `encouraging`, `critical`, or `mixed` |
| `limitations` | Required context |
| `sourceEvidenceId` | Non-identifying private trace key |
| `display` | Text/chart/table eligibility |

Builds derive percentages from counts and reject mismatches. The initial report header always states `n=11`, exploratory/nonrepresentative status, all-Star-Wars-fan composition, and relationship-to-project subgroup treatment. Anonymous quote records contain quote text, topic, approved display label, and a non-identifying source evidence ID; they contain no names, email, Prolific ID, or identity-map key that reveals a person.

### Donor funding categories

Each category has an ID, approved label, purpose, completed/planned status, optional reviewed amount/range, order, and caveat. Completed milestones are a separate collection so a template cannot blur them with future work. Categories do not create entitlements, ownership, or rights.

### Collaboration formats

Each format has a title, description, likely audience, preparation materials, availability state, and Contact Brian action. A content record describes an option; it does not promise Brian's availability.

### Downloadable partner resources

```yaml
id: exploratory-audience-report-v1
title: "Exploratory Audience Report"
description: "De-identified report with methodology, findings, and limitations."
file: /downloads/audience-evidence/correlius-exploratory-audience-report-v1.pdf
mimeType: application/pdf
sizeBytes: 123456
version: "1.0"
updated: 2026-01-15
usage: "For private evaluation by approved Correlius partners."
credit: null
package: essential-media-kit
```

Values are fictitious. CI verifies the file exists, filename is descriptive, MIME/extension match, size is correct, no manifest path escapes the protected directory, and the file passes malware/type checks appropriate to MVP. Human review covers privacy, rights, accessibility, and accuracy.

## Cloudflare Stream asset model

The architecture distinguishes five entities:

1. **SOURCE MASTER:** highest-quality completed export retained in Brian's private, backed-up storage; never GitHub/Pages.
2. **STREAMING ASSET:** Cloudflare Stream upload identified by UID, automatically encoded for adaptive delivery; allowed origins are Correlius production/approved preview domains.
3. **CAPTION FILE/TRACK:** reviewed synchronized English WebVTT source retained privately and uploaded/attached as a Stream text track. Caption readiness is a release gate.
4. **EPISODE METADATA:** small version-controlled record containing public facts and the non-secret Stream UID.
5. **PUBLIC EPISODE PAGE:** generated HTML combining metadata with the responsive Stream embed and fallback.

The Stream dashboard/API is authoritative for processing/readiness and delivery analytics; the content record is authoritative for page copy, ordering, and release state. A release checklist reconciles the two.

## Stream configuration

- Treat Stream as the MVP's only usage-priced delivery service: storage is purchased in $5 per 1,000-minute increments and delivery is $1 per 1,000 minutes. Configure billing alerts and review usage monthly; do not authorize automatic plan upgrades.
- Upload the completed master through the Stream dashboard for the smallest owner workflow.
- Wait for processing to complete; confirm duration and playback.
- Configure allowed origins for `correlius.org` and `www.correlius.org` only if both are canonical/served. Add explicit preview origins only for release testing, then remove them if not required.
- Do not set `requireSignedURLs` for public films. Signed URLs add a runtime token service and are unnecessary for anonymous viewing. Allowed Origins discourages off-domain embedding but is not DRM.
- Upload the reviewed English caption track and make it selectable/default as approved. Retain the source caption file outside the web repository unless the public release plan intentionally versions it.
- Choose/approve a thumbnail time or upload an approved poster; keep an optimized local fallback/social image for page resilience.
- Use the built-in player unless accessibility testing identifies a blocker. Preserve play, pause, volume, progress, full-screen, quality, and captions.
- Disable autoplay and video preloading so delivery charges follow intentional viewing rather than page loads.
- Verify current Safari, Chrome, Firefox, Edge, iPhone, Android, tablet, and desktop behavior before each release.

## Metadata and secrets

A Stream UID for a public released asset is not treated as a secret because it must reach the browser. API tokens, account IDs used with privileged APIs, signing keys, upload tokens, and Cloudflare credentials are secrets and never appear in content or client JavaScript. The MVP publishing workflow can use the authenticated dashboard, avoiding a Stream API secret in CI.

## Captions

Every released film has synchronized English captions (US-06). Caption QA includes spelling/names, timing, speaker/sound identification, reading speed, line breaks, player selection, mobile display, and confirmation that the released Stream UID—not only a local master—contains the final track. Caption absence or processing failure blocks `released` status.

Captions are not an inferred transcript or autogenerated-only artifact. Automated captions may be a draft, but a human-approved track is required.

## Thumbnails, posters, and social images

- Use approved stills/artwork only; exclude unlicensed promotional assets.
- Store web-optimized derivatives in the appropriate public repository; retain originals elsewhere.
- Give width/height, format, byte-size budget, crop/focal-point guidance, and alt behavior.
- Thumbnail alt may be empty when adjacent title/synopsis fully names the link; meaningful standalone posters get concise descriptive alt.
- Social images do not substitute for visible page text and must not contain unsupported claims.

## Adding Episode N+1 — administrator workflow

1. Finalize and retain the source master and checksum in private backed-up storage.
2. Upload the completed master to Cloudflare Stream through the dashboard.
3. Wait for encoding; record the Stream UID in a private release worksheet.
4. Configure only approved Correlius origins; set poster/thumbnail behavior.
5. Upload the reviewed English captions and verify synchronization in Stream.
6. Create one episode metadata file from the repository template with `status: draft`; add optimized thumbnail/poster/social image derivatives and required credits.
7. Run schema, placeholder, asset, HTML, accessibility, link, and metadata checks locally/CI.
8. Open a pull request and inspect the protected preview on phone and desktop. Confirm player controls, captions, fallback, SEO tags, order, and no effect on existing episodes.
9. Set `status: released`, release date, and optionally `featured`; repeat checks.
10. Complete the self-review/release checklist and merge to the protected production branch.
11. Verify canonical page, Watch card/order, sitemap, social preview, Stream allowed origins, captions, and analytics. Retain rollback identifiers.

No step changes top-level navigation, route templates, Access allowlists, or authentication code (US-05, US-14, US-16).

## Unpublishing or removing an episode

For an ordinary correction, change status to `unpublished`, merge, verify removal from Watch/sitemap, and configure an approved 404/410/redirect. For urgent legal/IP response, Brian or the authorized person follows the private US-21 plan: disable/restrict the Stream asset first if immediate playback removal is required, roll back/remove the public page, preserve evidence privately, and obtain legal advice before public statements. Do not delete the source master or privileged records as an improvised website action.

Old Pages deployment URLs and alternate hostnames must be reviewed; a rollback to an older deployment must not unintentionally republish an episode removed for legal/safety reasons.

## Player loading and failure behavior

The server-rendered page always includes title, synopsis, runtime, release/context, poster/fallback, and a status message independent of the iframe. While loading, the region has a non-animated accessible label. On error or timeout, show a readable message, retry/reload action, and contact/status path. Do not expose Stream API details. Analytics failure never blocks playback.

## Audience evidence release workflow

1. Analyze source data only in restricted private storage.
2. Produce aggregate counts and de-identified quote candidates with stable evidence IDs.
3. Independently check identifiers, subgroup classification, `n=11`, counts/percentages, critical findings, limitations, and non-causal language.
4. Create accessible partner HTML content and PDF from reviewed aggregates only.
5. Run privacy/metadata/accessibility checks on files, then add them to the private partner repository manifest.
6. Test the protected preview, including unauthenticated direct URLs.
7. Merge and verify Access before and after authentication.

No automated build reads the raw CSV or quote-identity map.

## Content quality gates

- Schema validity and unique IDs/slugs/order.
- No placeholders, secrets, direct identifiers, raw datasets, or forbidden file extensions/paths.
- Released episodes have Stream UID, captions, runtime/date, images, credits, metadata, and successful player QA.
- Percentages derive from counts and denominators; claims carry limitations.
- Public/partner disclaimer summaries agree.
- External URLs use HTTPS and an allowlist for high-risk actions such as Donate.
- Download manifests exactly match deployed files; orphan protected files fail the build.
- Heading, link, image-alt, HTML, sitemap, and social metadata tests pass.
- A human approves accuracy, privacy, rights, accessibility, and legal-sensitive wording.

## Architectural decisions and open questions

- **Decision:** schemas are strict and builds fail on invalid release records rather than rendering partial pages.
- **Decision:** Stream UIDs are content; privileged Stream operations remain dashboard-only for MVP.
- **Decision:** coming-soon content is opt-in and non-playable; no invented roadmap.
- **Decision:** partner aggregates are manually released from restricted source data; there is no research-data pipeline into the website.
- **Open:** select/confirm private master and research storage, backup schedule, approved caption source retention, image derivative sizes, and asset rights owner.
- **Open:** supply real records for the two completed episodes and confirm which are already released.
