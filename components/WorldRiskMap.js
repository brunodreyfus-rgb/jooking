import { MAP_WIDTH, MAP_HEIGHT, projectLngLat, riskColor } from '../lib/mapProjection';

const defaultEvents = [
  { id: 'paris', city: 'Paris', country: 'France', lng: 2.3522, lat: 48.8566, risk: 'medium' },
  { id: 'new-york', city: 'New York', country: 'USA', lng: -74.006, lat: 40.7128, risk: 'high' },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', lng: 139.6917, lat: 35.6895, risk: 'low' },
  { id: 'sydney', city: 'Sydney', country: 'Australia', lng: 151.2093, lat: -33.8688, risk: 'medium' },
  { id: 'sao-paulo', city: 'Sao Paulo', country: 'Brazil', lng: -46.6333, lat: -23.5505, risk: 'high' },
];

export default function WorldRiskMap({ events = defaultEvents, title = 'Live dashboard' }) {
  return (
    <section className="risk-map-card">
      <div className="risk-map-header">
        <h2>{title}</h2>
        <p>Anonymous incident reports mapped by location and risk level.</p>
      </div>

      <div className="risk-map-frame">
        <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-label="World risk map">
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} rx="24" fill="#eef2f7" />

          {/* Simplified continent silhouettes to avoid projection mismatch/cropping. */}
          <path d="M118 175 C180 95 310 100 365 178 C420 252 370 330 260 335 C145 340 70 255 118 175 Z" fill="#d7dde8" />
          <path d="M230 352 C300 320 378 355 405 420 C430 478 365 512 292 485 C225 460 185 390 230 352 Z" fill="#d7dde8" />
          <path d="M455 135 C535 70 690 85 760 158 C842 242 780 350 632 340 C500 332 390 225 455 135 Z" fill="#d7dde8" />
          <path d="M510 310 C590 292 660 335 665 410 C670 490 585 520 525 458 C480 410 460 333 510 310 Z" fill="#d7dde8" />
          <path d="M730 365 C800 328 895 350 920 410 C944 465 875 500 790 475 C720 455 680 392 730 365 Z" fill="#d7dde8" />
          <path d="M430 28 C535 5 665 8 755 35 C650 62 510 62 430 28 Z" fill="#d7dde8" opacity="0.8" />

          {events.map((event, index) => {
            const { x, y } = projectLngLat(event.lng, event.lat);
            return (
              <g key={event.id || `${event.city}-${index}`} transform={`translate(${x} ${y})`}>
                <circle r="9" fill={riskColor(event.risk)} opacity="0.22" />
                <circle r="5" fill={riskColor(event.risk)} stroke="#fff" strokeWidth="2" />
                <title>{`${event.city || 'Unknown'}, ${event.country || ''} - ${event.risk || 'unclassified'}`}</title>
              </g>
            );
          })}
        </svg>

        <div className="risk-map-legend risk-map-legend-left">
          <span><i className="dot dot-high" /> High</span>
          <span><i className="dot dot-medium" /> Medium</span>
          <span><i className="dot dot-low" /> Low</span>
        </div>
      </div>
    </section>
  );
}
