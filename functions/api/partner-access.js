const headers = {
  "Cache-Control": "private, no-store",
  "Content-Security-Policy": "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "Content-Type": "text/plain; charset=utf-8",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

export async function onRequest() {
  return new Response(
    "Partner applications are not accepted online. Access is offered only after private vetting and approval.",
    { status: 410, headers },
  );
}
