import React from 'react';
import { Link } from 'react-router-dom';
import TechBadge from '../common/TechBadge';

export const CATEGORY_META = {
  fullstack: {
    label: 'Full-Stack Web',
    icon: '🌐',
    bar: 'from-cyan-500 to-blue-600',
    badge: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
  },
  aipipeline: {
    label: 'AI Pipeline',
    icon: '🤖',
    bar: 'from-purple-500 to-pink-600',
    badge: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
  },
  desktop: {
    label: 'Desktop App',
    icon: '💻',
    bar: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
  },
  embedded: {
    label: 'Embedded & Hardware',
    icon: '🦾',
    bar: 'from-orange-500 to-red-600',
    badge: 'bg-orange-500/15 border-orange-500/40 text-orange-300',
  },
  soon: {
    label: 'In Development',
    icon: '⚡',
    bar: 'from-slate-500 to-slate-600',
    badge: 'bg-slate-500/15 border-slate-500/40 text-slate-300',
  },
};

const STATUS_STYLES = {
  Active: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
  Published: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
  Complete: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
  'In Progress': 'bg-amber-500/15 border-amber-500/40 text-amber-300',
};

const STATUS_DOT = {
  Active: 'bg-emerald-400 animate-pulse',
  Published: 'bg-blue-400',
  Complete: 'bg-purple-400',
  'In Progress': 'bg-amber-400 animate-pulse',
};

export default function FeaturedCard({ project, index = 0 }) {
  const cat = CATEGORY_META[project.category] ?? CATEGORY_META.soon;
  const projectLink = `/projects/${project.slug || project.id}`;

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-cyber-card/75 border border-cyber-border hover:border-cyber-cyan/50 hover:shadow-[0_0_40px_rgba(0,212,255,0.08)] transition-all duration-300">
      {/* Top category gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${cat.bar}`} />

      <div className="flex flex-col flex-1 p-6 sm:p-7 gap-5">
        
        {/* Header: Rank + Title + Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {project.rank != null && (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/20 border border-cyber-cyan/40 text-cyber-cyan shadow-sm">
                #{project.rank}
              </div>
            )}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyber-cyan transition-colors leading-tight">
                <Link to={projectLink}>{project.title}</Link>
              </h3>
              {project.subtitle && (
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{project.subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border font-medium ${STATUS_STYLES[project.status] ?? STATUS_STYLES.Complete}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status] ?? 'bg-slate-400'}`} />
              {project.status || 'Active'}
            </span>
            <span className="text-xs text-slate-400 font-mono">{project.year}</span>
          </div>
        </div>

        {/* Category Pill */}
        <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border font-medium ${cat.badge}`}>
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </span>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Architecture Highlights */}
        {project.highlights?.length > 0 && (
          <ul className="space-y-2 py-1">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                <span className="text-cyber-cyan font-bold shrink-0 mt-0.5">▸</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex-1" />

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-cyber-border/70">
          {(project.tech || []).map(t => (
            <TechBadge key={t} name={t} size="sm" />
          ))}
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {/* Deep Dive Case Study */}
          <Link
            to={projectLink}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-cyber-surface border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-glow hover:border-cyber-cyan transition-all"
          >
            <span>Case Study</span>
            <span>&rarr;</span>
          </Link>

          {/* GitHub Code */}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium bg-cyber-surface border border-cyber-border text-slate-300 hover:border-cyber-cyan hover:text-white transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Code</span>
            </a>
          )}

          {/* Live Demo */}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg hover:opacity-90 hover:shadow-[0_0_16px_rgba(0,212,255,0.35)] transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Demo</span>
            </a>
          )}

          {/* Tech Sheet PDF */}
          {project.tech_sheet_url && (
            <a
              href={project.tech_sheet_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-medium border border-cyber-border text-slate-300 hover:border-cyber-purple hover:text-purple-300 transition-all"
            >
              📄 <span>Sheet</span>
            </a>
          )}

          {/* Dynamic Custom Links from Admin */}
          {(project.custom_links || []).map((lnk, idx) => (
            <a
              key={idx}
              href={lnk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-medium border border-cyber-cyan/30 bg-cyber-card/70 text-slate-200 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
            >
              <span>🔗</span>
              <span>{lnk.label}</span>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
