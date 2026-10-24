import React from 'react';
import profileImg from '../../assets/profile.png';

/**
 * Clean, architectural portrait frame:
 * Refined neutral obsidian container with hairline glass border,
 * soft ambient backlight, and minimalist identity pill.
 */
export default function PhotoFrame() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 select-none group">
      {/* Soft ambient backlight */}
      <div className="absolute -inset-2 rounded-[2.2rem] bg-gradient-to-b from-white/[0.08] via-sky-500/[0.04] to-transparent blur-xl pointer-events-none" />

      {/* Outer precision frame with hairline gradient border */}
      <div className="relative w-full h-full rounded-[2rem] p-1.5 bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-white/[0.02] border border-white/[0.08] shadow-2xl">
        
        {/* Main image container */}
        <div className="relative w-full h-full rounded-[1.65rem] overflow-hidden bg-cyber-surface">
          <img
            src={profileImg}
            alt="Abdullah Adel — Mechatronics & AI Engineer"
            className="w-full h-full object-cover object-center filter contrast-[1.02] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          />

          {/* Elegant bottom identity vignette */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-10 z-10 flex flex-col justify-end">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-white font-bold text-sm tracking-wide">Abdullah Adel</p>
            </div>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Mechatronics · AI · Robotics</p>
          </div>
        </div>
      </div>

      {/* Minimalist Floating Engineering Pill */}
      <div className="absolute -top-3 -right-2 bg-cyber-card/95 border border-white/10 backdrop-blur-md rounded-full px-3.5 py-1 text-[11px] font-mono text-slate-200 shadow-lg whitespace-nowrap z-20 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
        <span>Mechatronics &amp; AI</span>
      </div>
    </div>
  );
}
