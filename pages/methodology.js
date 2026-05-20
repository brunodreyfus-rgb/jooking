import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/jooking-pages.css';

export default function MethodologyPage() {
  return (
    <div className="jooking-page grey-bg">
      <Navbar />
      <main className="jooking-main narrow">
        <section className="hero-card">
          <p className="eyebrow">Methodology</p>
          <h1>How Jooking processes reports</h1>
          <p>
            Jooking collects incident reports, removes identifying information, groups similar signals,
            and converts verified patterns into risk indicators.
          </p>
        </section>
        <section className="content-card">
          <h2>Anonymity guarantee</h2>
          <p>
            Jooking guarantees the anonymity and confidentiality of people who submit reports. Personal
            information is not displayed publicly, and reports are used only as anonymized signals to help
            identify risk patterns.
          </p>
        </section>
        <section className="content-card">
          <h2>Signal validation</h2>
          <p>
            Reports are reviewed for consistency, duplicates and severity before contributing to public risk
            indicators or dashboard metrics.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
