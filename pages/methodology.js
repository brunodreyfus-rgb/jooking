import Layout from '../components/Layout';

export default function MethodologyPage() {
  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Methodology</h1>
        <div className="mt-8 space-y-6">
          <article className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold">How reports are processed</h2>
            <p className="text-neutral-600 mt-3">Jooking reviews submitted reports, groups them into risk categories, and displays aggregated signals to help users understand recurring patterns.</p>
          </article>
          <article className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Anonymity guarantee</h2>
            <p className="text-neutral-600 mt-3">Jooking guarantees the anonymity and confidentiality of individuals submitting incident reports. Personal identifiers are not publicly exposed, and public dashboards focus on aggregated risk signals rather than individual identities.</p>
          </article>
          <article className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Risk levels</h2>
            <p className="text-neutral-600 mt-3">Risk levels are based on report frequency, severity, recency, and corroborating signals. They are designed as guidance indicators, not legal conclusions.</p>
          </article>
        </div>
      </section>
    </Layout>
  );
}
