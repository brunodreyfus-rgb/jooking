function siteHeader(current = "") {
  const nav = [
    ["Home", "/index.html"],
    ["Search", "/index.html#search"],
    ["Risks", "/index.html#search"],
    ["Friendly Places", "/pages/friendly.html"],
    ["Risk Map", "/pages/country-risk.html"],
    ["Methodology", "/pages/methodology.html"],
    ["Admin", "/pages/admin.html"]
  ];

  return `
    <header class="topbar">
      <a href="/index.html" class="brand" aria-label="Jooking home">
        <img class="brand-logo" src="/assets/img/jooking-logo-final-transparent.png?v=2517" alt="Jooking" />
      </a>

      <nav class="nav">
        ${nav.map(([label, href], index) => `
          <a class="${index === 0 ? "active" : ""}" href="${href}">
            ${label}
          </a>
        `).join("")}
      </nav>

      <a class="btn btn-light report-cta" href="/pages/report.html">
        <span class="report-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 5H7.8C6.7 5 6 5.7 6 6.8v12.4C6 20.3 6.7 21 7.8 21h8.4c1.1 0 1.8-.7 1.8-1.8V6.8C18 5.7 17.3 5 16.2 5H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M9 5c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v1H9V5Z" stroke="currentColor" stroke-width="2"/>
            <path d="M9 11h6M9 15h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        Report Incident
      </a>
    </header>
  `;
}

function siteFooter() {
  return `
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <div class="brand">
            <img class="brand-logo" src="/assets/img/jooking-logo-final-transparent.png?v=2517" alt="Jooking" />
          </div>
          <p>Travel informed. Stay aware.</p>
        </div>

        <p>© 2026 Jooking. Evidence-first travel intelligence.</p>
      </div>
    </footer>
  `;
}

function replaceBrandText(root = document.body) {
  if (!root) return;

  document.title = (document.title || "")
    .replace(/AntiBooking/g, "Jooking")
    .replace(/antibooking/g, "jooking");

  document.querySelectorAll("meta").forEach(meta => {
    const content = meta.getAttribute("content");
    if (content) {
      meta.setAttribute("content", content
        .replace(/AntiBooking/g, "Jooking")
        .replace(/antibooking/g, "jooking"));
    }
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const oldValue = node.nodeValue;
    const newValue = oldValue
      .replace(/AntiBooking/g, "Jooking")
      .replace(/antibooking/g, "jooking");
    if (oldValue !== newValue) node.nodeValue = newValue;
  });
}

function mountLayout() {
  const header = document.getElementById("siteHeader");
  const footer = document.getElementById("siteFooter");

  if (header) header.innerHTML = siteHeader();
  if (footer) footer.innerHTML = siteFooter();

  replaceBrandText();
}

document.addEventListener("DOMContentLoaded", mountLayout);
