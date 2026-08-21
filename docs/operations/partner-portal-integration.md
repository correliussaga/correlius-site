# Partner Portal Integration Contract

This public repository and the separate private `correlius-partner-site` repository form two deliberately independent surfaces.

## Public surface responsibilities

- `https://correlius.org/for-partners/` explains invitation-only access and links only to `https://partners.correlius.org/`.
- No protected route, resource name, allowlist value, application form, feedback workflow, or portal content enters the public build.
- `/api/partner-access` remains binding-free, non-cacheable HTTP 410 for every method.
- Public film pages remain the canonical location for anonymously released films.
- Public project, creator, film, disclaimer, image, and caption facts remain the source inputs that the private portal must reconcile before release.

## Private surface responsibilities

- The partner repository builds and deploys independently through its own protected Cloudflare Pages project.
- Cloudflare Access evaluates every custom, provider, preview, alias, page, error, and direct-download request before origin bytes.
- The portal links only to explicitly public film pages until a separately approved signed-media architecture exists.
- Portal copy may summarize approved public facts, but confidential evidence, legal, insurance, financial, donor, personal, permission, and authentication records remain outside both repositories.
- The private build generates its media-kit ZIP and direct resources from an exact validated manifest.

## Cutover from the bootstrap Worker

1. Create the private remote repository and require its CI on reviewed `main` changes.
2. Create the independent Pages project without attaching the production hostname.
3. Protect its provider and preview hostnames with Access, or disable every unprotected alternate URL.
4. Deploy the tested static artifact and run unauthenticated `GET` and `HEAD` probes for HTML, image, text, ZIP, error, and query-string cases.
5. Complete approved/unapproved OTP, deep-link return, logout, eight-hour expiry, removal, and active-token revocation rehearsals.
6. Reconcile project, creator, film, disclaimer, and image facts with the public repository.
7. Move `partners.correlius.org` from the bootstrap Worker to the Pages project only after all previous gates pass.
8. Re-run both repositories' locked test suites and the full production denial matrix.
9. Keep the bootstrap Worker deployment ID as the safe content-free rollback target until Brian authorizes its retirement.

No step above authorizes a public fallback, a new paid service, restricted film playback, a donation workflow, or the transfer of protected files into this repository.
