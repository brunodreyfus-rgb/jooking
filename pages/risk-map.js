import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WorldRiskMap from '../components/WorldRiskMap';
import '../styles/jooking-pages.css';

export default function RiskMapPage() {
  return (
    <div className="jooking-page grey-bg">
      <Navbar />
      <main className="jooking-main wide">
        <section className="hero-card">
          <p className="eyebrow">Live dashboard</p>
          <h1>Global Risk Map</h1>
          <p>
            Monitor anonymized incident signals around the world. The map keeps northern regions visible
            and uses a responsive SVG layout so markers stay aligned with the visual map.
          </p>
        </section>
        <WorldRiskMap />
      </main>
      <Footer />
    </div>
  );
}
