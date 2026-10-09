const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
const navbar = document.getElementById("navbar");
const year = document.getElementById("year");

const applyThemeState = () => {
  const isLight = html.classList.contains("light");
  if (themeLabel) {
    themeLabel.textContent = isLight ? "Light" : "Dark";
  }
  themeToggle?.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isLight ? "#f4f7f5" : "#080c10");
};

try {
  if (localStorage.getItem("theme") === "light") html.classList.add("light");
} catch { /* Theme controls also work when storage is unavailable. */ }
applyThemeState();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    html.classList.toggle("light");
    try {
      localStorage.setItem("theme", html.classList.contains("light") ? "light" : "dark");
    } catch { /* Keep the selected theme for this page. */ }
    applyThemeState();
  });
}

if (navToggle && mobileMenu) {
  const closeMenu = () => {
    mobileMenu.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  };
  navToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("show");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
      const target = document.querySelector(link.hash);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu.classList.contains("show")) {
      closeMenu();
      navToggle.focus();
    }
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

const syncNavbar = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 40);
};

syncNavbar();
window.addEventListener("scroll", syncNavbar, { passive: true });

const observerTargets = document.querySelectorAll(
  ".reveal, .timeline-item, .project-card, .edu-card"
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  observerTargets.forEach((element) => {
    element.classList.add("reveal-pending");
    observer.observe(element);
  });
} else {
  observerTargets.forEach((element) => element.classList.add("visible"));
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const orb1 = document.querySelector(".orb1");
const orb2 = document.querySelector(".orb2");

if (!prefersReducedMotion.matches && orb1 && orb2) {
  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 24;
    const y = (event.clientY / window.innerHeight - 0.5) * 24;

    orb1.style.transform = `translate(${x}px, ${y}px)`;
    orb2.style.transform = `translate(${-x * 0.55}px, ${-y * 0.55}px)`;
  });
}
