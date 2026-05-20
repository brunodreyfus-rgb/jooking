import Navbar from '../components/Navbar';
import '../styles/jooking-pages.css';

const risks = [
  'Accommodation cancellation or refusal',
  'Unsafe host or guest behavior',
  'Discrimination or harassment',
  'Payment or refund dispute',
  'Misleading listing information',
];

export default function RisksPage() {
  return (
    <main className="jooking-page grey-bg">
      <Navbar />
      <section className="jooking-container">
        <div className="jooking-card">
          <p className="eyebrow">Risks</p>
          <h1>Risk categories</h1>
          <p>
            This page explains the main risk families tracked by Jooking and gives users a clear
            entry point before consulting the live risk map.
          </p>
          <ul className="risk-list">
            {risks.map((risk) => <li key={risk}>{risk}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}
