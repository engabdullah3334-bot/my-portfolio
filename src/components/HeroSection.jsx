import { useEffect, useRef, useState } from 'react'
import profileImg from '../assets/profile.png'
import { useDownloadAnalytics } from '../hooks/useDownloadAnalytics'

/* ── Floating particle dots ───────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 6 + 4,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-cyber-cyan opacity-20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Animated typing badge ────────────────────────────── */
const ROLES = [
  'Mechatronics Eng. Student',
  'AI & ML Engineer',
  'Backend Developer',
  'Embedded Systems Dev',
  'Full-Stack Builder',
]

function TypingBadge() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    const current = ROLES[roleIdx]
    let timeout

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx + 1))
        setCharIdx((c) => c + 1)
      }, 65)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx - 1))
        setCharIdx((c) => c - 1)
      }, 35)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setRoleIdx((r) => (r + 1) % ROLES.length)
    }

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, roleIdx])

  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-cyber-cyan font-mono font-medium">{displayed}</span>
      <span className="inline-block w-0.5 h-5 bg-cyber-cyan animate-blink" />
    </span>
  )
}

/* ── Skill chip ───────────────────────────────────────── */
function SkillChip({ label, icon }) {
  return (
    <span className="
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
      bg-cyber-card border border-cyber-border text-slate-300
      hover:border-cyber-cyan hover:text-cyber-cyan hover:bg-cyber-glow
      transition-all duration-300 cursor-default select-none
    ">
      <span>{icon}</span>
      {label}
    </span>
  )
}

/* ── Stat card ────────────────────────────────────────── */
function StatCard({ value, label }) {
  return (
    <div className="
      flex flex-col items-center px-5 py-3.5 rounded-xl
      bg-cyber-card border border-cyber-border
      hover:border-cyber-cyan/40 transition-all duration-300
    ">
      <span className="text-2xl font-bold text-cyber-cyan">{value}</span>
      <span className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  )
}

/* ── Social link ──────────────────────────────────────── */
function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        w-10 h-10 rounded-full flex items-center justify-center
        bg-cyber-card border border-cyber-border text-slate-400
        hover:border-cyber-cyan hover:text-cyber-cyan hover:bg-cyber-glow
        hover:scale-110 transition-all duration-300
      "
    >
      {icon}
    </a>
  )
}

/* ── Info pill ────────────────────────────────────────── */
function InfoPill({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
      <span className="text-cyber-cyan">{icon}</span>
      {text}
    </span>
  )
}

