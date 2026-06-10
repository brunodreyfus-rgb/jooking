function siteHeader(current = "") {
  const nav = [
    ["Home", "/index.html"],
    ["Friendly Places", "/pages/friendly.html"],
    ["Risk Map", "/pages/country-risk.html"],
    ["Methodology", "/pages/methodology.html"],
    ["Admin", "/pages/admin.html"]
  ];

  const active = (label, href) => current === label || current === href;

  return `
    <header class="topbar">
      <a href="/index.html" class="brand" aria-label="Jooking home">
        <img class="brand-logo" src="/assets/img/jooking-logo-final-transparent.png?v=2517" alt="Jooking" />
      </a>

      <button class="mobile-menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="nav">
        ${nav.map(([label, href]) => `<a class="${active(label, href) ? "active" : ""}" href="${href}">${label}</a>`).join("")}
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
    </header>`;
}

function siteFooter() {
  return `<footer class="footer"><div class="footer-grid"><div><div class="brand"><img class="brand-logo" src="/assets/img/jooking-logo-final-transparent.png?v=2517" alt="Jooking" /></div><p>Travel informed. Stay aware.</p></div><p>© 2026 Jooking. Evidence-first travel intelligence.</p></div></footer>`;
}

function injectMobileMenuAndStoreStyles() {
  if (document.getElementById("jooking-mobile-menu-store-fix")) return;

  const style = document.createElement("style");
  style.id = "jooking-mobile-menu-store-fix";
  style.textContent = `
    .mobile-menu-toggle {
      display: none;
      width: 44px;
      height: 44px;
      border: 1px solid rgba(255,255,255,.22);
      border-radius: 14px;
      background: rgba(255,255,255,.08);
      color: #fff;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
    }

    .mobile-menu-toggle span {
      display: block;
      width: 20px;
      height: 2px;
      background: currentColor;
      border-radius: 99px;
    }

    .category-tile img[src*="store"] {
      width: 94px !important;
      height: 94px !important;
      max-width: 94px !important;
      max-height: 94px !important;
      object-fit: contain !important;
      transform: scale(1.12);
      transform-origin: center;
    }

    @media (max-width: 820px) {
      .topbar {
        position: relative !important;
        display: grid !important;
        grid-template-columns: 1fr auto auto !important;
        align-items: center !important;
        gap: 10px !important;
        padding-left: 14px !important;
        padding-right: 14px !important;
      }

      .topbar .brand {
        min-width: 0 !important;
      }

      .topbar .brand-logo {
        max-width: 150px !important;
        height: auto !important;
      }

      .mobile-menu-toggle {
        display: inline-flex !important;
        order: 2;
      }

      .topbar .report-cta {
        order: 3;
        white-space: nowrap !important;
        padding: 12px 14px !important;
        font-size: 14px !important;
      }

      .topbar .nav {
        display: none !important;
        position: absolute !important;
        top: calc(100% + 8px) !important;
        left: 12px !important;
        right: 12px !important;
        z-index: 10000 !important;
        background: #0b2559 !important;
        border: 1px solid rgba(255,255,255,.18) !important;
        border-radius: 18px !important;
        padding: 12px !important;
        box-shadow: 0 20px 45px rgba(0,0,0,.28) !important;
      }

      .topbar.nav-open .nav {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 6px !important;
      }

      .topbar .nav a {
        display: block !important;
        padding: 13px 14px !important;
        border-radius: 12px !important;
        color: #ffffff !important;
        text-decoration: none !important;
        font-weight: 900 !important;
      }

      .topbar .nav a:visited {
        color: #ffffff !important;
      }

      .topbar .nav a:hover,
      .topbar .nav a.active {
        background: rgba(255,255,255,.18) !important;
        color: #ffffff !important;
      }
    }

    @media (max-width: 480px) {
      .topbar {
        grid-template-columns: 1fr auto !important;
      }

      .topbar .report-cta {
        grid-column: 1 / -1 !important;
        justify-self: stretch !important;
        justify-content: center !important;
        margin-top: 8px !important;
      }

      .topbar .brand-logo {
        max-width: 138px !important;
      }

      .category-tile img[src*="store"] {
        width: 100px !important;
        height: 100px !important;
        max-width: 100px !important;
        max-height: 100px !important;
        transform: scale(1.18);
      }
    }
  `;
  document.head.appendChild(style);
}

function setupMobileMenu() {
  const header = document.querySelector(".topbar");
  const toggle = document.querySelector(".mobile-menu-toggle");
  if (!header || !toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  header.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });

  document.addEventListener("click", event => {
    if (!header.contains(event.target)) {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  });
}

function replaceBrandText(root = document.body) {
  if (!root) return;

  document.title = (document.title || "").replace(/AntiBooking/g, "Jooking").replace(/antibooking/g, "jooking");

  document.querySelectorAll("meta").forEach(meta => {
    const content = meta.getAttribute("content");
    if (content) meta.setAttribute("content", content.replace(/AntiBooking/g, "Jooking").replace(/antibooking/g, "jooking"));
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const oldValue = node.nodeValue;
    const newValue = oldValue.replace(/AntiBooking/g, "Jooking").replace(/antibooking/g, "jooking");
    if (oldValue !== newValue) node.nodeValue = newValue;
  });
}

function getCurrentNavLabel() {
  const path = window.location.pathname;
  if (path.includes("country-risk")) return "Risk Map";
  if (path.includes("methodology")) return "Methodology";
  if (path.includes("friendly")) return "Friendly Places";
  if (path.includes("admin")) return "Admin";
  return "Home";
}

function mountLayout() {
  injectMobileMenuAndStoreStyles();

  const header = document.getElementById("siteHeader");
  const footer = document.getElementById("siteFooter");

  if (header) header.innerHTML = siteHeader(getCurrentNavLabel());
  if (footer) footer.innerHTML = siteFooter();

  setupMobileMenu();
  replaceBrandText();
}

document.addEventListener("DOMContentLoaded", mountLayout);
