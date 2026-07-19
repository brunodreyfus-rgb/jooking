/* Home map renderer: use the same coordinates, score and projection as the Risk Map page. */
(function () {
  if (window.__JOOKING_HOME_MAP_RENDERED__) return;
  window.__JOOKING_HOME_MAP_RENDERED__ = true;

  async function renderHomeMap() {
    const map = document.querySelector('.hero-map');
    if (!map || !window.JookingRiskMap) return;

    try {
      const rows = await window.JookingRiskMap.loadRiskRows();
      const countries = window.JookingRiskMap.groupCountries(rows);
      window.JookingRiskMap.renderPins(map, countries, { type: 'home' });
    } catch (error) {
      console.error('Home risk map failed', error);
    }
  }

  document.addEventListener('DOMContentLoaded', renderHomeMap);
})();
