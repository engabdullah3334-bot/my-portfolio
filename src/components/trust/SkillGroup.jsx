import React from 'react';
import TechBadge from '../common/TechBadge';

export default function SkillGroup({ category, accent = '#38bdf8', skills = [] }) {
  return (
    <div className="flex flex-col gap-3.5 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: accent }}
        />
        <span
          className="text-xs font-mono font-semibold tracking-wider uppercase"
          style={{ color: accent }}
        >
          {category}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <TechBadge key={skill} name={skill} size="sm" />
        ))}
      </div>
    </div>
  );
}
