const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("[data-year]");

const updateHeader = () => {
  const isOpen = siteNav.classList.contains("is-open");
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  header.classList.toggle("nav-active", isOpen);
};

const closeNav = () => {
  siteNav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  updateHeader();
};

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  updateHeader();
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
    closeNav();
    navToggle.focus();
  }
});

year.textContent = new Date().getFullYear();
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
