import Navbar from '../components/Navbar';
import '../styles/jooking-pages.css';

export default function SearchPage() {
  return (
    <main className="jooking-page grey-bg">
      <Navbar />
      <section className="jooking-container">
        <div className="jooking-card">
          <p className="eyebrow">Search</p>
          <h1>Search incident reports</h1>
          <p>
            Search is dedicated to finding anonymous reports by country, city, category, risk level,
            or keyword. This page no longer redirects to Home.
          </p>
          <div className="search-placeholder">
            <input aria-label="Search reports" placeholder="Search by city, country, risk or keyword" />
            <button type="button">Search</button>
          </div>
        </div>
      </section>
    </main>
  );
}
