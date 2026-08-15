# Correlius public site

This repository contains the public Correlius.org site. The approved architecture and implementation plan are in `docs/design/`.

## Current implementation stage

Stage 4 implements the safe Astro public shell: Home, Watch, About, Support, For Partners, Privacy, and a custom 404 page. All Astro pages remain `noindex`, use honest unfinished states, and are not approved for production deployment. The existing root-level HTML/CSS site remains unchanged as the pre-Astro public surface until an authorized deployment cutover.

## Local development

Use the exact Node version in `.nvmrc`, then install and verify from the lockfile:

```sh
npm ci
npm test
```

Run `npm run dev` only for local development. Generated output is written to `dist/` and is never committed.

## Public/private boundary

Only approved public material belongs in this repository. Protected partner material, raw research, identity mappings, source masters, privileged legal records, operational allowlists, and production secrets must remain outside this repository and its build inputs.
