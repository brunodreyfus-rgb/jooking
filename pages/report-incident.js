import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { filterNewReportedEvents } from '../lib/reportedEventsImport';
import '../styles/jooking-pages.css';

export default function ReportIncidentPage() {
  const [existingEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);

  const newEvents = useMemo(() => filterNewReportedEvents(pendingEvents, existingEvents), [pendingEvents, existingEvents]);

  return (
    <div className="jooking-page grey-bg">
      <Navbar />
      <main className="jooking-main wide report-grid">
        <aside className="hero-card left-panel">
          <p className="eyebrow">Report incident</p>
          <h1>Share an anonymous report</h1>
          <p>
            Submit a report to help Jooking identify repeated risks and protect other users. Your identity
            is protected and the public platform only uses anonymized information.
          </p>
          <p>
            You can also prepare a batch of reported events and import only the ones that are not already
            present in the platform.
          </p>
        </aside>

        <section className="content-card">
          <h2>Incident details</h2>
          <form className="incident-form">
            <label>
              Location
              <input name="location" placeholder="City, country" />
            </label>
            <label>
              Risk type
              <select name="riskType" defaultValue="">
                <option value="" disabled>Select a risk type</option>
                <option>Fraud</option>
                <option>Safety</option>
                <option>Cancellation</option>
                <option>Harassment</option>
                <option>Operational issue</option>
              </select>
            </label>
            <label>
              Description
              <textarea name="description" rows="6" placeholder="Describe what happened without sharing personal details." />
            </label>
            <button type="button">Submit report</button>
          </form>
        </section>

        <section className="content-card import-card">
          <h2>Import reported events not yet in the platform</h2>
          <p>
            Use `filterNewReportedEvents(reportedEvents, existingEvents)` from `lib/reportedEventsImport.js`
            before sending events to Supabase. It removes duplicates based on id or normalized event fields.
          </p>
          <div className="metric-row">
            <span>Pending events</span>
            <strong>{pendingEvents.length}</strong>
          </div>
          <div className="metric-row">
            <span>New events ready to import</span>
            <strong>{newEvents.length}</strong>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
