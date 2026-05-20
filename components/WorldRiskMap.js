const riskPoints = [
  { id: 'paris', name: 'Paris', x: 49.5, y: 36.5, level: 'medium' },
  { id: 'london', name: 'London', x: 48.4, y: 34.3, level: 'low' },
  { id: 'new-york', name: 'New York', x: 27.5, y: 39.6, level: 'high' },
  { id: 'montreal', name: 'Montreal', x: 28.5, y: 35.4, level: 'medium' },
  { id: 'tokyo', name: 'Tokyo', x: 82.2, y: 44.7, level: 'medium' },
  { id: 'sydney', name: 'Sydney', x: 85.0, y: 74.8, level: 'low' },
  { id: 'sao-paulo', name: 'São Paulo', x: 36.5, y: 70.8, level: 'high' },
  { id: 'cape-town', name: 'Cape Town', x: 52.5, y: 77.0, level: 'medium' },
];

const levelClass = {
  low: 'risk-low',
  medium: 'risk-medium',
  high: 'risk-high',
};

export default function WorldRiskMap({ compact = false }) {
  return (
    <section className={compact ? 'map-card compact' : 'map-card'}>
      <div className="map-frame" role="img" aria-label="World risk map with incident markers">
        <svg viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet" className="world-map-svg">
          <rect x="0" y="0" width="1000" height="520" rx="28" className="map-ocean" />

          <path className="continent" d="M98 127c48-35 120-47 176-21 33 16 57 44 78 72 20 27 37 55 64 73 25 17 58 22 82 41 28 21 39 58 23 88-15 28-52 39-84 34-48-7-82-47-124-68-43-21-98-21-132-56-28-29-34-73-61-103-18-20-43-30-57-54-13-23 11-42 35-56z" />
          <path className="continent" d="M364 100c47-28 116-30 166-7 37 17 66 48 102 67 42 22 95 24 133 52 33 24 50 68 35 105-16 38-62 55-101 70-47 19-91 43-139 56-69 18-146 6-202-38-52-40-84-107-78-172 5-53 38-104 84-133z" />
          <path className="continent" d="M646 162c52-31 128-20 169 23 28 29 40 70 64 103 23 32 60 55 70 94 8 31-5 66-31 85-29 21-70 19-103 6-39-15-69-44-106-63-41-21-91-28-121-64-27-33-28-83-11-121 14-30 39-49 69-63z" />
          <path className="continent" d="M469 321c45 4 83 33 108 69 21 31 34 69 27 106-7 33-34 62-67 66-37 5-73-20-90-52-20-37-16-82-27-123-7-26-22-56-6-78 12-17 34-18 55-16z" />
          <path className="continent" d="M782 349c38-14 88 0 110 34 19 30 11 73-17 95-31 24-80 23-110 0-27-21-38-61-20-91 9-16 22-30 37-38z" />
          <path className="continent" d="M486 76c30-11 74-6 94 20 10 13 10 32-3 43-18 16-49 9-71 2-26-8-55-26-49-48 3-9 15-14 29-17z" />

          {riskPoints.map((point) => (
            <g key={point.id} transform={`translate(${point.x * 10}, ${point.y * 5.2})`} className="risk-marker">
              <circle r="10" className={`risk-dot ${levelClass[point.level]}`} />
              <circle r="18" className={`risk-pulse ${levelClass[point.level]}`} />
              <title>{`${point.name} - ${point.level} risk`}</title>
            </g>
          ))}
        </svg>
        <div className="map-legend bottom-left">
          <span><i className="legend-dot risk-low" />Low</span>
          <span><i className="legend-dot risk-medium" />Medium</span>
          <span><i className="legend-dot risk-high" />High</span>
        </div>
      </div>
    </section>
  );
}
