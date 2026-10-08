import { useEffect, useRef, useState } from 'react'
import { getTechIcon } from '../data/techIcons'

/* ── Skill groups data ──────────────────────────────────── */
const SKILL_GROUPS = [
  {
    category: 'Languages',
    accent: '#00d4ff',
    skills: ['Python', 'C / C++', 'JavaScript'],
  },
  {
    category: 'Backend & DB',
    accent: '#3b82f6',
    skills: ['Flask', 'MongoDB', 'SQLite', 'JWT'],
  },
  {
    category: 'AI & ML',
    accent: '#8b5cf6',
    skills: ['YOLO', 'LLaMA 3', 'NLLB-200', 'Gemini API', 'AI Agents', 'HuggingFace'],
  },
  {
    category: 'Embedded',
    accent: '#f97316',
    skills: ['Arduino', 'Circuit Design'],
  },
  {
    category: 'Dev Tools',
    accent: '#10b981',
    skills: ['Git / GitHub', 'Streamlit', 'Ollama'],
  },
]

const CERTIFICATIONS = [
  { icon: '🤖', title: 'Robotics with AI', issuer: 'Smart Technology · Engineers Syndicate' },
  { icon: '🇬🇧', title: 'English — Level B2', issuer: 'Upper-Intermediate (Actively Improving)' },
]

const LANGUAGES = [
  { flag: '🇸🇦', name: 'Arabic',  level: 'Native',           width: '100%', color: '#10b981' },
  { flag: '🇬🇧', name: 'English', level: 'B2 – Upper-Intermediate', width: '72%', color: '#3b82f6' },
  { flag: '🇯🇵', name: 'Japanese',level: 'Beginner',          width: '20%', color: '#8b5cf6' },
]

/* ── Glow Chip ──────────────────────────────────────────── */
function GlowChip({ name, accent }) {
  const icon = getTechIcon(name)
  return (
    <span
      className="
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
        bg-cyber-card border border-cyber-border text-slate-300
        hover:text-white hover:scale-105
        transition-all duration-300 cursor-default select-none
      "
      style={{ '--accent': accent }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent + '80'
        e.currentTarget.style.boxShadow  = `0 0 12px ${accent}30`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.boxShadow  = ''
      }}
    >
      {icon.src
        ? <img src={icon.src} alt={name} width={13} height={13} className={`shrink-0 ${icon.invert ? 'brightness-0 invert' : ''}`} loading="lazy" />
        : <span className="text-[11px]">{icon.emoji}</span>
      }
      {name}
    </span>
  )
}

/* ── Skill group card ───────────────────────────────────── */
function SkillGroup({ category, accent, skills }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
        <span className="text-xs font-mono tracking-widest uppercase" style={{ color: accent }}>
          {category}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => <GlowChip key={s} name={s} accent={accent} />)}
      </div>
    </div>
  )
}

/* ── Language bar ───────────────────────────────────────── */
function LanguageBar({ flag, name, level, width, color }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-slate-300">
          <span>{flag}</span> {name}
        </span>
        <span className="text-xs text-slate-500 font-mono">{level}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-cyber-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width, background: `linear-gradient(90deg, ${color}, ${color}80)`, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   MAIN SECTION
   ════════════════════════════════════════════════════════ */
export default function TrustSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.08 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 bg-cyber-surface overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">

        {/* ── Header ── */}
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-cyber-cyan font-mono text-sm tracking-widest uppercase mb-3">// credentials & arsenal</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Tech{' '}
            <span className="bg-gradient-to-r from-cyber-cyan to-cyber-blue bg-clip-text text-transparent">Arsenal</span>
            {' '}& Trust
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">Skills I use daily, academic background, and verifiable credentials.</p>
        </div>

        {/* ── Skills grid ── */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16 transition-all duration-1000 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {SKILL_GROUPS.map((g) => <SkillGroup key={g.category} {...g} />)}
        </div>

        {/* ── Credentials row ── */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* University card */}
          <div className="md:col-span-1 rounded-2xl bg-cyber-card border border-cyber-border p-6 flex flex-col gap-4 hover:border-cyber-cyan/30 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/20 border border-cyber-cyan/30 flex items-center justify-center text-2xl shrink-0">
                🎓
              </div>
              <div>
                <p className="text-white font-bold text-sm">Helwan National University</p>
                <p className="text-cyber-cyan text-xs font-mono">Cairo, Egypt</p>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <p className="text-slate-300 font-medium">B.Sc. Mechatronics Engineering</p>
              <p className="text-slate-500 text-xs">Freshman · 1st Year · Class of 2030</p>
              <p className="text-slate-500 text-xs">Robotics with AI · Circuit Analysis · Digital Logic</p>
            </div>
            <div className="mt-auto pt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">Currently Enrolled</span>
            </div>
          </div>

          {/* Certifications */}
          <div className="rounded-2xl bg-cyber-card border border-cyber-border p-6 flex flex-col gap-4 hover:border-cyber-cyan/30 transition-colors duration-300">
            <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">Certifications</p>
            <div className="flex flex-col gap-4">
              {CERTIFICATIONS.map((c) => (
                <div key={c.title} className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{c.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{c.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{c.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-3 border-t border-cyber-border">
              <p className="text-xs text-slate-500 font-mono">High School Grade: <span className="text-emerald-400 font-bold">87% — High</span></p>
            </div>
          </div>

          {/* Languages */}
          <div className="rounded-2xl bg-cyber-card border border-cyber-border p-6 flex flex-col gap-5 hover:border-cyber-cyan/30 transition-colors duration-300">
            <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">Languages</p>
            <div className="flex flex-col gap-4">
              {LANGUAGES.map((l) => (
                <LanguageBar key={l.name} {...l} />
              ))}
            </div>
            <div className="mt-auto pt-3 border-t border-cyber-border">
              <p className="text-xs text-slate-500">🇯🇵 Japanese — actively self-studying</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
