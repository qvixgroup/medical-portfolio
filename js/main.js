// Dr. Gazi Sazzad Hossain — Medical Portfolio
// Interactions are added phase by phase (nav, mobile menu, search).

document.addEventListener("DOMContentLoaded", () => {
  // Keep the footer year current (used from Phase 6)
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Navbar gets a glass background once the page scrolls
  const navbar = document.getElementById("navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
