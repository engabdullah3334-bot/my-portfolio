import { useEffect, useRef, useState } from 'react'
import { FeaturedCard, CompactCard, CATEGORY_META } from './ProjectCard'

/* ── Category filter button ───────────────────────────── */
function FilterBtn({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-300 whitespace-nowrap
        ${active
          ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg shadow-[0_0_16px_rgba(0,212,255,0.3)]'
          : 'bg-cyber-card border border-cyber-border text-slate-400 hover:border-cyber-cyan/50 hover:text-cyber-cyan'
        }
      `}
    >
      {label}
      {count != null && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-cyber-bg/30' : 'bg-cyber-border text-slate-500'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

/* ── Section divider with label ───────────────────────── */
function Divider({ label }) {
  return (
    <div className="flex items-center gap-4 my-10">
      <div className="h-px flex-1 bg-cyber-border" />
      <span className="text-xs font-mono text-cyber-cyan tracking-widest uppercase px-3">{label}</span>
      <div className="h-px flex-1 bg-cyber-border" />
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   PROJECTS SECTION
   Props:
     projects — the full JSON object { featured: [], others: [] }
   ════════════════════════════════════════════════════════ */
export default function ProjectsSection({ projects }) {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  /* ── Build filter tabs from data ── */
  const allProjects = [...(projects.featured ?? []), ...(projects.others ?? [])]
  const categoryCounts = allProjects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  const filters = [
    { id: 'all', label: 'All', count: allProjects.length },
    ...Object.entries(categoryCounts).map(([id, count]) => ({
      id,
      label: CATEGORY_META[id]?.label ?? id,
      count,
    })),
  ]

  /* ── Filter logic ── */
  const filteredFeatured = (projects.featured ?? []).filter(
    (p) => activeFilter === 'all' || p.category === activeFilter,
  )
  const filteredOthers = (projects.others ?? []).filter(
    (p) => activeFilter === 'all' || p.category === activeFilter,
  )

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-28 bg-cyber-bg overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyber-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyber-purple/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">

        {/* ── Header ── */}
        <div className={`text-center mb-14 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-cyber-cyan font-mono text-sm tracking-widest uppercase mb-3">
            // what I've built
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From AI pipelines to full-stack systems and embedded robotics —
            real products, real engineering.
          </p>
        </div>

        {/* ── Filter tabs (auto-generated from data) ── */}
        <div className={`flex flex-wrap justify-center gap-3 mb-4 transition-all duration-1000 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {filters.map((f) => (
            <FilterBtn
              key={f.id}
              label={f.label}
              count={f.count}
              active={activeFilter === f.id}
              onClick={() => setActiveFilter(f.id)}
            />
          ))}
        </div>

        {/* ── Featured cards ── */}
        {filteredFeatured.length > 0 && (
          <>
            <Divider label="⭐ Top Projects" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFeatured.map((project, i) => (
                <FeaturedCard
                  key={project.id}
                  project={project}
                  index={i}
                  visible={visible}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Other / compact cards ── */}
        {filteredOthers.length > 0 && (
          <>
            <Divider label="Other Projects" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOthers.map((project, i) => (
                <CompactCard
                  key={project.id}
                  project={project}
                  index={i}
                  visible={visible}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Empty state ── */}
        {filteredFeatured.length === 0 && filteredOthers.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-5xl mb-4">🔧</p>
            <p className="font-mono text-sm">Nothing in this category yet — more coming soon!</p>
          </div>
        )}

        {/* ── "More projects" CTA ── */}
        <div className={`mt-16 p-8 rounded-2xl bg-gradient-to-r from-cyber-surface to-cyber-card border border-cyber-border text-center transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-2xl font-bold text-white mb-2">
            More projects in the pipeline 🚀
          </p>
          <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
            Including a syndicate management system and other projects being polished for release. Follow on GitHub to stay updated.
          </p>
          <a
            id="projects-view-all-github"
            href="https://github.com/abdullahadel"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm
              bg-cyber-card border border-cyber-border text-slate-300
              hover:border-cyber-cyan hover:text-cyber-cyan hover:bg-cyber-glow
              transition-all duration-300
            "
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View All on GitHub
          </a>
        </div>

      </div>
    </section>
  )
}
