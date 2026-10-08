import { getTechIcon } from '../data/techIcons'

/* ════════════════════════════════════════════════════════
   Category style map — keeps Tailwind classes in JS files
   so they get picked up by the purge scanner.
   ════════════════════════════════════════════════════════ */
export const CATEGORY_META = {
  fullstack: {
    label: 'Full-Stack Web',
    icon: '🌐',
    bar: 'from-cyan-500 to-blue-600',
    badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  },
  aipipeline: {
    label: 'AI Pipeline',
    icon: '🤖',
    bar: 'from-purple-500 to-pink-600',
    badge: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  },
  desktop: {
    label: 'Desktop App',
    icon: '💻',
    bar: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  },
  embedded: {
    label: 'Embedded',
    icon: '🦾',
    bar: 'from-orange-500 to-red-600',
    badge: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  },
  soon: {
    label: 'More Soon',
    icon: '⚡',
    bar: 'from-slate-500 to-slate-600',
    badge: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
  },
}

const STATUS_STYLES = {
  Active:      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  Published:   'bg-blue-500/10    border-blue-500/30    text-blue-400',
  Complete:    'bg-purple-500/10  border-purple-500/30  text-purple-400',
  'In Progress':'bg-amber-500/10  border-amber-500/30   text-amber-400',
}
const STATUS_DOT = {
  Active:      'bg-emerald-400 animate-pulse',
  Published:   'bg-blue-400',
  Complete:    'bg-purple-400',
  'In Progress':'bg-amber-400 animate-pulse',
}

/* ── Tech badge with real icon / emoji ───────────────── */
function TechBadge({ name }) {
  const icon = getTechIcon(name)
  const hasImg = Boolean(icon.src)

  return (
    <span
      title={name}
      className="
        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
        bg-cyber-bg border border-cyber-border text-slate-300
        hover:border-cyber-cyan/60 hover:text-white hover:scale-105
        transition-all duration-200 cursor-default select-none
      "
    >
      {hasImg ? (
        <img
          src={icon.src}
          alt={name}
          width={14}
          height={14}
          className={`shrink-0 ${icon.invert ? 'brightness-0 invert' : ''}`}
          loading="lazy"
        />
      ) : (
        <span
          className="w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0"
          style={{ background: `${icon.color}22` }}
        >
          {icon.emoji}
        </span>
      )}
      {name}
    </span>
  )
}

/* ── Status badge ─────────────────────────────────────── */
function StatusBadge({ status }) {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border font-medium
      ${STATUS_STYLES[status] ?? STATUS_STYLES.Complete}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? 'bg-slate-400'}`} />
      {status}
    </span>
  )
}

/* ── Action buttons ───────────────────────────────────── */
function ActionButtons({ project }) {
  const { github, demo, video, techSheet, id } = project

  return (
    <div className="flex gap-2.5 pt-1 flex-wrap">
      {/* View Code — always shown if github exists */}
      {github && (
        <a
          id={`card-code-${id}`}
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex-1 min-w-[120px] inline-flex items-center justify-center gap-2
            py-2.5 px-4 rounded-xl text-sm font-medium
            bg-cyber-card border border-cyber-border text-slate-300
            hover:border-cyber-cyan hover:text-cyber-cyan hover:bg-cyber-glow
            transition-all duration-300
          "
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          View Code
        </a>
      )}

      {/* Live Demo — shown if demo URL exists */}
      {demo && (
        <a
          id={`card-demo-${id}`}
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex-1 min-w-[120px] inline-flex items-center justify-center gap-2
            py-2.5 px-4 rounded-xl text-sm font-medium
            bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg
            hover:opacity-90 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]
            active:scale-95 transition-all duration-300
          "
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Live Demo
        </a>
      )}

      {/* Watch Video — shown if no demo but video exists */}
      {!demo && video && (
        <a
          id={`card-video-${id}`}
          href={video}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex-1 min-w-[120px] inline-flex items-center justify-center gap-2
            py-2.5 px-4 rounded-xl text-sm font-medium
            bg-gradient-to-r from-red-500 to-rose-600 text-white
            hover:opacity-90 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
            active:scale-95 transition-all duration-300
          "
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch Video
        </a>
      )}

      {/* Download Tech Sheet */}
      {techSheet && (
        <a
          id={`card-techsheet-${id}`}
          href={techSheet}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex-1 min-w-[120px] inline-flex items-center justify-center gap-2
            py-2.5 px-4 rounded-xl text-sm font-medium
            bg-cyber-card border border-cyber-cyan text-cyber-cyan
            hover:bg-cyber-cyan/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]
            active:scale-95 transition-all duration-300
          "
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2.5L17.5 9H13V4.5zM6 20V4h6v6h6v10H6z" />
          </svg>
          Tech Sheet
        </a>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   FEATURED CARD  (full-size, rank badge, highlights)
   ════════════════════════════════════════════════════════ */
export function FeaturedCard({ project, index = 0, visible = true }) {
  const cat = CATEGORY_META[project.category] ?? CATEGORY_META.soon

  return (
    <div
      className={`
        group relative flex flex-col rounded-2xl overflow-hidden
        bg-cyber-surface border border-cyber-border
        hover:border-cyber-cyan/40 hover:shadow-[0_0_48px_rgba(0,212,255,0.07)]
        transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Top gradient bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${cat.bar}`} />

      <div className="flex flex-col flex-1 p-6 gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Rank badge */}
            <div className="
              w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm
              bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/20
              border border-cyber-cyan/30 text-cyber-cyan
            ">
              #{project.rank}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight group-hover:text-cyber-cyan transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">{project.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={project.status} />
            <span className="text-xs text-slate-500 font-mono">{project.year}</span>
          </div>
        </div>

        {/* Category pill */}
        <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border font-medium ${cat.badge}`}>
          {cat.icon} {cat.label}
        </span>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>

        {/* Highlights */}
        {project.highlights?.length > 0 && (
          <ul className="space-y-2">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="text-cyber-cyan mt-0.5 shrink-0">▸</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Tech badges with real icons */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <TechBadge key={t} name={t} />
          ))}
        </div>

        {/* Action buttons */}
        <ActionButtons project={project} />
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   COMPACT CARD  (other / smaller projects)
   ════════════════════════════════════════════════════════ */
export function CompactCard({ project, index = 0, visible = true }) {
  const cat = CATEGORY_META[project.category] ?? CATEGORY_META.soon
  const isComingSoon = !project.github

  return (
    <div
      className={`
        group relative flex flex-col rounded-xl overflow-hidden
        bg-cyber-surface border
        ${isComingSoon
          ? 'border-dashed border-cyber-border/50 opacity-60'
          : 'border-cyber-border hover:border-cyber-cyan/40 hover:shadow-[0_0_24px_rgba(0,212,255,0.06)]'
        }
        transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${index * 100 + 300}ms` }}
    >
      {/* Thin category bar */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${cat.bar} opacity-60`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xl">{cat.icon}</span>
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} />
            <span className="text-xs text-slate-500 font-mono">{project.year}</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-base group-hover:text-cyber-cyan transition-colors duration-300">
            {project.title}
          </h4>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{project.description}</p>
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {project.tech.map((t) => (
            <TechBadge key={t} name={t} />
          ))}
        </div>

        {/* Buttons */}
        {!isComingSoon && <ActionButtons project={project} />}
      </div>
    </div>
  )
}
