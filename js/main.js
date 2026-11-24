// Dr. Gazi Sazzad Hossain — Medical Portfolio
// Small vanilla JS: navbar state, mobile menu, active links, site search, reveal animations.

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Navbar glass on scroll ---------- */
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navbar.classList.toggle("menu-open", open);
    mobileMenu.hidden = !open;
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileMenu.hidden) { setMenu(false); toggle.focus(); }
  });
  // Close the menu if the screen grows past the mobile breakpoint
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- Active nav link while scrolling ---------- */
  // Sections without their own nav item highlight the closest one.
  const navTarget = { home: "home", about: "about", work: "work", highlights: "highlights", contact: "contact" };
  const desktopFallback = { work: "home", highlights: "home" };
  const navLinks = document.querySelectorAll(".nav-link");

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href").slice(1);
      const inMobile = link.closest(".mobile-menu");
      const target = inMobile ? navTarget[id] : (desktopFallback[id] || id);
      link.classList.toggle("active", href === target);
    });
  };

  const sections = ["home", "about", "work", "highlights", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Site search ---------- */
  // Finds the first heading, card or paragraph containing the query and scrolls to it.
  const searchable = Array.from(
    document.querySelectorAll(
      "main h2, main h3, main p, main li, main blockquote, .hero-card, .hero-info li, .hero-title, .hero-tagline"
    )
  );

  const runSearch = (form) => {
    const input = form.querySelector("input");
    const msg = form.querySelector(".search-msg");
    const q = input.value.trim().toLowerCase();
    msg.textContent = "";
    if (!q) return;

    const hit = searchable.find((el) => el.textContent.toLowerCase().includes(q));
    if (!hit) {
      msg.textContent = "No results";
      form.classList.add("no-results");
      setTimeout(() => { msg.textContent = ""; form.classList.remove("no-results"); }, 2200);
      return;
    }

    setMenu(false);
    input.blur();
    const target = hit.closest(".hero-card, .work-card, .hl-card, .hero-info li, .about-points li, .socials li") || hit;
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    target.classList.remove("search-hit");
    void target.offsetWidth; // restart the highlight animation
    target.classList.add("search-hit");
    setTimeout(() => target.classList.remove("search-hit"), 2400);
  };

  document.querySelectorAll(".nav-search").forEach((form) => {
    form.addEventListener("submit", (e) => { e.preventDefault(); runSearch(form); });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealSelectors = [
    ".hero-content > *", ".hero-visual", ".hero-info",
    ".about-visual", ".about-content",
    ".section-head", ".work-card", ".hl-card",
    ".envelope", ".contact-content", ".socials li",
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(","));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    // Stagger siblings slightly (cards, social icons)
    revealEls.forEach((el) => {
      el.classList.add("reveal");
      const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
      el.style.setProperty("--delay", `${Math.min(siblings.indexOf(el), 6) * 80}ms`);
    });

    const revealer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealer.observe(el));
  }
});
