import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/jooking-pages.css';

export default function SearchPage() {
  return (
    <div className="jooking-page grey-bg">
      <Navbar />
      <main className="jooking-main narrow">
        <section className="hero-card">
          <p className="eyebrow">Search</p>
          <h1>Search incident reports and risk signals</h1>
          <p>
            Search will help users explore anonymized reports, destinations, providers and risk patterns.
            This page is now routed correctly instead of redirecting to the home page.
          </p>
          <div className="search-shell">
            <input aria-label="Search reports" placeholder="Search by country, city, supplier, risk type..." />
            <button type="button">Search</button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
