import React from 'react';
import TechBadge from '../common/TechBadge';

export default function SkillGroup({ category, accent = '#00d4ff', skills = [] }) {
  return (
    <div className="flex flex-col gap-3.5 p-5 rounded-2xl bg-cyber-card/50 border border-cyber-border hover:border-cyber-cyan/40 transition-all duration-300 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
        <span
          className="text-xs font-mono font-bold tracking-widest uppercase"
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
