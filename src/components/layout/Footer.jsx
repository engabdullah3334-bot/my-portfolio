import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.08] bg-cyber-bg py-10 text-xs text-slate-400 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-200">
            &copy; {currentYear} {settings.name || 'Abdullah Adel'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-400">
            {settings.footer_tagline || 'Mechatronics & AI Engineering'}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {settings.github_url && (
            <a
              href={settings.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          )}
          {settings.linkedin_url && (
            <a
              href={settings.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          )}
          <a href="#home" className="hover:text-white transition-colors">
            Back to Top &uarr;
          </a>
          <span className="text-slate-600">|</span>
          <Link
            to="/admin_add/login"
            className="text-slate-600 hover:text-slate-400 transition-colors font-mono"
            title="System Portal"
          >
            Portal
          </Link>
        </div>

      </div>
    </footer>
  );
}
