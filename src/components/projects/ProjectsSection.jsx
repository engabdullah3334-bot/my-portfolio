import { useState, useMemo } from 'react';
import FeaturedCard, { CATEGORY_META } from './FeaturedCard';
import CompactCard from './CompactCard';
import ProjectCarousel from './ProjectCarousel';
import ViewModeToggle from './ViewModeToggle';

export default function ProjectsSection({ projects = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'carousel'

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    return projects.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
  }, [projects]);

  const filters = [
    { id: 'all', label: 'All Projects', count: projects.length },
    ...Object.entries(categoryCounts).map(([id, count]) => ({
      id,
      label: CATEGORY_META[id]?.label ?? id,
      count,
    })),
  ];

  // Filtered projects
  const filtered = useMemo(() => {
    return activeFilter === 'all'
      ? projects
      : projects.filter(p => p.category === activeFilter);
  }, [projects, activeFilter]);

  const featured = filtered.filter(p => p.is_featured || (p.rank != null && p.rank <= 3));
  const others = filtered.filter(p => !p.is_featured && (p.rank == null || p.rank > 3));

  return (
    <section id="projects" className="relative py-24 bg-cyber-bg overflow-hidden border-t border-cyber-border">
      {/* Background neon glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyber-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyber-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        
        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-cyber-cyan font-mono text-xs sm:text-sm tracking-widest uppercase">
              // portfolio showcase
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Selected{' '}
              <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-lg">
              Explore intelligent systems, machine learning pipelines, and full-stack software products.
            </p>
          </div>

          {/* View Mode Switcher */}
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>

        {/* Filter Pills (Shown in Grid mode) */}
        {viewMode === 'grid' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filters.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeFilter === f.id
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg shadow-[0_0_16px_rgba(0,212,255,0.35)]'
                    : 'bg-cyber-card/70 border border-cyber-border text-slate-400 hover:border-cyber-cyan/50 hover:text-white'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeFilter === f.id ? 'bg-cyber-bg/30 text-cyber-bg font-bold' : 'bg-cyber-border text-slate-400'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* View Mode: Carousel */}
        {viewMode === 'carousel' ? (
          <ProjectCarousel projects={filtered} />
        ) : (
          /* View Mode: Cyber Grid */
          <div className="space-y-14">
            {/* Featured Projects Grid */}
            {featured.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-cyber-cyan font-mono text-xs tracking-widest uppercase">// Core Systems</span>
                  <div className="h-px flex-1 bg-cyber-border" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featured.map((project, idx) => (
                    <FeaturedCard key={project.id} project={project} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Other / Compact Projects Grid */}
            {others.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono text-xs tracking-widest uppercase">// Additional Initiatives</span>
                  <div className="h-px flex-1 bg-cyber-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {others.map((project, idx) => (
                    <CompactCard key={project.id} project={project} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-cyber-card/40 border border-cyber-border">
                <p className="text-slate-400 text-sm">No projects found for this category.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
