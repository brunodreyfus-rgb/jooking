import Link from 'next/link';
import JookingLogo from './JookingLogo';

const links = [
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
      <Link href="/" className="jooking-brand-link" aria-label="Go to Jooking home">
        <JookingLogo />
      </Link>
      <nav className="jooking-nav" aria-label="Main navigation">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="jooking-nav-link">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
