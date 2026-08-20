# Monitoring and Owner Maintenance

## Continuous and event-driven checks

- GitHub CI runs the complete locked suite on pull requests and pushes to `main`.
- The GitHub workflow checks the production shell hourly. Before a released episode URL is configured it verifies the private prelaunch posture; afterward it also verifies public indexing and playback. A failed run is availability evidence, not an automatic rollback command.
- Cloudflare Pages deployment, security, billing/usage, and relevant provider incident notifications must reach Brian through a tested channel.
- Review Access authentication logs after approvals, revocations, and suspected misuse within the accepted 24-hour Free-plan window.
- Review unexpected traffic to the retired application endpoint without collecting or copying request bodies or identities into logs/issues.

## Monthly

1. Manually check Home, Watch, both released episodes and captions, Support, the vetted-only partner handoff, privacy, partner Access challenge, one protected download, and Fractured Atlas reachability.
2. Review Stream stored/delivered minutes and the approved billing threshold; check Pages and Access usage against Free-tier limits.
3. Review failed deployments, smoke failures, retired-endpoint traffic, and provider incidents. Distinguish visits, plays, minutes, approvals, invitations, and donations.
4. Check external links, monitored mailboxes, certificate/domain notifications, dependency updates, and unresolved security reports.

## Quarterly

1. Inventory public and partner Pages hostnames, previews, aliases, DNS records, Access coverage, exact-email entries, and active partner count.
2. Repeat unauthenticated `GET`/`HEAD` tests for partner HTML, PDF, ZIP, image, query variants, and missing paths on every hostname.
3. Review GitHub/Cloudflare/registrar/email 2FA and recovery paths, integration scopes, branch rules, DNSSEC, registrar lock, auto-renew, and billing contacts.
4. Confirm Stream origins/captions/assets, security-header policy, HSTS/DMARC phase, absence of application bindings, alert destinations, and budget ceilings.
5. Confirm `security.txt` remains current and its expiry reminder precedes the published date.

## Annual and recovery rehearsal

1. Restore a clean copy of each repository from the owner-maintained backup and run its locked test suite.
2. Verify at least two controlled copies of each source master and a sample checksum. Stream is delivery, not archival storage.
3. Rehearse a safe static rollback, failed build, Episode N+1, partner approval, active revocation, and account recovery tabletop.
4. Confirm Brian can locate the restricted configuration inventory, recovery codes, emergency contacts, raw research/identity map, masters, and private legal/IP response plan.

No task above authorizes a paid plan or automatic upgrade. A projected threshold breach pauses the dependent feature and triggers an explicit cost decision.
