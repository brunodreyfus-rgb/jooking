import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { useMemo } from 'react';
import world from 'world-atlas/countries-110m.json';

const severityClass = {
  low: 'fill-emerald-500',
  medium: 'fill-amber-500',
  high: 'fill-orange-600',
  critical: 'fill-red-600',
};

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function JookingWorldMap({ incidents = [], height = 520, showLegend = true }) {
  const width = 960;

  const { countries, path, projection } = useMemo(() => {
    const countriesFeature = feature(world, world.objects.countries);
    const projection = geoNaturalEarth1().fitExtent(
      [
        [16, 16],
        [width - 16, height - 16],
      ],
      { type: 'Sphere' }
    );
    return {
      countries: countriesFeature.features,
      projection,
      path: geoPath(projection),
    };
  }, [height]);

  const plottedIncidents = incidents
    .map((incident) => {
      const lat = safeNumber(incident.lat ?? incident.latitude);
      const lng = safeNumber(incident.lng ?? incident.lon ?? incident.longitude);
      if (lat === null || lng === null) return null;
      const point = projection([lng, lat]);
      if (!point) return null;
      return { ...incident, x: point[0], y: point[1] };
    })
    .filter(Boolean);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-neutral-200">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Jooking world risk map" className="w-full h-auto block">
        <rect width={width} height={height} className="fill-sky-50" />
        <g>
          {countries.map((country) => (
            <path
              key={country.id}
              d={path(country)}
              className="fill-neutral-200 stroke-white stroke-[0.5]"
            />
          ))}
        </g>
        <g>
          {plottedIncidents.map((incident) => {
            const severity = String(incident.severity || 'medium').toLowerCase();
            return (
              <g key={incident.id || `${incident.title}-${incident.x}-${incident.y}`} transform={`translate(${incident.x}, ${incident.y})`}>
                <circle r="8" className={`${severityClass[severity] || severityClass.medium} opacity-25`} />
                <circle r="4" className={`${severityClass[severity] || severityClass.medium} stroke-white stroke-2`} />
                <title>{incident.title || incident.country || 'Reported incident'}</title>
              </g>
            );
          })}
        </g>
      </svg>

      {showLegend && (
        <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur rounded-xl shadow-sm border border-neutral-200 px-4 py-3 text-xs text-neutral-700">
          <div className="font-semibold mb-2 text-neutral-900">Risk level</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span><i className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />Low</span>
            <span><i className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />Medium</span>
            <span><i className="inline-block w-2.5 h-2.5 rounded-full bg-orange-600 mr-2" />High</span>
            <span><i className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 mr-2" />Critical</span>
          </div>
        </div>
      )}
    </div>
  );
}
