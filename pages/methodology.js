import Navbar from '../components/Navbar';
import '../styles/jooking-pages.css';

export default function MethodologyPage() {
  return (
    <main className="jooking-page grey-bg">
      <Navbar />
      <section className="jooking-container">
        <div className="jooking-card">
          <p className="eyebrow">Methodology</p>
          <h1>How Jooking processes reports</h1>
          <p>
            Jooking collects incident reports to identify risk patterns while protecting contributors.
            Reports are reviewed, categorized, and mapped only when they contain enough reliable context.
          </p>
          <h2>Anonymity guarantee</h2>
          <p>
            Jooking guarantees the anonymity of people submitting reports. Personal identifying details
            are not displayed publicly and are not required for a report to contribute to the risk map.
          </p>
        </div>
      </section>
    </main>
  );
}
