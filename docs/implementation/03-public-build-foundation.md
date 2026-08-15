# Stage 3 — Public Build Foundation

## Scope

Stage 3 establishes the deterministic public-repository build and governance controls required by WP-01. It does not deploy a new site, replace the existing public page, create the private partner repository, or begin the WP-02 public vertical slice.

## Implemented controls

- Astro static output with a strict TypeScript configuration and a canonical production site URL.
- Exact Astro, checker, TypeScript, and Node versions plus an npm lockfile.
- A non-indexable verification page used only to prove the new build path.
- A build-output boundary scanner that rejects sensitive markers, source maps, private-key/database/document extensions, and missing required public artifacts.
- A scanner self-test that proves a secret fixture is rejected.
- Least-privilege CI with immutable action commit pins, clean locked installation, checking, build, and output verification.
- Dependabot coverage for npm and GitHub Actions dependencies.
- A self-review checklist covering public/private boundaries, release approval, accessibility, rights, security, scope, cost, and rollback.
- Ignore rules that keep dependencies, generated output, local environment values, logs, and operating-system metadata out of source control.

## Preserved legacy surface

The root `index.html`, `styles.css`, `thad4site.png`, and `CNAME` files remain unchanged during Stage 3. They are the pre-Astro public surface and will be deliberately replaced or migrated only within the approved public vertical-slice stage.

## External controls still required

The following WP-01 controls require repository or account administration and are not represented as complete by this local commit:

- Create the separate private partner repository before adding protected material.
- Purchase/confirm the approved GitHub plan needed for private-repository rules.
- Protect `main`, require the public-site check, block force pushes and deletion, and record evidence that a failing check blocks merge.
- Restrict the Cloudflare GitHub App to the intended repositories when Pages projects are created.
- Confirm account two-factor authentication, recovery access, and organization ownership.
- Enable and verify the repository's available secret-scanning and security settings.

## Stage gate

Stage 3 is complete when the lockfile is generated, a clean locked install and test pass on the pinned Node version, only the intended Stage 3 files are committed, and the external controls above remain explicitly tracked rather than assumed. Stage 4 must not begin without Brian's approval.
