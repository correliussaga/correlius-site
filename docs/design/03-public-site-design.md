# Correlius.org MVP — Public Site Design

## Design intent

The public site is the film-centered, anonymous surface. It should answer “What is Correlius?” and offer a released film within two minutes, on a phone, without requiring registration. It uses semantic, server-rendered static HTML; restrained images; no autoplay; and visible calls to Watch, About, Support, and For Partners.

This document defines structure, not final marketing, medical, or legal copy. Approved copy must preserve the distinctions in US-01–US-03 and US-17.

## Information architecture and navigation

Primary navigation is exactly:

1. Home
2. Watch
3. About
4. Support
5. For Partners

The site logo/name links to Home. On small screens, the menu opens with a labeled button, moves focus into the menu, closes with Escape, returns focus to the trigger, and never traps keyboard focus. The current page uses both programmatic (`aria-current="page"`) and visual indication.

Episode detail pages are children of Watch and appear through episode cards, previous/next links, and breadcrumbs rather than as permanent top-level navigation. A skip link precedes the header. The footer appears on every public page and contains the fan-project disclaimer, credits/legal link or disclosure, security-reporting link, privacy information, and repeated essential navigation.

## Route table

| Route | Page | Generated from | Indexable | Primary stories |
|---|---|---|---:|---|
| `/` | Home | Project, CTA, featured released episode | Yes | US-01, US-02, US-04, US-07, US-17, US-20, US-22 |
| `/watch/` | Watch | Ordered episode collection | Yes | US-04–US-06, US-14, US-20, US-22 |
| `/watch/{slug}/` | Episode detail | One episode record | Released: yes; coming soon: conditional | US-04–US-06, US-20 |
| `/about/` | About | Project, creator, history, mission | Yes | US-02, US-03, US-17, US-20 |
| `/support/` | Support | Funding-purpose copy and Fractured Atlas URL | Yes | US-07, US-17, US-19 |
| `/for-partners/` | For Partners | Invitation-only portal explanation and secure sign-in handoff | Yes | US-08, US-18, US-19, US-20, US-25 |
| `/privacy/` | Privacy notice | Approved policy content | Yes | US-08, US-18, US-19 |
| `/.well-known/security.txt` | Security contact | Security configuration | Not a page | US-27 |
| `/404.html` | Not found | Static template | No | Reliability/accessibility |
| `/sitemap.xml` | Public sitemap | Published public routes | N/A | US-20 |
| `/robots.txt` | Public crawler rules | Static configuration | N/A | US-18, US-20 |

`partners.correlius.org` routes and download URLs never enter this route manifest or sitemap.

## Shared layout and components

- `SiteHeader`: text/logo home link, primary navigation, accessible small-screen disclosure.
- `SkipLink`: first focusable element; target is `<main>`.
- `PageIntro`: one H1 and optional concise lead.
- `EpisodeCard`: episode number, image/alt, title, synopsis excerpt, runtime/status, and one unambiguous action.
- `StreamPlayer`: responsive 16:9 container, title, no autoplay, captions available, loading and failure states.
- `CallToAction`: semantic link, not click-only container; external destinations disclosed.
- `Notice`: plain-language context or constraint, announced only when dynamically updated.
- `SiteFooter`: required disclaimer and globally available links.
- `SeoHead`: validates canonical title/description/image and generates social tags.
- `AnalyticsEventLink`: progressive enhancement; navigation works if event delivery fails.

All components default to static HTML and CSS. Client scripts cannot contain secrets, allowlists, applicant data, or private routes.

## Home (`/`)

**PURPOSE.** Establish the nonprofit, noncommercial fan-film identity and themes immediately, then make Watch the dominant next action.

**PRIMARY USER.** First-time viewer arriving from social, podcast notes, community links, or search.

**CONTENT.** Concise project identity; themes of Black characters, mental health, family, healing, and unconventional strength; a short “healed, not cured” mission explanation that is not treatment advice; a featured released episode; brief credibility markers; and required non-affiliation context.

