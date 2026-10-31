import React from 'react';
import { Link } from 'react-router-dom';
import TechBadge from '../common/TechBadge';
import { CATEGORY_META } from './FeaturedCard';

export default function CompactCard({ project, index = 0 }) {
  const cat = CATEGORY_META[project.category] ?? CATEGORY_META.soon;
  const isComingSoon = project.category === 'soon' && !project.github_url && !project.demo_url && !project.details;
  const projectLink = `/projects/${project.slug || project.id}`;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-cyber-card/60 border transition-all duration-300 ${
        isComingSoon
          ? 'border-dashed border-white/10 opacity-75'
          : 'border-white/[0.08] hover:border-white/20 hover:shadow-xl'
      }`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${cat.bar}`} />

      <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-2xl">{cat.icon}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-cyber-surface text-slate-300 font-medium">
              {project.status || 'Active'}
            </span>
            <span className="text-xs text-slate-400 font-mono">{project.year}</span>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
            <Link to={projectLink}>{project.title}</Link>
          </h4>
          {project.subtitle && (
            <p className="text-slate-400 text-xs mt-0.5">{project.subtitle}</p>
          )}
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {(project.tech || []).map(t => (
            <TechBadge key={t} name={t} size="sm" />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
          <Link
            to={projectLink}
            className="text-xs font-semibold text-sky-400 hover:text-white hover:underline inline-flex items-center gap-1"
          >
            <span>View Case Study</span>
            <span>&rarr;</span>
          </Link>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-slate-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-400 hover:text-white font-medium transition-colors"
            >
              Live Demo
            </a>
          )}
          {(project.custom_links || []).map((lnk, idx) => (
            <a
              key={idx}
              href={lnk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-300 hover:text-white font-medium transition-colors"
            >
              {lnk.label}
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
