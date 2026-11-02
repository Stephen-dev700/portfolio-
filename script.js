const root = document.documentElement;
const themeToggle = document.getElementById("darkModeToggle");
const revealSections = document.querySelectorAll(".reveal-section");

// Safe detection of prefers-reduced-motion
const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

root.classList.add("js");

function applyTheme(theme) {
  const isLight = theme === "light";

  root.setAttribute("data-theme", theme);

  if (!themeToggle) {
    return;
  }

  themeToggle.textContent = isLight ? "☾" : "☀";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  } catch {
    return "dark";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    // Theme switching still works for the current page when storage is unavailable.
  }
}

applyTheme(getInitialTheme());

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  saveTheme(nextTheme);
  applyTheme(nextTheme);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });
});

function showAllSections() {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  showAllSections();
} else {
  try {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    revealSections.forEach((section) => revealObserver.observe(section));
  } catch {
    showAllSections();
  }
}

// Ensure content remains visible if JavaScript encounters an initialization error.
window.addEventListener("error", showAllSections, { once: true });
window.addEventListener("unhandledrejection", showAllSections, { once: true });