**COMPONENTS.** Site header, text-led hero with optimized representative image, primary Watch action, secondary About/Support/For Partners actions, featured episode card, concise mission section, footer.

**CALLS TO ACTION.** Watch the films; Learn about the project; Support Correlius; For Partners / Request Partner Access.

**DATA/CONTENT SOURCE.** `project` singleton, `creator` summary, global CTA records, and the first eligible `featured` released episode. The build fails if no released featured episode is valid.

**ACCESSIBILITY.** Text remains meaningful without image; one H1; logical landmarks; no background video; no required animation; CTAs are keyboard links; mobile reflow without horizontal scrolling at 320 CSS px and usable at 200% zoom.

**SEO METADATA.** Unique title and description; canonical `https://correlius.org/`; Open Graph and Twitter/X large-image card using a 1200×630 approved image; organization/project JSON-LD only if factual fields are approved.

**ERROR STATES.** If the featured image fails, text and Watch action remain. If no featured film is publishable, Watch leads to the catalog with an honest availability message. A Stream failure never blocks the rest of Home.

**RELEVANT USER STORIES.** US-01, US-02, US-04, US-07, US-17, US-20, US-22.

## Watch (`/watch/`)

**PURPOSE.** Present all released episodes in deliberate sequence and distinguish truly planned coming-soon entries.

**PRIMARY USER.** New or returning viewer choosing an episode.

**CONTENT.** Ordered episode cards with number/release sequence, title, thumbnail, synopsis, runtime, release date/status, and watch action. At least four records fit the same grid/list design.

**COMPONENTS.** Page intro, accessible episode collection, released/coming-soon status labels, footer. Do not use an ARIA grid; ordinary lists and articles give better browsing semantics.

**CALLS TO ACTION.** Watch Episode; optionally Learn about Correlius after the collection.

**DATA/CONTENT SOURCE.** Validated episode collection sorted by numeric `sequence`, then release date. Only `released` records get Watch actions.

**ACCESSIBILITY.** Descriptive image alt (or empty alt when title text makes the image redundant), status not conveyed by color, large touch targets, logical source order, no horizontal carousel.

**SEO METADATA.** Unique Watch title/description/canonical, OG/Twitter image, and links to released episode pages. Only released/indexable pages appear in the sitemap.

**ERROR STATES.** Empty collection shows an approved “films are being prepared” message and links to About; missing optional thumbnail uses a versioned branded placeholder; invalid metadata fails the build rather than silently dropping an episode.

**RELEVANT USER STORIES.** US-04, US-05, US-06, US-14, US-20, US-22.

## Episode detail (`/watch/{slug}/`)

**PURPOSE.** Provide a stable, shareable page for one episode and its accessible playback.

**PRIMARY USER.** Viewer ready to watch or evaluate a specific film.

**CONTENT.** Episode number/title, synopsis, release date, runtime, content context/advisory when approved, poster, Stream player for released records, caption availability, credits where required, and adjacent episode links.

**COMPONENTS.** Breadcrumb, episode header, responsive player/fallback, metadata definition list, synopsis, credits/context, previous/next navigation, Support/About CTA.

**CALLS TO ACTION.** Play through native player controls; Watch another episode; Support Correlius; About the project.

**DATA/CONTENT SOURCE.** One episode record; Stream UID and caption status are public non-secret configuration. Stream asset itself is managed in Cloudflare.

**ACCESSIBILITY.** Iframe has a descriptive title; no autoplay with sound; keyboard access to player controls; English captions on every released film; page does not rely on player for episode context; focus does not jump on player load; advisory precedes playback where needed.

**SEO METADATA.** Per-episode title, description, canonical, OG/Twitter image (episode poster/share image), release metadata, and VideoObject JSON-LD only after fields/URLs are verified. Coming-soon pages use `noindex` unless there is approved substantive content and a genuine plan.

**ERROR STATES.** A reserved player area includes poster, “Video unavailable” text, retry guidance, and Contact link. Missing Stream UID or caption readiness makes a `released` record fail the build. Network/script failure never produces a blank rectangle.

