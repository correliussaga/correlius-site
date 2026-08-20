# Measurement Dictionary

Correlius measurement is aggregate and separated by surface. It is operational evidence, not an identity system, survey join, or proof of clinical, financial, or audience impact.

| Measure | Source | Meaning | Must not be called |
|---|---|---|---|
| Public page visit | Cloudflare edge HTTP Traffic Analytics filtered to the public hostname | An approximate request/page-traffic measure under the provider's current definition | A viewer, play, person, or supporter |
| Partner page visit | Cloudflare edge HTTP Traffic Analytics filtered to the protected hostname | Aggregate request traffic to the protected surface | A named partner action or Access approval |
| Film play/start | Cloudflare Stream Analytics, after its definition is verified | Provider-recorded playback start/view | A completed viewing or unique person unless the provider definition proves it |
| Approximate viewing minutes | Cloudflare Stream Analytics | Delivered/watch minutes under the provider's current aggregation | Attention, comprehension, or impact |
| Support link selected | Future approved aggregate action | User selected the external Fractured Atlas route | A donation or donation amount |
| Collaboration contact selected | Future separate partner aggregate action | User selected the protected contact action | A sent message, invitation, or collaboration |
| Access authentication event | Restricted Cloudflare Access logs | Provider authentication/policy evidence within available retention | Page analytics or a durable partner activity history |

## Payload rules

- No partner application analytics exist because the public site accepts no partner applications.
- No email, name, affiliation, message, Access identity, partner address, participant evidence ID, query string, arbitrary route, or free text enters an analytics payload.
- Client-side Cloudflare Web Analytics and Network Error Logging are disabled, so Correlius does not add an analytics beacon or NEL reporting endpoint to visitors' browsers.
- Public and partner edge traffic is separated by hostname and is not joined to Access logs, mailbox records, Stream identities, donations, or research data.
- Analytics failure never blocks public viewing, external support navigation, or protected contact.
- Metric definitions and provider retention are rechecked before launch and after material provider changes. Reports state definitions and limitations beside totals.
