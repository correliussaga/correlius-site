# Correlius public site

This repository contains the public Correlius.org site. The approved architecture and implementation plan are in `docs/design/`.

## Current implementation stage

Stage 7 completes the repository-owned acceptance and operations package. CI runs the full suite, builds produce deterministic artifact manifests, a deliberately gated hourly production smoke workflow is ready, and the machine-readable launch ledger records every unresolved success criterion. Production authorization remains false: the request form and discovery stay disabled, protected portal code and material remain excluded, the project record remains draft, and the episode collection contains no public-eligible film record. The existing root-level HTML/CSS site remains unchanged as the pre-Astro public surface until an authorized deployment cutover.

## Local development

Use the exact Node version in `.nvmrc`, then install and verify from the lockfile:

```sh
npm ci
npm test
```

Run `npm run dev` only for local development. Generated output is written to `dist/` and is never committed.

`npm run audit:launch` validates the launch ledger without claiming readiness. `npm run verify:launch` is the intentional production gate and must fail until all 13 criteria have dated evidence and Brian records launch authorization.

## Public/private boundary

Only approved public material belongs in this repository. Protected partner material, raw research, identity mappings, source masters, privileged legal records, operational allowlists, and production secrets must remain outside this repository and its build inputs.
