const mobileNavigation = window.matchMedia("(max-width: 48rem)");

document.querySelectorAll("[data-site-header]").forEach((header) => {
  const button = header.querySelector("[data-menu-button]");
  const label = header.querySelector("[data-menu-label]");
  const navigation = header.querySelector("[data-site-navigation]");
  const links = [...navigation.querySelectorAll("a")];

  const setOpen = (open, moveFocus = false) => {
    button.setAttribute("aria-expanded", String(open));
    navigation.dataset.open = String(open);
    label.textContent = open ? "Close" : "Menu";

    if (open && moveFocus) links[0]?.focus();
  };

  header.dataset.enhanced = "true";
  setOpen(false);

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true", true);
  });

  header.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });

  links.forEach((link) => link.addEventListener("click", () => setOpen(false)));
  mobileNavigation.addEventListener("change", () => setOpen(false));
});
