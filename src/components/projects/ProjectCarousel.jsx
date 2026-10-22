import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TechBadge from '../common/TechBadge';
import { CATEGORY_META } from './FeaturedCard';
import { imageUrl } from '../../lib/supabase';
import { reduceMotion } from '../../lib/utils';

export default function ProjectCarousel({ projects = [] }) {
  const n = projects.length;
  const multi = n > 1;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const x0 = useRef(null);

  const go = d => setIdx(i => (i + d + n) % n);

  // Auto advance timer every 10s if not paused and not reduced motion
  useEffect(() => {
    if (!multi || paused || reduceMotion()) return;
    const interval = setInterval(() => {
      setIdx(i => (i + 1) % n);
    }, 10000);
    return () => clearInterval(interval);
  }, [multi, paused, n]);

  if (!projects.length) return null;

  const current = projects[idx];
  const cat = CATEGORY_META[current.category] ?? CATEGORY_META.soon;
  const projectLink = `/projects/${current.slug || current.id}`;

  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-cyber-card/80 border border-cyber-border shadow-2xl p-6 sm:p-10 transition-all"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={e => { x0.current = e.clientX; }}
      onPointerUp={e => {
        if (x0.current == null || !multi) return;
        const dx = e.clientX - x0.current;
        x0.current = null;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* Top category bar */}
      <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${cat.bar}`} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Media / Visual representation */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-cyber-surface border border-cyber-border/80 min-h-[260px] sm:min-h-[320px] flex items-center justify-center group">
          {current.image_path ? (
            <img
              src={imageUrl(current.image_path)}
              alt={current.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
              <span className="text-5xl">{cat.icon}</span>
              <p className="text-cyber-cyan font-mono text-sm tracking-widest uppercase">
                {current.category}
              </p>
              <div className="w-16 h-1 rounded-full bg-cyber-cyan/30" />
            </div>
          )}
          {current.rank != null && (
            <div className="absolute top-4 left-4 bg-cyber-bg/90 border border-cyber-cyan/50 text-cyber-cyan font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md">
              Rank #{current.rank}
            </div>
          )}
        </div>

        {/* Right Side: Details & Highlights */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border font-medium ${cat.badge}`}>
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-cyber-border bg-cyber-surface text-emerald-400 font-medium">
                  {current.status || 'Active'}
                </span>
                <span className="text-xs text-slate-400 font-mono">{current.year}</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white hover:text-cyber-cyan transition-colors">
              <Link to={projectLink}>{current.title}</Link>
            </h3>

            {current.subtitle && (
              <p className="text-cyber-cyan font-mono text-xs sm:text-sm">
                {current.subtitle}
              </p>
            )}

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Highlights */}
          {current.highlights?.length > 0 && (
            <ul className="space-y-1.5">
              {current.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <span className="text-cyber-cyan font-bold mt-0.5">▸</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            {(current.tech || []).map(t => (
              <TechBadge key={t} name={t} size="sm" />
            ))}
          </div>

          {/* Navigation Controls & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-cyber-border/70">
            <div className="flex items-center gap-3">
              <Link
                to={projectLink}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg hover:opacity-95 hover:shadow-[0_0_16px_rgba(0,212,255,0.35)] transition-all"
              >
                Case Study &rarr;
              </Link>
              {current.demo_url && (
                <a
                  href={current.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-glow transition-all"
                >
                  Live Demo
                </a>
              )}
              {current.github_url && (
                <a
                  href={current.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-cyber-border text-slate-300 hover:border-cyber-cyan hover:text-white transition-all"
                >
                  Code
                </a>
              )}
              {(current.custom_links || []).map((lnk, idx) => (
                <a
                  key={idx}
                  href={lnk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-cyber-cyan/30 text-slate-200 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                >
                  {lnk.label}
                </a>
              ))}
            </div>

            {/* Stepper Dots & Chevrons */}
            {multi && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyber-surface border border-cyber-border text-slate-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                  aria-label="Previous Project"
                >
                  &#8592;
                </button>

                <div className="flex items-center gap-2">
                  {projects.map((p, i) => (
                    <button
                      key={p.id || i}
                      type="button"
                      onClick={() => setIdx(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === idx ? 'w-8 bg-cyber-cyan shadow-[0_0_8px_#00d4ff]' : 'w-2 bg-cyber-border hover:bg-slate-500'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => go(1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyber-surface border border-cyber-border text-slate-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                  aria-label="Next Project"
                >
                  &#8594;
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
