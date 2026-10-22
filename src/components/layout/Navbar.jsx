import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Navbar() {
  const { settings } = useSiteSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { id: 'home',     label: settings.nav_overview_label || 'Overview' },
    { id: 'skills',   label: settings.nav_skills_label   || 'Arsenal' },
    { id: 'projects', label: settings.nav_projects_label || 'Projects' },
    { id: 'contact',  label: settings.nav_contact_label  || 'Contact' },
  ];
  const activeSection = useActiveSection(navLinks.map(n => n.id));

  const nameParts = (settings.name || 'Abdullah Adel').split(' ');
  const firstName = nameParts[0] || 'Abdullah';
  const lastName = nameParts.slice(1).join(' ') || 'Adel';

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-cyber-bg/85 backdrop-blur-md border-b border-cyber-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-white hover:text-cyber-cyan transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-blue flex items-center justify-center text-cyber-bg font-black text-sm shadow-[0_0_12px_rgba(0,212,255,0.4)]">
            {firstName.charAt(0)}{lastName.charAt(0)}
          </span>
          <span className="text-base sm:text-lg font-black tracking-wider uppercase">
            {firstName} <span className="text-cyber-cyan font-mono text-sm">.{lastName}</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-cyber-card/60 p-1 rounded-xl border border-cyber-border/70">
          {navLinks.map(link => {
            const href = isHomePage ? `#${link.id}` : `/#${link.id}`;
            const isActive = isHomePage && activeSection === link.id;
            return (
              <a
                key={link.id}
                href={href}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-cyber-surface text-cyber-cyan border border-cyber-cyan/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-cyber-surface/50'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Button & Mobile Burger */}
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${settings.email || 'engabdullah3334@gmail.com'}`}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg hover:opacity-95 hover:shadow-[0_0_16px_rgba(0,212,255,0.35)] transition-all"
          >
            {settings.nav_cta_label || 'Get In Touch'}
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-cyber-card border border-cyber-border text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyber-border bg-cyber-bg/95 backdrop-blur-xl px-6 py-5 space-y-3">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={isHomePage ? `#${link.id}` : `/#${link.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-cyber-cyan hover:bg-cyber-card transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${settings.email || 'engabdullah3334@gmail.com'}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center py-2.5 rounded-xl text-sm font-semibold bg-cyber-cyan text-cyber-bg mt-2"
          >
            {settings.nav_cta_label || 'Get In Touch'} ({settings.email || 'engabdullah3334@gmail.com'})
          </a>
        </div>
      )}
    </header>
  );
}
