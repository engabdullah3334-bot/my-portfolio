import React from 'react';
import profileImg from '../../assets/profile.png';

/**
 * Cyberpunk photo frame with orbital rotation rings, corner brackets,
 * animated glow, scanlines overlay, and holographic floating badges.
 */
export default function PhotoFrame() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 animate-float select-none">
      {/* Outer rotating cyber rings */}
      <div className="absolute -inset-4 rounded-full border border-cyber-cyan/20 animate-spin-slow pointer-events-none" />
      <div
        className="absolute -inset-8 rounded-full border border-cyber-blue/15 animate-spin-slow pointer-events-none"
        style={{ animationDirection: 'reverse', animationDuration: '24s' }}
      />

      {/* Cyberpunk corner bracket accents */}
      <div className="absolute -top-2.5 -left-2.5 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan rounded-tl-lg pointer-events-none z-20" />
      <div className="absolute -top-2.5 -right-2.5 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan rounded-tr-lg pointer-events-none z-20" />
      <div className="absolute -bottom-2.5 -left-2.5 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan rounded-bl-lg pointer-events-none z-20" />
      <div className="absolute -bottom-2.5 -right-2.5 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan rounded-br-lg pointer-events-none z-20" />

      {/* Neon border glow ring */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyber-cyan/20 via-cyber-blue/15 to-cyber-purple/20 animate-border-glow pointer-events-none" />

      {/* Main photo container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-cyber-cyan/35 shadow-[0_0_50px_rgba(0,212,255,0.22)] bg-cyber-surface">
        <img
          src={profileImg}
          alt="Abdullah Adel — Mechatronics & AI Engineer"
          className="w-full h-full object-cover object-center filter contrast-105"
        />

        {/* Scanline CRT overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-15 scanlines-overlay" />

        {/* Bottom identity tag */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-cyber-bg via-cyber-bg/75 to-transparent py-4 px-5 z-10">
          <p className="text-white font-bold text-sm tracking-wide">Abdullah Adel</p>
          <p className="text-cyber-cyan font-mono text-xs tracking-wider">Mechatronics · AI · Robotics</p>
        </div>
      </div>

      {/* Floating holographic badges */}
      <div className="absolute -top-3.5 -right-4 bg-cyber-card/95 border border-cyber-cyan/50 backdrop-blur-md rounded-xl px-3.5 py-1.5 text-xs font-mono text-cyber-cyan shadow-[0_0_20px_rgba(0,212,255,0.25)] whitespace-nowrap z-20">
        &lt;AI Engineer /&gt;
      </div>
      <div className="absolute -bottom-3.5 -left-4 bg-cyber-card/95 border border-cyber-purple/50 backdrop-blur-md rounded-xl px-3.5 py-1.5 text-xs font-mono text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.25)] whitespace-nowrap z-20">
        &#123; Python · C++ · Robotics &#125;
      </div>
    </div>
  );
}
