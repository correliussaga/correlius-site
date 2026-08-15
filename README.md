# Correlius public site

This repository contains the public Correlius.org site. The approved architecture and implementation plan are in `docs/design/`.

## Current implementation stage

Stage 3 establishes the Astro static-build foundation and repository checks. The existing root-level HTML/CSS site remains unchanged and is not yet migrated into Astro. The Astro verification page is deliberately marked `noindex` and is not approved for deployment.

## Local development

Use the exact Node version in `.nvmrc`, then install and verify from the lockfile:

```sh
npm ci
npm test
```

Run `npm run dev` only for local development. Generated output is written to `dist/` and is never committed.

## Public/private boundary

Only approved public material belongs in this repository. Protected partner material, raw research, identity mappings, source masters, privileged legal records, operational allowlists, and production secrets must remain outside this repository and its build inputs.
