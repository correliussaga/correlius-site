# Correlius public site

This repository contains the public Correlius.org site. The approved architecture and implementation plan are in `docs/design/`.

## Current implementation stage

The Astro public shell is deployed at `https://correlius.org` in private prelaunch mode. CI runs the full suite, builds produce deterministic artifact manifests, and the hourly production smoke check verifies the deployed shell before launch and adds indexing/playback checks once a released episode URL is configured. Browser analytics and Network Error Logging remain disabled; Stream and Turnstile load only after a visitor chooses the relevant action. Production discovery, the partner-request form, and final episode publication remain gated by the launch ledger and owner authorization.

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
