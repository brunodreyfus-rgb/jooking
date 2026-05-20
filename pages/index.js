import Layout from '../components/Layout';
import JookingWorldMap from '../components/JookingWorldMap';

const sampleIncidents = [
  { id: 'fr-1', title: 'Unauthorized cancellation report', country: 'France', lat: 46.2276, lng: 2.2137, severity: 'high' },
  { id: 'es-1', title: 'Host pressure report', country: 'Spain', lat: 40.4637, lng: -3.7492, severity: 'medium' },
  { id: 'us-1', title: 'Payment dispute report', country: 'United States', lat: 37.0902, lng: -95.7129, severity: 'critical' },
  { id: 'au-1', title: 'Check-in issue report', country: 'Australia', lat: -25.2744, lng: 133.7751, severity: 'low' },
];

export default function Home() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-3xl mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Jooking AntiBooking V1</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">Anonymous incident intelligence for safer travel decisions.</h1>
          <p className="text-lg text-neutral-600 mt-4">Explore verified reporting patterns, risk signals, and live incident trends across regions.</p>
        </div>
        <JookingWorldMap incidents={sampleIncidents} height={500} />
      </section>
    </Layout>
  );
}
