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
