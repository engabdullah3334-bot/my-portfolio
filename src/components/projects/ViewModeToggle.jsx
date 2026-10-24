import React from 'react';

export default function ViewModeToggle({ mode, onChange }) {
  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900/80 border border-white/[0.08] shadow-sm">
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          mode === 'grid'
            ? 'bg-white text-zinc-950 shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Grid</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('carousel')}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          mode === 'carousel'
            ? 'bg-white text-zinc-950 shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
        </svg>
        <span>Showcase Carousel</span>
      </button>
    </div>
  );
}
