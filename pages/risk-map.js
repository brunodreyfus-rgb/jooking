import Layout from '../components/Layout';
import JookingWorldMap from '../components/JookingWorldMap';

const incidents = [
  { id: 'ca-1', title: 'Northern region visibility test', country: 'Canada', lat: 56.1304, lng: -106.3468, severity: 'medium' },
  { id: 'no-1', title: 'Northern Europe visibility test', country: 'Norway', lat: 60.472, lng: 8.4689, severity: 'high' },
  { id: 'jp-1', title: 'Listing mismatch report', country: 'Japan', lat: 36.2048, lng: 138.2529, severity: 'low' },
  { id: 'br-1', title: 'Refund issue report', country: 'Brazil', lat: -14.235, lng: -51.9253, severity: 'critical' },
];

export default function RiskMap() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Risk Map</h1>
            <p className="text-neutral-600 mt-2">Live dashboard of reported travel and booking incidents.</p>
          </div>
          <div className="rounded-full bg-white border border-neutral-200 px-4 py-2 text-sm text-neutral-600">Live dashboard</div>
        </div>
        <JookingWorldMap incidents={incidents} height={560} />
      </section>
    </Layout>
  );
}
