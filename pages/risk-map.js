import Navbar from '../components/Navbar';
import WorldRiskMap from '../components/WorldRiskMap';
import '../styles/jooking-pages.css';

export default function RiskMapPage() {
  return (
    <main className="jooking-page grey-bg">
      <Navbar />
      <section className="jooking-container">
        <p className="eyebrow">Risk Map</p>
        <h1>Live dashboard</h1>
        <p className="page-intro">
          Explore anonymous reported events by geography and risk level. Northern regions remain visible
          and the map uses the same point projection as the Home page.
        </p>
        <WorldRiskMap title="Live dashboard" />
      </section>
    </main>
  );
}
