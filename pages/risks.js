import Layout from '../components/Layout';

const risks = [
  'Unauthorized or last-minute cancellation',
  'Misleading listing information',
  'Refund or payment dispute',
  'Host or guest pressure behavior',
  'Unsafe check-in or access issue',
];

export default function RisksPage() {
  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Risks</h1>
        <p className="text-neutral-600 mt-3">A structured view of the main incident categories tracked by Jooking.</p>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {risks.map((risk) => (
            <div key={risk} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold">{risk}</h2>
              <p className="text-sm text-neutral-600 mt-2">Reports are anonymized, categorized, and aggregated before being shown publicly.</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
