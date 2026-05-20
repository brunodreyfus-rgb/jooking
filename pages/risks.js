import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/jooking-pages.css';

const risks = [
  'Booking fraud or suspicious payment behavior',
  'Unsafe accommodation or destination conditions',
  'Repeated supplier cancellation patterns',
  'Guest harassment, threats or abuse',
  'Operational failures impacting traveler safety',
];

export default function RisksPage() {
  return (
    <div className="jooking-page grey-bg">
      <Navbar />
      <main className="jooking-main narrow">
        <section className="hero-card">
          <p className="eyebrow">Risks</p>
          <h1>Risk categories tracked by Jooking</h1>
          <p>
            This page explains the main risk categories monitored by the platform and is now connected
            to the navigation menu instead of sending users back to Home.
          </p>
          <ul className="risk-list">
            {risks.map((risk) => <li key={risk}>{risk}</li>)}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
