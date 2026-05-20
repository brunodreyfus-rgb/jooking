import Layout from '../components/Layout';

export default function ReportIncidentPage() {
  return (
    <Layout>
      <section className="bg-neutral-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-[0.85fr_1.15fr] gap-8">
          <aside className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm h-fit">
            <img src="/logo-jooking.svg" alt="Jooking" className="h-10 w-auto mb-6" />
            <h1 className="text-3xl font-bold tracking-tight">Report an incident</h1>
            <p className="text-neutral-600 mt-4">Share what happened so Jooking can identify recurring risks and help protect other travellers.</p>
            <div className="mt-6 rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-700">
              Reports can be submitted anonymously. Jooking does not publicly display personal identifiers from submitted reports.
            </div>
          </aside>

          <form className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Incident title</label>
              <input className="w-full rounded-xl border border-neutral-300 px-4 py-3" placeholder="Brief summary" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Country</label>
                <input className="w-full rounded-xl border border-neutral-300 px-4 py-3" placeholder="Country" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">City</label>
                <input className="w-full rounded-xl border border-neutral-300 px-4 py-3" placeholder="City" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
              <textarea className="w-full rounded-xl border border-neutral-300 px-4 py-3 min-h-36" placeholder="Describe the incident" />
            </div>
            <button type="submit" className="rounded-xl bg-neutral-900 text-white px-5 py-3 font-medium hover:bg-neutral-700">Submit report</button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
