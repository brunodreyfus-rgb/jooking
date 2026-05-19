/* Jooking V2.5.24 - lightweight click tracking for Vercel Web Analytics when available. */
(function () {
  function text(el) { return String(el?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120); }
  function safePayload(payload) {
    const clean = {};
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      clean[key] = String(value).slice(0, 180);
    });
    return clean;
  }
  window.jookingTrack = function (name, payload) {
    const data = safePayload(payload);
    try { if (typeof window.va === 'function') window.va('event', { name, data }); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('jooking:track', { detail: { name, data } })); } catch (e) {}
    if (location.hostname.includes('localhost') || location.search.includes('debugAnalytics=1')) console.info('[Jooking analytics]', name, data);
  };
  function closest(el, selector) { return el && el.closest ? el.closest(selector) : null; }
  document.addEventListener('click', event => {
    const target = event.target;
    const button = closest(target, 'a, button, .btn, .category-card, .map-pin');
    if (!button) return;
    const label = text(button);
    const href = button.getAttribute?.('href') || '';
    if (label.toLowerCase().includes('view details')) return window.jookingTrack('view_details_click', { label });
    if (label.toLowerCase().includes('comment')) return window.jookingTrack('comment_click', { label });
    if (label.toLowerCase().includes('report incident') || label.toLowerCase().includes('submit a report')) return window.jookingTrack('report_incident_click', { label, href });
    if (closest(button, '.category-card')) return window.jookingTrack('category_click', { category: label });
    if (closest(button, '.map-pin')) return window.jookingTrack('map_pin_click', { title: button.getAttribute('title') || label });
    if (href.includes('friendly')) return window.jookingTrack('friendly_places_nav_click', { label, href });
    if (href.includes('risk-map') || href.includes('country-risk')) return window.jookingTrack('risk_map_nav_click', { label, href });
  });
  document.addEventListener('change', event => {
    const el = event.target;
    if (!el || !['countrySelect', 'citySelect', 'categorySelect'].includes(el.id)) return;
    window.jookingTrack('search_filter_change', { filter: el.id, value: el.value });
  });
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!form) return;
    window.jookingTrack('form_submit', { id: form.id || '', action: form.getAttribute('action') || location.pathname });
  });
})();
