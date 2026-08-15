# Stage 5 — Public Content System

## Scope

Stage 5 implements the data-driven public content and episode framework that can be completed without approved film assets or external account configuration. It covers the local portions of WP-03, prepares the code path for WP-04, extends the WP-05 structural accessibility baseline, and prepares non-image metadata for WP-06 while discovery remains disabled.

## Implemented content model

- One schema-validated project singleton drives the Home and About mission surfaces.
- The project singleton remains `draft`; moving it to `approved` requires owner review of its claims and source material.
- One excluded episode authoring template defines the complete release record without creating a public episode or roadmap promise. A clearly named internal draft sentinel keeps Astro's collection tooling active; it is ineligible for every public selector and release action.
- Episode validation enforces stable IDs/slugs/order, release states, metadata lengths, approved local-image records, caption records, and structured credits.
- A released episode fails validation without runtime, release date, Stream UID, ready English captions, thumbnail, poster, social image, SEO fields, content approval, rights review, and credit review.
- Approved content fails if it contains recognized placeholder markers.
- Collection validation rejects duplicate IDs, slugs, sequences, and more than one featured released episode.

## Implemented rendering

- Home derives its availability state and optional featured-film action from the episode collection.
- Watch derives its ordered catalog from public-eligible records and retains the honest empty state when none exist.
- A reusable EpisodeCard supports reviewed images or a CSS-only fallback without inventing artwork.
- `/watch/{slug}/` pages are generated only for approved coming-soon or released records.
- Coming-soon detail pages render no player. Released pages require the site-level Stream customer code and render a responsive, titled, non-autoplay iframe plus independent synopsis and failure guidance.
- Breadcrumbs, episode facts, content context, and previous/next links are derived without changing navigation or route templates.
- Base metadata now includes unique canonical, Open Graph text, and X/Twitter text. Social images remain absent until approved assets exist.

## Automated evidence

- Four test-only public-eligible episodes validate catalog ordering and capacity.
- An Episode N+1 test proves a fifth record needs no template or navigation change.
- Negative tests reject incomplete releases, approved placeholder copy, duplicate sequence values, and multiple featured releases.
- A positive test proves a complete release-shaped record passes the schema.
- Static accessibility checks cover page language, one H1, heading order, image alt/dimensions, iframe titles, button types, autoplay, positive tabindex, and ambiguous link text.
- Public-shell checks validate internal links and local image/script assets in addition to route, metadata, boundary, and byte-budget checks.

## Deliberately blocked work

The following dependencies were not supplied and are not represented as complete:

- Approved records for the two completed episodes, including public titles, synopses, runtimes, release dates, Stream UIDs, caption status, credits, and review flags.
- Cloudflare Stream customer code, uploaded/processed masters, allowed-origin settings, reviewed captions, playback evidence, and billing alerts.
- Approved episode thumbnails, posters, social images, creator image, alt text, and asset-rights ownership.
- Approved creator biography, history/milestones, final disclaimer and credit language, privacy contact, and Fractured Atlas URL.
- Indexable discovery, sitemap, social images, enforced Stream CSP sources, final support action, and production link reachability.
- Automated axe execution and manual assistive-technology, keyboard, 320-pixel reflow, 200% zoom, forced-colors, caption, and browser/device evidence.

No image was generated for this stage: the approved architecture requires reviewed, rights-cleared public imagery, and the social-image/content dependencies remain unresolved. All pages remain noindex and no deployment is authorized. Stage 6 must not begin without Brian's approval.
