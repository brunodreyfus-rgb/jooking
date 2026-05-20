import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/risks', label: 'Risks' },
  { href: '/risk-map', label: 'Risk Map' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/report-incident', label: 'Report Incident' },
];

export default function Navbar() {
  return (
    <header className="jooking-header">
      <Link href="/" className="jooking-brand" aria-label="Jooking home">
        <span className="jooking-logo-mark">J</span>
        <span>Jooking</span>
      </Link>
      <nav className="jooking-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="jooking-nav-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
