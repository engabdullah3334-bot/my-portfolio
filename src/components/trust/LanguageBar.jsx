import React from 'react';

export default function LanguageBar({ flag, name, level, width, color = '#00d4ff' }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="flex items-center gap-2 text-slate-200 font-medium">
          <span className="text-base">{flag}</span> {name}
        </span>
        <span className="text-xs text-slate-400 font-mono">{level}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-cyber-bg border border-cyber-border/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width,
            background: `linear-gradient(90deg, ${color}, ${color}90)`,
            boxShadow: `0 0 10px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}
