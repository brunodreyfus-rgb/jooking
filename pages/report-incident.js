import Navbar from '../components/Navbar';
import JookingLogo from '../components/JookingLogo';
import '../styles/jooking-pages.css';

export default function ReportIncidentPage() {
  return (
    <main className="jooking-page grey-bg">
      <Navbar />
      <section className="jooking-container report-layout">
        <aside className="jooking-card report-side-panel">
          <JookingLogo />
          <h1>Report an incident</h1>
          <p>
            Share what happened so Jooking can identify patterns and improve visibility on travel and
            accommodation risks.
          </p>
          <p className="privacy-note">
            Your report can be submitted anonymously. Jooking does not publicly expose personal details
            of people submitting reports.
          </p>
        </aside>

        <section className="jooking-card report-form-card">
          <h2>Incident details</h2>
          <form className="report-form">
            <label>
              Country
              <input name="country" placeholder="Country" />
            </label>
            <label>
              City
              <input name="city" placeholder="City" />
            </label>
            <label>
              Incident category
              <select name="category" defaultValue="">
                <option value="" disabled>Select a category</option>
                <option>Cancellation or refusal</option>
                <option>Safety issue</option>
                <option>Discrimination or harassment</option>
                <option>Payment or refund dispute</option>
                <option>Misleading listing</option>
              </select>
            </label>
            <label>
              Description
              <textarea name="description" rows="6" placeholder="Describe the incident" />
            </label>
            <button type="button">Submit report</button>
          </form>
        </section>
      </section>
    </main>
  );
}