**RELEVANT USER STORIES.** US-04, US-05, US-06, US-17, US-19, US-20, US-22.

## About (`/about/`)

**PURPOSE.** Explain the mental-health mission, creator, history, completed work, and accurate legal posture.

**PRIMARY USER.** Viewer or supporter assessing meaning and credibility.

**CONTENT.** Concise mission; “healed” versus “cured” distinction; intended resonance with Black Gen X and Millennial Blerds without exclusivity; Brian Payne biography/photo; completed history including *Healed But Not Cured*; factual fiscal sponsorship, fair-use-assessment, and exploratory-research statements; non-affiliation disclaimer.

**COMPONENTS.** Page intro, mission prose, creator profile, milestone list, restrained legal-context notice, Watch CTA.

**CALLS TO ACTION.** Watch; Support; For Partners.

**DATA/CONTENT SOURCE.** Approved project/creator/history records and approved legal summary. No privileged memo or private correspondence.

**ACCESSIBILITY.** Creator photo has meaningful alt; milestone chronology is a semantic list; plain language avoids clinical claims; headings do not skip levels.

**SEO METADATA.** Unique About title/description/canonical and representative image with OG/Twitter fields.

**ERROR STATES.** Missing creator photo does not suppress biography. The build rejects an unapproved or absent required disclaimer reference.

**RELEVANT USER STORIES.** US-02, US-03, US-17, US-20.

## Support (`/support/`)

**PURPOSE.** Explain what support helps make possible and transfer the visitor safely to Fractured Atlas.

**PRIMARY USER.** Prospective donor or supporter.

**CONTENT.** Fiscal sponsorship disclosure; high-level production/accessibility purposes; explicit absence of ownership, creative control, profit participation, or licensed Star Wars rights; clear external destination notice.

**COMPONENTS.** Page intro, funding-purpose bullets, sponsor disclosure, external CTA, fan-project disclaimer.

**CALLS TO ACTION.** Contribute through Fractured Atlas; optionally Contact/For Partners for major-donor conversation through the reviewed access process.

**DATA/CONTENT SOURCE.** Approved support content and a single validated HTTPS Fractured Atlas URL in site configuration.

**ACCESSIBILITY.** External link purpose is evident in accessible name/context; no forced new tab. If product chooses a new tab, it is disclosed and uses `noopener`.

**SEO METADATA.** Unique Support title/description/canonical; representative non-misleading image. Do not add donation schema implying Correlius processes payments.

**ERROR STATES.** Link is checked in CI and launch review. If the provider is unavailable, the site offers no local card-entry fallback and identifies the external problem.

**RELEVANT USER STORIES.** US-07, US-13, US-17, US-19.

## For Partners (`/for-partners/`)

**PURPOSE.** Explain that the partner portal is limited to people Brian has vetted privately and provide a neutral sign-in path for already-approved partners.

**PRIMARY USER.** A privately vetted and approved Correlius partner.

**CONTENT.** Invitation-only statement; secure-portal explanation; exact-email approval boundary; explicit statement that visiting or attempting sign-in does not request access, create an account, or change the approved list.

**COMPONENTS.** Page intro, private-access explanation, and one `Partner sign-in` link to the protected portal root. Do not link to protected resource paths.

**CALLS TO ACTION.** Partner sign-in. No application, registration, contact, or request action appears.

**DATA/CONTENT SOURCE.** Static public copy only. Vetting records and approved-email administration remain outside the public repository.

**ACCESSIBILITY.** Descriptive heading and link text, visible focus, sufficient contrast, and no authentication details embedded in the public page.

**SEO METADATA.** Unique title/description/canonical and appropriate public share image. Metadata describes sign-in for vetted partners, not the contents of the private room.

**ERROR STATES.** The retired `/api/partner-access` route returns HTTP 410 and accepts no data. Portal authentication and denial are owned by Cloudflare Access and remain enumeration-neutral.

**RELEVANT USER STORIES.** US-08, US-18, US-19, US-20, US-25, US-28.

