import Layout from '../components/Layout';

export default function SearchPage() {
  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-neutral-600 mt-3">Search reported incidents by country, city, platform, risk level, or keyword.</p>
        <div className="mt-8 bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Search incidents</label>
          <input className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900" placeholder="Example: refund, cancellation, France, host pressure..." />
        </div>
      </section>
    </Layout>
  );
}
