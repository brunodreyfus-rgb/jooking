/* AntiBooking V2.4.17 - public privacy cleanup */

function sanitizePublicText(value) {
  return String(value || "")
    .replace(/Le Parisien article provided by Bruno/gi, "Le Parisien article provided by admin")
    .replace(/source provided by Bruno/gi, "source provided by admin")
    .replace(/provided by Bruno/gi, "provided by admin")
    .replace(/validated by Bruno/gi, "validated by admin")
    .replace(/approved by Bruno/gi, "approved by admin")
    .replace(/Bruno Dreyfus/gi, "admin")
    .replace(/Bruno/gi, "admin")
    .replace(/bruno\.dreyfus@gmail\.com/gi, "approved AntiBooking moderator")
    .replace(/bruno\.d@tenengroup\.com/gi, "approved AntiBooking moderator");
}

function sanitizePublicNodeTree(root = document.body) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(node => {
    const cleaned = sanitizePublicText(node.nodeValue);
    if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
  });

  root.querySelectorAll("a, img, input, textarea, button").forEach(el => {
    ["title", "alt", "placeholder", "aria-label", "value"].forEach(attr => {
      if (el.hasAttribute && el.hasAttribute(attr)) {
        const oldValue = el.getAttribute(attr);
        const newValue = sanitizePublicText(oldValue);
        if (oldValue !== newValue) el.setAttribute(attr, newValue);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  sanitizePublicNodeTree();

  const observer = new MutationObserver(() => sanitizePublicNodeTree());
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
});
