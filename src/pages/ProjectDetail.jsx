import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, isConfigured, imageUrl, isHttps } from '../lib/supabase';
import { videoEmbed } from '../lib/video';
import { FALLBACK_PROJECTS } from '../data/fallbackProjects';
import TechBadge from '../components/common/TechBadge';
import Wires from '../components/common/Wires';
import CursorFollower from '../components/common/CursorFollower';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { CATEGORY_META } from '../components/projects/FeaturedCard';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(undefined); // undefined = loading, null = not found
  const [lightboxImg, setLightboxImg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setProject(undefined);

    async function loadProject() {
      // 1. Try fetching from Supabase if configured
      if (isConfigured && supabase) {
        try {
          const isUuid = /^[0-9a-f-]{36}$/i.test(slug);
          const filterCol = isUuid ? 'id' : 'slug';
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq(filterCol, slug)
            .maybeSingle();

          if (!error && data) {
            setProject(data);
            // Increment view count via RPC
            if (data.id) {
              supabase.rpc('increment_project_views', { proj_id: data.id }).catch(() => {});
            }
            return;
          }
        } catch (err) {
          console.warn('Supabase fetch failed, falling back to local dataset:', err);
        }
      }

      // 2. Fallback to local dataset
      const local = FALLBACK_PROJECTS.find(p => p.slug === slug || p.id === slug);
      setProject(local || null);
    }

    loadProject();
  }, [slug]);

  // Document Title update
  useEffect(() => {
    if (project?.title) {
      document.title = `${project.title} — Abdullah Adel`;
    }
    return () => {
      document.title = 'Abdullah Adel | Mechatronics, AI & Software Engineer';
    };
  }, [project]);

  // Lightbox escape key
  useEffect(() => {
    if (!lightboxImg) return;
    const onKey = e => e.key === 'Escape' && setLightboxImg('');
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxImg]);

  const embedUrl = project?.video_url ? videoEmbed(project.video_url) : null;
  const cat = project ? (CATEGORY_META[project.category] ?? CATEGORY_META.soon) : null;

  return (
    <div className="relative min-h-screen bg-cyber-bg text-slate-100 flex flex-col">
      <Wires />
      <CursorFollower />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-28 relative z-10 space-y-10">
        
        {/* Loading state */}
        {project === undefined && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
            <p className="text-slate-400 font-mono text-xs">Loading case study telemetry...</p>
          </div>
        )}

        {/* 404 Not Found state */}
        {project === null && (
          <div className="p-12 text-center rounded-3xl bg-cyber-card border border-cyber-border space-y-5 my-12">
            <span className="text-5xl">🔍</span>
            <h2 className="text-2xl font-bold text-white">Project Case Study Not Found</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              The project you requested might have been moved or archived.
            </p>
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-cyber-cyan text-cyber-bg hover:opacity-90"
            >
              &larr; Back to Selected Projects
            </Link>
          </div>
        )}

        {/* Project Content */}
        {project && (
          <article className="space-y-10">
            
            {/* Breadcrumb & Navigation */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-cyber-border">
              <Link
                to="/#projects"
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-400 hover:text-cyber-cyan transition-colors"
              >
                <span>&larr;</span>
                <span>Back to All Works</span>
              </Link>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                {project.views_count != null && (
                  <span className="flex items-center gap-1.5">
                    <span>👁️</span> {project.views_count} views
                  </span>
                )}
                <span>•</span>
                <span>{project.year}</span>
              </div>
            </div>

            {/* Header info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border font-medium ${cat?.badge}`}>
                  <span>{cat?.icon}</span>
                  <span>{cat?.label}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-cyber-border bg-cyber-surface text-emerald-400">
                  {project.status || 'Complete'}
                </span>
                {project.rank != null && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan">
                    Featured #{project.rank}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                {project.title}
              </h1>

              {project.subtitle && (
                <p className="text-xl text-cyber-cyan font-mono font-medium">
                  {project.subtitle}
                </p>
              )}

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl pt-2">
                {project.description}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {project.demo_url && isHttps(project.demo_url) && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg hover:opacity-95 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
                  >
                    <span>Launch Live Demo</span>
                    <span>&nearr;</span>
                  </a>
                )}
                {project.github_url && isHttps(project.github_url) && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-cyber-card border border-cyber-border text-slate-200 hover:border-cyber-cyan hover:text-white transition-all"
                  >
                    <span>Inspect Source Code</span>
                    <span>&nearr;</span>
                  </a>
                )}
                {project.tech_sheet_url && (
                  <a
                    href={project.tech_sheet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-cyber-card border border-cyber-purple/60 text-purple-300 hover:bg-cyber-purple/20 transition-all"
                  >
                    <span>Download Tech Sheet (PDF)</span>
                    <span>📄</span>
                  </a>
                )}
                {(project.custom_links || []).map((lnk, idx) => (
                  <a
                    key={idx}
                    href={lnk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-cyber-card border border-cyber-cyan/40 text-slate-200 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                  >
                    <span>{lnk.label}</span>
                    <span>🔗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Hero Cover Image (if available) */}
            {project.image_path && (
              <div className="rounded-3xl overflow-hidden border border-cyber-border shadow-2xl bg-cyber-surface">
                <img
                  src={imageUrl(project.image_path)}
                  alt={project.title}
                  className="w-full max-h-[500px] object-cover"
                />
              </div>
            )}

            {/* Embedded Video Demo (if available) */}
            {embedUrl && (
              <div className="space-y-4 rounded-3xl bg-cyber-card/60 border border-cyber-border p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🎬</span> Project Demonstration & Walkthrough
                </h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-cyber-border">
                  <iframe
                    src={embedUrl}
                    title={`${project.title} walkthrough video`}
                    loading="lazy"
                    allowFullScreen
                    className="w-full h-full"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="encrypted-media; picture-in-picture; fullscreen"
                  />
                </div>
              </div>
            )}

            {/* Architecture Highlights */}
            {project.highlights?.length > 0 && (
              <div className="space-y-4 rounded-3xl bg-cyber-card/60 border border-cyber-border p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>⚡</span> Key Architectural Highlights
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-cyber-surface border border-cyber-border/70 text-sm text-slate-300">
                      <span className="text-cyber-cyan font-bold text-base mt-0.5">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Comprehensive Technical Details */}
            {project.details && (
              <div className="space-y-4 rounded-3xl bg-cyber-card/60 border border-cyber-border p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🛠️</span> Engineering & Implementation Breakdown
                </h2>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {project.details}
                </div>
              </div>
            )}

            {/* Tech Stack Employed */}
            {project.tech?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider text-xs text-cyber-cyan">
                  // Technologies & Frameworks Utilized
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {project.tech.map(t => (
                    <TechBadge key={t} name={t} size="md" />
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Images (Lightbox) */}
            {project.gallery?.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-cyber-border">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📸</span> Architectural Gallery & Schematics
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {project.gallery.map((imgName, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxImg(imageUrl(imgName))}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-cyber-border bg-cyber-surface hover:border-cyber-cyan transition-all"
                    >
                      <img
                        src={imageUrl(imgName)}
                        alt={`Screenshot ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-cyber-bg/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-mono text-cyber-cyan">
                        Enlarge 🔍
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Back CTA */}
            <div className="pt-8">
              <Link
                to="/#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-cyber-surface border border-cyber-border text-slate-300 hover:border-cyber-cyan hover:text-white transition-all"
              >
                &larr; Return to All Projects
              </Link>
            </div>

          </article>
        )}

      </main>

      {/* Lightbox Zoom Dialog */}
      {lightboxImg && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImg('')}
        >
          <img
            src={lightboxImg}
            alt="Expanded view"
            className="max-w-[95vw] max-h-[90vh] rounded-2xl object-contain border border-cyber-cyan/50 shadow-[0_0_50px_rgba(0,212,255,0.3)]"
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