## Privacy (`/privacy/`)

**PURPOSE.** State that Correlius accepts no public partner applications, explain the separate protected-portal authentication boundary, and describe aggregate operational processing.

**PRIMARY USER.** Approved partner or privacy-conscious visitor.

**CONTENT.** No-application statement, Cloudflare Access processing for approved partners, aggregate analytics separation, no sale/advertising trackers, and privacy contact process. Final policy requires owner review and is not legal advice.

**COMPONENTS.** Plain prose with updated/effective date and contact link.

**CALLS TO ACTION.** Return to the vetted-partner sign-in explanation; contact privacy address.

**DATA/CONTENT SOURCE.** Approved privacy policy content synchronized with actual implementation.

**ACCESSIBILITY.** Short paragraphs, descriptive headings/links, no legal-text image.

**SEO METADATA.** Unique title/description/canonical; ordinary indexability is acceptable.

**ERROR STATES.** Build fails if the policy contact or effective date is absent.

**RELEVANT USER STORIES.** US-08, US-18, US-19.

## Footer and disclaimer

Every public page includes an accessible text disclaimer stating that Correlius is a noncommercial fan project, that underlying Star Wars intellectual property belongs to Lucasfilm/Disney, that original Correlius characters/contributions are distinct, and that no approval or endorsement is claimed. Exact wording must be approved. Required music/image credits appear on the relevant page or a linked credits section. The complete legal memo is never deployed (US-17).

## Responsive and performance behavior

- Mobile-first single column; content reflows at 320 CSS px and 200% zoom without two-dimensional scrolling except intrinsically necessary media.
- Episode cards move from one column to a modest responsive grid; DOM/source order stays reading order.
- Player maintains aspect ratio with no fixed pixel width.
- Responsive images use explicit dimensions, modern formats with fallback, `srcset`, and lazy loading below the fold.
- No hero video, background autoplay, required motion, or render-blocking oversized image.
- Self-hosted/system fonts are preferred; CSS/JS budgets and Lighthouse checks are defined in the implementation plan.
- Reduced-motion preference disables nonessential transitions.

## Accessibility verification

Each template receives automated HTML, axe, and link tests plus manual keyboard, screen-reader spot checks, color/forced-colors review, 200% zoom, mobile landscape, and current Safari/Chrome/Firefox/Edge checks. Released episode verification includes visible caption selection and a caption timing/content sign-off. Automated tools do not substitute for manual review.

## SEO and social metadata rules

- Every public HTML page has a unique title, meta description, canonical URL, OG title/description/url/type/image and image alt, and Twitter/X card/title/description/image.
- Representative images are approved, versioned, absolute-URL capable, approximately 1200×630, and kept below the agreed byte budget.
- Episode pages use episode-specific text/images rather than homepage defaults.
- `sitemap.xml` contains only canonical, indexable public routes.
- `robots.txt` points to the public sitemap and does not advertise protected paths. The partner host independently returns `Disallow: /` plus `X-Robots-Tag`; Access remains the control.
- Preview deployments remain `noindex` and are not submitted to search engines.
- CI asserts required tags and absolute image URLs; launch checks use common preview debuggers without purchasing SEO tooling.

## Global error/fallback principles

Errors use plain language and never reveal secrets, stack traces, policy membership, or participant data. Static 404/500 states retain navigation and a Home/Watch recovery path. Analytics, social metadata, or image failures never block core reading, playback controls, or navigation.

## Architectural decisions and open questions

- **Decision:** route structure above is stable for four or more episodes; a new episode creates one detail page and one derived card.
- **Decision:** Watch remains a catalog rather than embedding every full player, reducing load and cognitive clutter.
- **Decision:** the public For Partners page has no application flow and links only to the authenticated portal root on a different hostname and build.
- **Open:** supply the two completed episode records, share images, creator photo/alt text, approved medical/legal language, credit requirements, and Fractured Atlas link.
- **Open:** decide whether genuine coming-soon episodes should be indexable; default is `noindex` until substantive approved content exists.
