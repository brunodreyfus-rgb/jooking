import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/risks', label: 'Risks' },
  { href: '/risk-map', label: 'Risk Map' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/report-incident', label: 'Report Incident' },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <img src="/logo-jooking.svg" alt="Jooking" className="h-8 w-auto" />
            <span>Jooking</span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-black text-neutral-600">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-white border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-neutral-500">
          <div className="flex items-center gap-3">
            <img src="/logo-jooking.svg" alt="Jooking" className="h-7 w-auto" />
            <span>© {new Date().getFullYear()} Jooking. Anonymous reporting for safer travel.</span>
          </div>
          <span>Live dashboard</span>
        </div>
      </footer>
    </div>
  );
}