/* ══ MAIN COMPONENT ═══════════════════════════════════════ */
export default function HeroSection() {
  const heroRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const { downloadCount, trackDownload, justDownloaded } = useDownloadAnalytics()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 },
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  const skills = [
    { label: 'Python',          icon: '🐍' },
    { label: 'C / C++',         icon: '⚙️'  },
    { label: 'Flask',           icon: '🌐' },
    { label: 'MongoDB',         icon: '🍃' },
    { label: 'YOLO',            icon: '👁️'  },
    { label: 'LLaMA 3',         icon: '🦙' },
    { label: 'Arduino',         icon: '🔌' },
    { label: 'Gemini API',      icon: '✨' },
    { label: 'Streamlit',       icon: '📊' },
    { label: 'Git / GitHub',    icon: '🐙' },
  ]

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-cyber-bg"
    >
      {/* ── Background grid ── */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Radial glow blobs ── */}
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-cyber-blue/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-cyber-purple/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyber-cyan/5 blur-3xl pointer-events-none" />

      <Particles />

      {/* ── Content wrapper ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-20">

          {/* ════════════ LEFT — Bio ════════════ */}
          <div
            className={`flex-1 text-left space-y-7 transition-all duration-1000 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            {/* Status + location */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-card border border-cyber-border text-sm text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                Available for opportunities
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-card border border-cyber-border text-sm text-slate-400">
                <span>📍</span>
                Cairo, Egypt
              </div>
            </div>

            {/* Greeting + name */}
            <div className="space-y-2">
              <p className="text-cyber-cyan font-mono text-sm tracking-widest uppercase">
                &lt;hello world /&gt;
              </p>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-tight">
                Abdullah
                <br />
                <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                  Adel
                </span>
              </h1>
            </div>

            {/* Typewriter role */}
            <p className="text-xl lg:text-2xl text-slate-400 font-light">
              I'm a <TypingBadge />
            </p>

            {/* Bio — from CV objective */}
            <p className="text-slate-400 text-base lg:text-lg leading-relaxed max-w-xl">
              Ambitious{' '}
              <span className="text-cyber-cyan font-medium">Mechatronics Engineering</span> student
              with hands-on experience building{' '}
              <span className="text-cyber-cyan font-medium">full-stack applications</span>,{' '}
              AI-powered systems, and embedded hardware projects. Passionate about bridging
              intelligent software with the physical world — one system at a time.
            </p>

            {/* Contact info row */}
            <div className="flex flex-wrap gap-5">
              <InfoPill icon="✉️" text="engabdullah3334@gmail.com" />
              <InfoPill icon="📞" text="01014860948" />
              <InfoPill icon="🎓" text="Helwan National University · Class of 2030" />
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <SkillChip key={s.label} {...s} />
              ))}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3">
              <StatCard value="10+"  label="Projects Built" />
              <StatCard value="4+"   label="AI Systems" />
              <StatCard value="3+"   label="Years Coding" />
              <StatCard value="B2"   label="English Level" />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 pt-1">
              <a
                id="hero-cta-projects"
                href="#projects"
                className="
                  px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide
                  bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg
                  hover:opacity-90 hover:scale-105 hover:shadow-[0_0_24px_rgba(0,212,255,0.4)]
                  active:scale-95 transition-all duration-300
                "
              >
                View Projects 🚀
              </a>
              <a
                id="hero-cta-resume"
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackDownload}
                className={`
                  relative overflow-hidden px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide
                  bg-transparent border border-cyber-cyan text-cyber-cyan
                  hover:bg-cyber-glow hover:scale-105 hover:shadow-[0_0_24px_rgba(0,212,255,0.2)]
                  active:scale-95 transition-all duration-300
                  ${justDownloaded ? 'border-emerald-400 text-emerald-400' : ''}
                `}
              >
                {justDownloaded ? 'Downloaded! 🎉' : 'Download CV 📄'}
                {downloadCount > 0 && !justDownloaded && (
                  <span className="absolute -top-2 -right-2 bg-cyber-bg border border-cyber-cyan text-cyber-cyan text-[10px] font-mono px-1.5 py-0.5 rounded-full">
                    {downloadCount}
                  </span>
                )}
              </a>
              <a
                id="hero-cta-contact"
                href="mailto:engabdullah3334@gmail.com"
                className="
                  px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide
                  bg-transparent border border-slate-600 text-slate-400
                  hover:border-slate-400 hover:text-white hover:scale-105
                  active:scale-95 transition-all duration-300
                "
              >
                Contact Me ✉️
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-slate-500 font-mono">// find me on</span>
              <SocialLink
                href="https://github.com/abdullahadel"
                label="GitHub"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://linkedin.com/in/abdullahadel"
                label="LinkedIn"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                }
              />
              <SocialLink
                href="mailto:engabdullah3334@gmail.com"
                label="Email"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* ════════════ RIGHT — Photo ════════════ */}
          <div
            className={`flex-shrink-0 transition-all duration-1000 delay-300 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative w-72 h-72 lg:w-96 lg:h-96 animate-float">
              {/* Outer rotating rings */}
              <div className="absolute -inset-4 rounded-full border border-cyber-cyan/20 animate-spin-slow" />
              <div
                className="absolute -inset-8 rounded-full border border-cyber-blue/10 animate-spin-slow"
                style={{ animationDirection: 'reverse', animationDuration: '20s' }}
              />

              {/* Corner accent lines */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan rounded-br-lg" />

              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 animate-border-glow" />

              {/* Photo frame */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-cyber-cyan/30 shadow-[0_0_40px_rgba(0,212,255,0.2)]">
                <img
                  src={profileImg}
                  alt="Abdullah Adel — Mechatronics & AI Engineer"
                  className="w-full h-full object-cover"
                />
                {/* Scanline overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.15) 2px, rgba(0,212,255,0.15) 4px)',
                  }}
                />
                {/* Bottom info strip */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-cyber-bg/90 via-cyber-bg/50 to-transparent py-4 px-4">
                  <p className="text-white font-bold text-sm">Abdullah Adel</p>
                  <p className="text-cyber-cyan font-mono text-xs">Mechatronics · AI · Robotics</p>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 bg-cyber-card border border-cyber-cyan/40 rounded-xl px-3 py-2 text-xs font-mono text-cyber-cyan shadow-lg whitespace-nowrap">
                {'<AI Engineer />'}
              </div>
              <div className="absolute -bottom-3 -left-3 bg-cyber-card border border-cyber-purple/40 rounded-xl px-3 py-2 text-xs font-mono text-purple-400 shadow-lg">
                {'{ Python · C++ }'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
        <span className="text-xs font-mono tracking-widest">scroll</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
