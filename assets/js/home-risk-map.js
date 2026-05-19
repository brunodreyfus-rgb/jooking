/* Home map only.
   Important: do NOT render #worldRiskMap anymore.
   That old container sits below Search and created country pins around the search window.
*/
document.addEventListener("DOMContentLoaded", async () => {
  const heroMap = document.querySelector(".hero-map");
  if (!heroMap || !window.JookingRiskMap) return;

  try {
    const rows = await window.JookingRiskMap.loadRiskRows();
    const countries = window.JookingRiskMap.groupCountries(rows);
    window.JookingRiskMap.renderPins(heroMap, countries, { type: "home" });
  } catch (error) {
    console.warn("Home risk map using fallback pins:", error);
    window.JookingRiskMap.renderPins(heroMap, [], { type: "home" });
  }
});
