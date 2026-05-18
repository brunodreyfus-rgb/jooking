/* Jooking V2.5.23
   DOM cleanup for generated report cards.
   This removes Risk signal UI and yellow/red moderation badges after search.js renders cards.
*/
(function () {
  const bannedBadges = new Set([
    "MEDIA REPORT",
    "APPROVED REPORT",
    "NEEDS VERIFICATION",
    "NEEDS_VERIFICATION",
    "REJECTED",
    "DRAFT",
    "PENDING",
    "PENDING REVIEW"
  ]);

  function isAction(el) {
    const txt = (el.textContent || "").trim().toLowerCase();
    return txt.includes("view details") || txt === "comment" || txt.includes("comment");
  }

  function looksLikeBadge(el) {
    if (!el || !el.textContent) return false;
    const txt = el.textContent.trim().toUpperCase();
    if (!bannedBadges.has(txt)) return false;

    const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : { width: 0, height: 0 };
    return rect.width < 260 && rect.height < 70;
  }

  function removeBadBadges(card) {
    const nodes = card.querySelectorAll("span, div, small, strong, em, b");
    nodes.forEach(el => {
      if (looksLikeBadge(el)) el.remove();
    });
  }

  function cleanRiskColumn(card) {
    const possibleColumns = Array.from(card.children || []);

    possibleColumns.forEach(col => {
      const text = (col.textContent || "").toLowerCase();
      const buttons = Array.from(col.querySelectorAll("button, a, .btn")).filter(isAction);

      const isRiskColumn =
        text.includes("risk signal") ||
        text.includes("based on source confidence") ||
        (buttons.length > 0 && /\b[1-5]\.0\b/.test(text));

      if (!isRiskColumn) return;

      // Keep only View details / Comment actions.
      const clean = document.createElement("div");
      clean.className = col.className || "result-actions";

      buttons.forEach(btn => {
        const clone = btn.cloneNode(true);
        clone.style.display = "";
        clone.style.visibility = "";
        clean.appendChild(clone);
      });

      // If event handlers are inline attributes they are preserved by cloneNode.
      // If they were JS listeners, fallback: keep original buttons by moving them.
      if (buttons.some(btn => !btn.getAttribute("onclick"))) {
        clean.innerHTML = "";
        buttons.forEach(btn => clean.appendChild(btn));
      }

      col.replaceWith(clean);
    });
  }

  function cleanupCards() {
    const grid = document.getElementById("resultsGrid");
    if (!grid) return;

    Array.from(grid.children).forEach(card => {
      if (card.classList.contains("empty-state")) return;
      removeBadBadges(card);
      cleanRiskColumn(card);
    });
  }

  function run() {
    cleanupCards();
  }

  document.addEventListener("DOMContentLoaded", run);
  window.addEventListener("load", run);
  document.addEventListener("click", () => setTimeout(run, 100));

  const startObserver = () => {
    const grid = document.getElementById("resultsGrid");
    if (!grid) return;
    const observer = new MutationObserver(() => run());
    observer.observe(grid, { childList: true, subtree: true });
  };

  document.addEventListener("DOMContentLoaded", startObserver);
  setTimeout(startObserver, 500);
  setInterval(run, 1200);
})();
