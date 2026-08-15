# Stage 4 — Safe Public Vertical Slice

## Scope

Stage 4 implements the local, deployable-code portion of WP-02: a semantic public shell with the approved navigation and route structure, honest placeholder states, a shared footer, a custom 404 page, responsive behavior, baseline browser headers, crawler protection, and automated shell checks.

This stage does not deploy to Cloudflare Pages, change DNS, publish unfinished content, enable analytics, enable partner requests, link to a protected portal, or activate a contribution destination.

## Implemented routes

- `/` — recognizable project introduction and honest public-preview status.
- `/watch/` — empty catalog state and release/accessibility expectations.
- `/about/` — bounded project-purpose copy with creator/history approval gate.
- `/support/` — funding-purpose categories with no placeholder payment link.
- `/for-partners/` — intended professional audiences with no data-collection form.
- `/privacy/` — preview data-processing status and final-policy approval gate.
- `/404.html` — navigation-preserving not-found recovery.

All pages are currently `noindex, nofollow`, and `robots.txt` disallows crawling. These controls remain until approved production content and discovery metadata replace the preview state.

## Shared behavior

- The primary navigation is exactly Home, Watch, About, Support, and For Partners.
- The current route has visible and programmatic state.
- The skip link is the first focusable control and targets the shared main landmark.
- The small-screen menu is progressively enhanced: it remains available without JavaScript; with JavaScript it moves focus to the first link, closes with Escape, and returns focus to its trigger.
- Every page uses unique title, description, and canonical metadata.
- The footer repeats essential navigation, marks legal wording as draft, and does not invent an unapproved security address.
- System fonts, static HTML/CSS, one small navigation script, reduced-motion handling, and forced-colors current-state treatment keep the shell lightweight and resilient.

## Automated gates

The shell verifier requires every route and static control file, unique metadata, the complete primary navigation, the skip-link/main pairing, crawler protection, the draft legal notice, and the absence of placeholder links or the protected hostname. It also enforces budgets of 40 KB per HTML page, 30 KB total CSS, and 10 KB total JavaScript.

The general build-boundary scanner continues to reject sensitive markers, private-key/database/document extensions, and source maps.

## External WP-02 work still required

- Create and connect the public Cloudflare Pages project to the approved repository and build output.
- Restrict preview access to Brian and verify preview responses remain noindex.
- Configure and verify the canonical apex/`www` redirect and HTTP-to-HTTPS behavior.
- Validate TLS on every hostname before enabling a conservative HSTS policy.
- Exercise provider rollback and confirm an induced failed build leaves the prior deployment live.
- Review the report-only CSP in an actual Pages preview before enforcing it.
- Run the manual keyboard, 320 CSS pixel, 200% zoom, reduced-motion, forced-colors, and current-browser checks.
- Establish baseline production performance evidence after a preview deployment exists.

The legacy root-level page remains unchanged as the current pre-Astro surface until an authorized deployment cutover. Stage 5 must not begin without Brian's approval.
