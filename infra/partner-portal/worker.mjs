const securityHeaders = {
  "Cache-Control": "private, no-store",
  "Content-Security-Policy":
    "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "Content-Type": "text/html; charset=utf-8",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

const portalHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <title>Correlius Partner Portal</title>
  </head>
  <body>
    <main>
      <p>Correlius</p>
      <h1>Partner portal</h1>
      <p>Authenticated access is active. Partner resources are being prepared.</p>
      <p><a href="/cdn-cgi/access/logout">Sign out</a></p>
    </main>
  </body>
</html>`;

const robotsText = `User-agent: *
Disallow: /
`;

function respond(body, status, method, headers = securityHeaders) {
  return new Response(method === "HEAD" ? null : body, { headers, status });
}

export default {
  fetch(request) {
    const { method } = request;
    if (method !== "GET" && method !== "HEAD") {
      return respond("Method not allowed", 405, method, {
        ...securityHeaders,
        Allow: "GET, HEAD",
        "Content-Type": "text/plain; charset=utf-8",
      });
    }

    const { pathname } = new URL(request.url);
    if (pathname === "/" || pathname === "/index.html") {
      return respond(portalHtml, 200, method);
    }
    if (pathname === "/robots.txt") {
      return respond(robotsText, 200, method, {
        ...securityHeaders,
        "Content-Type": "text/plain; charset=utf-8",
      });
    }

    return respond("Not found", 404, method, {
      ...securityHeaders,
      "Content-Type": "text/plain; charset=utf-8",
    });
  },
};
