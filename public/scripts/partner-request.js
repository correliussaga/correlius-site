const turnstileScriptSource =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileLoader;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileLoader) return turnstileLoader;

  turnstileLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = turnstileScriptSource;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile did not initialize."));
    });
    script.addEventListener("error", () => reject(new Error("Turnstile could not load.")));
    document.head.append(script);
  });

  return turnstileLoader;
}

document.querySelectorAll("[data-partner-request-form='enabled']").forEach((form) => {
  const container = form.querySelector("[data-turnstile-container]");
  const status = form.querySelector("[data-request-status]");
  const submitButton = form.querySelector("button[type='submit']");
  let widgetId = null;
  let verifying = false;

  const setStatus = (message) => {
    if (status) status.textContent = message;
  };

  const finishAttempt = (message) => {
    verifying = false;
    if (submitButton) submitButton.disabled = false;
    setStatus(message);
  };

  form.addEventListener("submit", async (event) => {
    const responseField = form.elements.namedItem("cf-turnstile-response");
    if (responseField?.value) return;

    event.preventDefault();
    if (verifying || !container?.dataset.sitekey) return;

    verifying = true;
    if (submitButton) submitButton.disabled = true;
    setStatus("Checking this request securely…");

    try {
      const turnstile = await loadTurnstile();

      if (widgetId === null) {
        widgetId = turnstile.render(container, {
          sitekey: container.dataset.sitekey,
          action: "partner_request",
          execution: "execute",
          appearance: "interaction-only",
          "response-field": true,
          "response-field-name": "cf-turnstile-response",
          callback: () => {
            finishAttempt("Verification complete. Submitting your request…");
            if (submitButton) form.requestSubmit(submitButton);
            else form.requestSubmit();
          },
          "error-callback": () => {
            finishAttempt("Verification could not be completed. Please try again.");
          },
          "expired-callback": () => {
            finishAttempt("Verification expired. Submit again to retry.");
          },
          "timeout-callback": () => {
            finishAttempt("Verification timed out. Submit again to retry.");
          },
        });
      }

      turnstile.execute(widgetId);
    } catch {
      finishAttempt("Verification is temporarily unavailable. Please try again later.");
    }
  });
});
