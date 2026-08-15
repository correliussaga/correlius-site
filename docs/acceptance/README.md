# Launch Acceptance Evidence

`launch-readiness.json` is the public, non-sensitive status ledger for the 13 approved MVP success criteria. It records only concise evidence summaries and blockers. Screenshots, deployment identifiers that should remain private, account details, allowlists, applicant/partner identities, logs, legal communications, and recovery information belong in the approved restricted operational record.

## Status rules

- Keep a criterion `blocked` until every part of that criterion has current evidence. Partial repository evidence may be listed without changing the status.
- A `passed` criterion requires at least one concise evidence entry and a `null` blocker.
- Update `asOf` whenever a status, evidence summary, blocker, or authorization changes.
- Set `productionLaunchAuthorized` only after all criteria pass and Brian explicitly authorizes the production cutover. Authorization is never inferred from a merge or deployment preview.
- Run `npm run audit:launch` after every ledger edit. Run `npm run verify:launch` only as the final production gate.

Do not weaken or remove a blocked acceptance criterion to make the gate pass. An architecture change requires a new approved decision record.
