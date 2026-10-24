import { useEffect, useRef, useState } from 'react';
import SkillGroup from './SkillGroup';
import LanguageBar from './LanguageBar';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const SKILL_GROUPS = [
  {
    category: 'Languages',
    accent: '#38bdf8',
    skills: ['Python', 'C / C++', 'JavaScript', 'TypeScript'],
  },
  {
    category: 'Backend & DB',
    accent: '#3b82f6',
    skills: ['Flask', 'MongoDB', 'PostgreSQL', 'SQLite', 'JWT'],
  },
  {
    category: 'AI & Machine Learning',
    accent: '#6366f1',
    skills: ['YOLO', 'LLaMA 3', 'NLLB-200', 'Gemini API', 'AI Agents', 'HuggingFace'],
  },
  {
    category: 'Embedded & Robotics',
    accent: '#f59e0b',
    skills: ['Arduino', 'Circuit Design'],
  },
  {
    category: 'Dev Tools & Deploy',
    accent: '#10b981',
    skills: ['Git / GitHub', 'Streamlit', 'Ollama', 'Tailwind', 'React'],
  },
];

const CERTIFICATIONS = [
  {
    icon: '🤖',
    title: 'Robotics with AI',
    issuer: 'Smart Technology · Engineers Syndicate',
  },
  {
    icon: '🇬🇧',
    title: 'English — Level B2',
    issuer: 'Upper-Intermediate (Actively Improving)',
  },
];

const LANGUAGES = [
  { flag: '🇸🇦', name: 'Arabic', level: 'Native (100%)', width: '100%', color: '#10b981' },
  { flag: '🇬🇧', name: 'English', level: 'B2 – Upper-Intermediate', width: '72%', color: '#38bdf8' },
  { flag: '🇯🇵', name: 'Japanese', level: 'Beginner (Self-studying)', width: '22%', color: '#94a3b8' },
];

export default function TrustSection() {
  const { settings } = useSiteSettings();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 bg-cyber-surface/40 overflow-hidden border-t border-white/[0.06]"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sky-400 font-mono text-xs sm:text-sm tracking-widest uppercase mb-2">
            // credentials & engineering arsenal
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Technical{' '}
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Arsenal
            </span>
            {' '}& Trust
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Technologies I employ daily, verifiable certifications, and academic background in mechatronics engineering.
          </p>
        </div>

        {/* Skills Groups Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-14 transition-all duration-1000 delay-150 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {SKILL_GROUPS.map(g => (
            <SkillGroup key={g.category} {...g} />
          ))}
        </div>

        {/* Credentials Cards Row */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* University Card */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl shrink-0">
                  🎓
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">
                    {settings.education?.university || 'Helwan National University'}
                  </h3>
                  <p className="text-sky-400 text-xs font-mono">
                    {settings.education?.location || 'Cairo, Egypt'}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <p className="text-slate-200 font-semibold">
                  {settings.education?.degree || 'B.Sc. Mechatronics Engineering'}
                </p>
                <p className="text-slate-400">
                  {settings.education?.stage || 'Freshman · 1st Year · Class of 2030'}
                </p>
                <p className="text-slate-500 text-xs">
                  {settings.education?.coursework || 'Core coursework: Robotics with AI · Circuit Analysis · Digital Logic'}
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-white/[0.08] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">
                {settings.education?.status || 'Currently Enrolled & Active'}
              </span>
            </div>
          </div>

          {/* Certifications Card */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <p className="text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold">Certifications</p>
              <div className="space-y-4">
                {CERTIFICATIONS.map(c => (
                  <div key={c.title} className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{c.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{c.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{c.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-white/[0.08]">
              <p className="text-xs text-slate-400 font-mono">
                High School Grade: <span className="text-emerald-400 font-bold">{settings.high_school_grade || '87% — High Honors'}</span>
              </p>
            </div>
          </div>

          {/* Languages Card */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <p className="text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold">Language Proficiency</p>
              <div className="space-y-4">
                {LANGUAGES.map(lang => (
                  <LanguageBar key={lang.name} {...lang} />
                ))}
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-white/[0.08]">
              <p className="text-xs text-slate-400">
                🇯🇵 Japanese — {settings.japanese_level || 'actively self-studying vocabulary & grammar'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
