document.querySelectorAll("[data-stream-player]").forEach((player) => {
  const button = player.querySelector("[data-stream-load]");
  const status = player.parentElement?.querySelector("[data-stream-status]");

  button?.addEventListener("click", () => {
    try {
      const source = new URL(player.dataset.playerSrc);
      if (
        source.protocol !== "https:" ||
        !/^customer-[a-z0-9]+\.cloudflarestream\.com$/u.test(source.hostname) ||
        !source.pathname.endsWith("/iframe")
      ) {
        throw new Error("Unexpected player source.");
      }

      const iframe = document.createElement("iframe");
      iframe.src = source.href;
      iframe.title = button.dataset.playerTitle || "Correlius video player";
      iframe.allow = "encrypted-media; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.addEventListener("load", () => {
        if (status) status.textContent = "Video player loaded. Playback remains under your control.";
      });

      player.replaceChildren(iframe);
    } catch {
      if (status) {
        status.textContent = "The video player could not be loaded. Please try again later.";
      }
    }
  });
});
