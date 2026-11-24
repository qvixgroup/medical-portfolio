// Dr. Gazi Sazzad Hossain — Medical Portfolio
// Interactions are added phase by phase (nav, mobile menu, search).

document.addEventListener("DOMContentLoaded", () => {
  // Keep the footer year current (used from Phase 6)
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
