# Partner portal bootstrap origin

This binding-free Worker is the minimal authenticated origin for `partners.correlius.org`.
It contains no partner-confidential material and must remain behind a Cloudflare Access
application that:

- covers the custom hostname and the Worker itself;
- uses one-time email codes;
- allows only individually approved exact email addresses;
- has no broad domain, account-member, or everyone rule; and
- uses an eight-hour session.

The Worker returns only a placeholder root page, a crawler-denying `robots.txt`, and closed
responses for every other path. Add no partner content here; the full portal belongs in its
separate private repository and deployment project.

## Replacement boundary

The substantive portal is implemented in the separate local `correlius-partner-site`
repository. Do not copy that source, generated downloads, or build output into this public
repository. Replace this bootstrap origin only after the independent Pages project is private,
its complete custom/provider/preview hostname inventory is covered by Access, and the
unauthenticated denial matrix passes for HTML, images, text downloads, ZIPs, missing paths, and
query-string variants.

Retain this Worker as the safe rollback target until the protected Pages origin and the owner
approval/revocation/logout/session-expiry rehearsals have passed.
