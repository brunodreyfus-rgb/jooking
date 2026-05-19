/* Jooking V2.5.24 - clickable world-map pins
   Clicking a map marker selects a country, runs the existing search,
   and scrolls to the first matching reported place.
*/
(function () {
  const regionCandidates = [
    { match: 'north america', countries: ['United States', 'Canada'] },
    { match: 'mexico / usa', countries: ['United States', 'Mexico'] },
    { match: 'south america', countries: ['Argentina', 'Chile', 'Brazil'] },
    { match: 'north africa', countries: ['Morocco', 'Tunisia', 'Egypt'] },
    { match: 'middle east', countries: ['Israel', 'United Arab Emirates', 'Turkey'] },
    { match: 'southeast asia', countries: ['Vietnam', 'Thailand'] },
    { match: 'japan / east asia', countries: ['Japan'] },
    { match: 'southern africa', countries: ['South Africa'] },
    { match: 'australia', countries: ['Australia'] }
  ];

  const europeWest = ['France', 'Spain', 'Germany', 'Norway', 'Switzerland', 'Austria'];
  const europeEast = ['Italy', 'Greece', 'Bosnia and Herzegovina', 'Austria'];

  function normalize(value) { return String(value || '').trim().toLowerCase(); }

  function getCountryOptions() {
    const select = document.getElementById('countrySelect');
    if (!select) return [];
    return Array.from(select.options)
      .map(option => ({ value: option.value, label: option.textContent.trim() }))
      .filter(option => option.value && option.value !== 'all');
  }

  function optionExists(country) {
    const options = getCountryOptions();
    return options.find(option => normalize(option.value) === normalize(country) || normalize(option.label) === normalize(country));
  }

  function firstAvailable(countries) {
    for (const country of countries) {
      const option = optionExists(country);
      if (option) return option.value;
    }
    return null;
  }

  function parseLeftPercent(pin) {
    const style = pin.getAttribute('style') || '';
    const match = style.match(/left\s*:\s*([0-9.]+)%/i);
    return match ? Number(match[1]) : null;
  }

  function inferCountryForPin(pin) {
    const explicit = pin.getAttribute('data-country') || pin.getAttribute('aria-label') || pin.getAttribute('title');
    const title = normalize(explicit);
    const direct = optionExists(explicit);
    if (direct) return direct.value;
    if (title === 'europe') {
      const left = parseLeftPercent(pin);
      return firstAvailable(left !== null && left < 52 ? europeWest : europeEast);
    }
    for (const item of regionCandidates) {
      if (title.includes(item.match)) return firstAvailable(item.countries);
    }
    return null;
  }

  function setSelectValue(select, value) {
    if (!select || !value) return false;
    const exists = Array.from(select.options).some(option => option.value === value);
    if (!exists) return false;
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function scrollToFirstReport() {
    const first = document.querySelector('#resultsGrid > article') || document.querySelector('#resultsGrid > div:not(.empty-state)') || document.getElementById('resultsGrid');
    if (!first) return;
    first.scrollIntoView({ behavior: 'smooth', block: 'start' });
    first.classList.add('jooking-report-highlight');
    setTimeout(() => first.classList.remove('jooking-report-highlight'), 1800);
  }

  function updateHint(country) {
    const title = document.querySelector('.search-title');
    if (!title) return;
    let hint = title.querySelector('.search-result-hint');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'search-result-hint';
      title.appendChild(hint);
    }
    const countText = document.getElementById('resultCount')?.textContent || '';
    const number = (countText.match(/\d+/) || [''])[0];
    hint.textContent = number ? `${number} reported place${number === '1' ? '' : 's'} below for ${country}` : `Showing reported places below for ${country}`;
  }

  function runCountrySearch(country) {
    const countrySelect = document.getElementById('countrySelect');
    const citySelect = document.getElementById('citySelect');
    const categorySelect = document.getElementById('categorySelect');
    if (!setSelectValue(countrySelect, country)) return;
    if (citySelect) { citySelect.value = 'all'; citySelect.dispatchEvent(new Event('change', { bubbles: true })); }
    if (categorySelect) { categorySelect.value = 'all'; categorySelect.dispatchEvent(new Event('change', { bubbles: true })); }
    if (typeof window.filterIncidents === 'function') window.filterIncidents();
    else document.querySelector('.search-grid .btn')?.click();
    setTimeout(() => { updateHint(country); scrollToFirstReport(); }, 250);
    if (typeof window.jookingTrack === 'function') window.jookingTrack('map_pin_country_search', { country });
  }

  function makePinsClickable() {
    const pins = document.querySelectorAll('.hero-map .map-pin, #worldRiskMap .map-pin, [data-country]');
    pins.forEach(pin => {
      if (pin.dataset.jookingClickable === '1') return;
      pin.dataset.jookingClickable = '1';
      pin.setAttribute('role', 'button');
      pin.setAttribute('tabindex', '0');
      pin.style.cursor = 'pointer';
      const handler = event => {
        event.preventDefault();
        const country = inferCountryForPin(pin);
        if (!country) return;
        runCountrySearch(country);
      };
      pin.addEventListener('click', handler);
      pin.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') handler(event); });
    });
  }
  document.addEventListener('DOMContentLoaded', makePinsClickable);
  window.addEventListener('load', makePinsClickable);
  setTimeout(makePinsClickable, 800);
  setInterval(makePinsClickable, 2000);
})();
