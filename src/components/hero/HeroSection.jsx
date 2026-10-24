import { useEffect, useRef, useState } from 'react';
import TypingBadge from './TypingBadge';
import PhotoFrame from './PhotoFrame';
import Count from '../common/Count';
import TechBadge from '../common/TechBadge';
import { useDownloadAnalytics } from '../../hooks/useDownloadAnalytics';
import { useSiteSettings } from '../../hooks/useSiteSettings';

function StatCard({ value, label, countTo = null }) {
  return (
    <div className="flex flex-col items-center px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-cyber-card/60 border border-white/[0.08] hover:border-white/20 hover:bg-cyber-card transition-all duration-200 shadow-sm">
      <span className="text-xl sm:text-2xl font-black text-white">
        {countTo ? <Count to={countTo} /> : value}
      </span>
      <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  );
}

function SocialLink({ href, label, icon }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyber-card border border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white hover:bg-cyber-surface active:scale-95 transition-all duration-200 shadow-sm"
    >
      {icon}
    </a>
  );
}

export default function HeroSection() {
  const { settings } = useSiteSettings();
  const heroRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const { downloadCount, trackDownload, justDownloaded } = useDownloadAnalytics();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const coreSkills = (settings.hero_skills && settings.hero_skills.length > 0)
    ? settings.hero_skills
    : ['Python', 'C / C++', 'Flask', 'MongoDB', 'YOLO', 'LLaMA 3', 'Arduino', 'Gemini API', 'Streamlit', 'Git / GitHub'];


  const nameParts = (settings.name || 'Abdullah Adel').split(' ');
  const firstName = nameParts[0] || 'Abdullah';
  const lastName = nameParts.slice(1).join(' ') || 'Adel';

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-cyber-bg pt-24 pb-16 lg:py-28"
    >
      {/* Subtle architectural ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-25 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Column: Bio & Controls */}
          <div
            className={`flex-1 text-left space-y-6 transition-all duration-1000 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Status & Location Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-card border border-white/[0.08] text-xs sm:text-sm text-slate-300 shadow-sm">
                <span className={`w-2 h-2 rounded-full ${settings.is_available ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-slate-500'}`} />
                {settings.availability_status || 'Available for opportunities'}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyber-card border border-white/[0.08] text-xs sm:text-sm text-slate-400">
                <span>📍</span>
                {settings.location || 'Cairo, Egypt'}
              </div>
            </div>

            {/* Main Greeting & Name */}
            <div className="space-y-1">
              <p className="text-sky-400 font-mono text-xs sm:text-sm tracking-widest uppercase">
                &lt;{settings.tagline || 'intelligent systems & robotics'} /&gt;
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
                {firstName}{' '}
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {lastName}
                </span>
              </h1>
            </div>

            {/* Typewriter role */}
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 font-light flex items-center gap-2 flex-wrap">
              <span>I'm a</span>
              <TypingBadge roles={settings.roles} />
            </p>

            {/* Bio */}
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              {settings.bio}
            </p>

            {/* Quick credentials */}
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-400">
              <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="text-sky-400">✉️</span> {settings.email}
              </a>
              <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors" dir="ltr">
                <span className="text-sky-400">📞</span> {settings.phone}
              </a>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-sky-400">🎓</span> {settings.education?.university || 'Helwan National University'}
              </span>
            </div>

            {/* Core Skills Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {coreSkills.map(skill => (
                <TechBadge key={skill} name={skill} size="sm" />
              ))}
            </div>

            {/* Key Metrics Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {(settings.stats || []).map((s, idx) => (
                <StatCard
                  key={idx}
                  label={s.label}
                  value={s.value}
                  countTo={s.count}
                />
              ))}
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <a
                href="#projects"
                className="px-7 py-3 rounded-xl font-semibold text-sm tracking-wide bg-white text-zinc-950 hover:bg-slate-200 hover:shadow-lg hover:shadow-white/5 active:scale-95 transition-all duration-200"
              >
                Explore Projects 🚀
              </a>

              <a
                href={settings.resume_url || '/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackDownload}
                className={`relative px-7 py-3 rounded-xl font-semibold text-sm tracking-wide border transition-all duration-200 ${
                  justDownloaded
                    ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/10 bg-cyber-card/80 text-slate-200 hover:border-white/20 hover:bg-cyber-card hover:text-white'
                }`}
              >
                {justDownloaded ? 'Downloaded! 🎉' : 'Download CV 📄'}
                {downloadCount > 0 && (
                  <span className="absolute -top-2.5 -right-2 bg-cyber-bg border border-sky-400 text-sky-400 text-[10px] font-mono px-2 py-0.5 rounded-full shadow-md">
                    {downloadCount}
                  </span>
                )}
              </a>

              <a
                href="#contact"
                className="px-6 py-3 rounded-xl font-semibold text-sm tracking-wide border border-white/10 bg-cyber-card/40 text-slate-300 hover:border-white/20 hover:text-white active:scale-95 transition-all duration-200"
              >
                Contact Me ✉️
              </a>
            </div>

            {/* Socials Row */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-slate-500 font-mono">// connect:</span>
              <SocialLink
                href={settings.github_url}
                label="GitHub"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                }
              />
              <SocialLink
                href={settings.linkedin_url}
                label="LinkedIn"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                }
              />
              <SocialLink
                href={`mailto:${settings.email}`}
                label="Email"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              />
              {settings.whatsapp_url && (
                <SocialLink
                  href={settings.whatsapp_url}
                  label="WhatsApp"
                  icon={
                    <span className="text-xs font-mono font-bold">WA</span>
                  }
                />
              )}
            </div>
          </div>

          {/* Right Column: Holographic Photo Frame */}
          <div
            className={`flex-shrink-0 transition-all duration-1000 delay-200 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <PhotoFrame />
          </div>

        </div>
      </div>
    </section>
  );
}
