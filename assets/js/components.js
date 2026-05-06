function siteHeader(current = "") {
  return `
    <header class="topbar">
      <a href="/index.html" class="brand" aria-label="AntiBooking home">
        <img class="brand-logo" src="/assets/img/logo.svg" alt="AntiBooking logo" />
        <span>AntiBooking</span>
      </a>
      <nav class="nav">
        <a href="/index.html">Home</a>
        <a href="/index.html#search">Search</a>
        <a href="/pages/report.html">Report Incident</a>
        <a href="/pages/resources.html">Resources</a>
        <a href="/pages/country-risk.html">Country Risk</a>
        <a href="/pages/admin.html">Admin</a>
        <a href="/pages/about.html">About Us</a>
        <a href="/pages/contact.html">Contact Us</a>
      </nav>
      <a class="btn btn-light" href="/pages/report.html">Report</a>
    </header>
  `;
}

function siteFooter() {
  return `
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <div class="brand"><img class="brand-logo" src="/assets/img/logo.svg" alt="AntiBooking logo" /><span>AntiBooking</span></div>
          <p>Travel informed. Stand against discrimination.</p>
        </div>
        <p>© 2026 AntiBooking. Reports are moderated before publication.</p>
      </div>
    </footer>
  `;
}

function mountLayout() {
  const header = document.getElementById("siteHeader");
  const footer = document.getElementById("siteFooter");
  if (header) header.innerHTML = siteHeader();
  if (footer) footer.innerHTML = siteFooter();
}
document.addEventListener("DOMContentLoaded", mountLayout);