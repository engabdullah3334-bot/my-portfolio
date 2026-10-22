import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isConfigured, imageUrl, BUCKET_IMAGES } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { DEFAULT_SITE_SETTINGS } from '../data/defaultSiteSettings';
import { FALLBACK_PROJECTS } from '../data/fallbackProjects';
import DatabaseJsonModal from '../components/admin/DatabaseJsonModal';

const PROJECT_REQUIRED_KEYS = ['title', 'slug', 'category', 'status', 'published', 'tech', 'highlights'];
const INQUIRY_REQUIRED_KEYS = ['name', 'email', 'message', 'is_read'];

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT FORM helpers
───────────────────────────────────────────────────────────────────────────── */
const blankForm = () => ({
  title: '',
  subtitle: '',
  slug: '',
  category: 'fullstack',
  year: String(new Date().getFullYear()),
  status: 'Complete',
  rank: '',
  is_featured: false,
  description: '',
  highlights: '',
  details: '',
  tech: '',
  github_url: '',
  demo_url: '',
  video_url: '',
  tech_sheet_url: '',
  sort_order: 0,
  published: true,
  image_path: '',
});

/* ─────────────────────────────────────────────────────────────────────────────
   Reusable input / textarea style
───────────────────────────────────────────────────────────────────────────── */
const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-cyan transition-colors';
const labelCls = 'block text-xs font-mono text-slate-400 mb-1';

/* ─────────────────────────────────────────────────────────────────────────────
   Labelled Field wrappers
───────────────────────────────────────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SITE SETTINGS TAB
───────────────────────────────────────────────────────────────────────────── */
function SiteSettingsTab() {
  const { settings, updateSettings } = useSiteSettings();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Initialise form once settings loads
  useEffect(() => {
    if (!form) {
      setForm({
        // Personal
        name: settings.name || '',
        tagline: settings.tagline || '',
        bio: settings.bio || '',
        location: settings.location || '',
        availability_status: settings.availability_status || '',
        is_available: Boolean(settings.is_available),
        // Contact
        email: settings.email || '',
        phone: settings.phone || '',
        whatsapp_url: settings.whatsapp_url || '',
        github_url: settings.github_url || '',
        linkedin_url: settings.linkedin_url || '',
        twitter_url: settings.twitter_url || '',
        telegram_url: settings.telegram_url || '',
        // Documents
        resume_url: settings.resume_url || '',
        // Typewriter roles (newline-separated)
        roles: (settings.roles || []).join('\n'),
        // Skills (comma-separated)
        hero_skills: (settings.hero_skills || []).join(', '),
        marquee_skills: (settings.marquee_skills || []).join(', '),
        // Navbar labels
        nav_overview_label: settings.nav_overview_label || 'Overview',
        nav_skills_label: settings.nav_skills_label || 'Arsenal',
        nav_projects_label: settings.nav_projects_label || 'Projects',
        nav_contact_label: settings.nav_contact_label || 'Contact',
        nav_cta_label: settings.nav_cta_label || 'Get In Touch',
        // Contact section
        contact_headline: settings.contact_headline || '',
        contact_subtext: settings.contact_subtext || '',
        // Footer
        footer_tagline: settings.footer_tagline || '',
        // Education
        edu_university: settings.education?.university || '',
        edu_location: settings.education?.location || '',
        edu_degree: settings.education?.degree || '',
        edu_stage: settings.education?.stage || '',
        edu_coursework: settings.education?.coursework || '',
        edu_status: settings.education?.status || '',
        high_school_grade: settings.high_school_grade || '',
        japanese_level: settings.japanese_level || '',
        // Stats — serialised as JSON text for simplicity
        stats_json: JSON.stringify(settings.stats || DEFAULT_SITE_SETTINGS.stats, null, 2),
      });
    }
  }, [settings, form]);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', type: '' });

    let parsedStats;
    try {
      parsedStats = JSON.parse(form.stats_json);
    } catch {
      setMsg({ text: 'Stats JSON is invalid. Please fix and try again.', type: 'error' });
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      bio: form.bio.trim(),
      location: form.location.trim(),
      availability_status: form.availability_status.trim(),
      is_available: form.is_available,
      email: form.email.trim(),
      phone: form.phone.trim(),
      whatsapp_url: form.whatsapp_url.trim(),
      github_url: form.github_url.trim(),
      linkedin_url: form.linkedin_url.trim(),
      twitter_url: form.twitter_url.trim(),
      telegram_url: form.telegram_url.trim(),
      resume_url: form.resume_url.trim(),
      roles: form.roles.split('\n').map(r => r.trim()).filter(Boolean),
      hero_skills: form.hero_skills.split(',').map(s => s.trim()).filter(Boolean),
      marquee_skills: form.marquee_skills.split(',').map(s => s.trim()).filter(Boolean),
      nav_overview_label: form.nav_overview_label.trim() || 'Overview',
      nav_skills_label: form.nav_skills_label.trim() || 'Arsenal',
      nav_projects_label: form.nav_projects_label.trim() || 'Projects',
      nav_contact_label: form.nav_contact_label.trim() || 'Contact',
      nav_cta_label: form.nav_cta_label.trim() || 'Get In Touch',
      contact_headline: form.contact_headline.trim(),
      contact_subtext: form.contact_subtext.trim(),
      footer_tagline: form.footer_tagline.trim(),
      education: {
        university: form.edu_university.trim(),
        location: form.edu_location.trim(),
        degree: form.edu_degree.trim(),
        stage: form.edu_stage.trim(),
        coursework: form.edu_coursework.trim(),
        status: form.edu_status.trim(),
      },
      high_school_grade: form.high_school_grade.trim(),
      japanese_level: form.japanese_level.trim(),
      stats: parsedStats,
    };

    try {
      await updateSettings(payload);
      setMsg({ text: 'Site settings saved & synced to Supabase!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.message || 'Save failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveJsonSettings = async (newData) => {
    await updateSettings(newData);
    setForm({
      name: newData.name || '',
      tagline: newData.tagline || '',
      bio: newData.bio || '',
      location: newData.location || '',
      availability_status: newData.availability_status || '',
      is_available: Boolean(newData.is_available),
      email: newData.email || '',
      phone: newData.phone || '',
      whatsapp_url: newData.whatsapp_url || '',
      github_url: newData.github_url || '',
      linkedin_url: newData.linkedin_url || '',
      twitter_url: newData.twitter_url || '',
      telegram_url: newData.telegram_url || '',
      resume_url: newData.resume_url || '',
      roles: (newData.roles || []).join('\n'),
      hero_skills: (newData.hero_skills || []).join(', '),
      marquee_skills: (newData.marquee_skills || []).join(', '),
      nav_overview_label: newData.nav_overview_label || 'Overview',
      nav_skills_label: newData.nav_skills_label || 'Arsenal',
      nav_projects_label: newData.nav_projects_label || 'Projects',
      nav_contact_label: newData.nav_contact_label || 'Contact',
      nav_cta_label: newData.nav_cta_label || 'Get In Touch',
      contact_headline: newData.contact_headline || '',
      contact_subtext: newData.contact_subtext || '',
      footer_tagline: newData.footer_tagline || '',
      edu_university: newData.education?.university || '',
      edu_location: newData.education?.location || '',
      edu_degree: newData.education?.degree || '',
      edu_stage: newData.education?.stage || '',
      edu_coursework: newData.education?.coursework || '',
      edu_status: newData.education?.status || '',
      high_school_grade: newData.high_school_grade || '',
      japanese_level: newData.japanese_level || '',
      stats_json: JSON.stringify(newData.stats || DEFAULT_SITE_SETTINGS.stats, null, 2),
    });
    setMsg({ text: 'تم حفظ كافة الإعدادات في قاعدة البيانات Supabase وتحديث الواجهة فورياً!', type: 'success' });
  };

  if (!form) {
    return <div className="text-slate-400 text-sm">Loading settings...</div>;
  }

  const sectionHead = (title) => (
    <h3 className="text-base font-bold text-cyber-cyan border-b border-cyber-border/60 pb-2 mt-2">{title}</h3>
  );

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* ── Direct Database Raw JSON Action Bar ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-cyber-card border border-cyber-cyan/40 bg-gradient-to-r from-cyber-cyan/10 via-transparent to-transparent shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan text-lg shadow-sm">
            ⚡
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">محرر إعدادات الموقع المباشر (Raw JSON Database Mode)</h3>
            <p className="text-xs text-slate-400">تعديل كافة روابط وصفحات وإعدادات الموقع مباشرة من قاعدة البيانات مع قفل أمان المفاتيح</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsJsonModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-cyber-cyan/20 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-bg border border-cyber-cyan/40 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>{`{ }`} فتح في محرر JSON المباشر</span>
        </button>
      </div>

      {msg.text && (
        <div className={`p-3.5 rounded-xl text-xs font-medium ${msg.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' : 'bg-red-500/15 border border-red-500/40 text-red-300'}`}>
          {msg.text}
        </div>
      )}

      {/* ── Personal Info ──────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border space-y-5">
        {sectionHead('👤 Personal Info')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name">
            <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Abdullah Adel" />
          </Field>
          <Field label="Location">
            <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Cairo, Egypt" />
          </Field>
        </div>
        <Field label="Tagline (shown in hero under name)">
          <input className={inputCls} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="intelligent systems & robotics" />
        </Field>
        <Field label="Bio / About">
          <textarea className={inputCls} rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Availability Status Text">
            <input className={inputCls} value={form.availability_status} onChange={e => set('availability_status', e.target.value)} placeholder="Available for opportunities" />
          </Field>
          <Field label="Is Available?">
            <label className="inline-flex items-center gap-2 mt-2 cursor-pointer text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={e => set('is_available', e.target.checked)}
                className="rounded"
              />
              <span>Show green pulse (available)</span>
            </label>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="High School Grade">
            <input className={inputCls} value={form.high_school_grade} onChange={e => set('high_school_grade', e.target.value)} />
          </Field>
          <Field label="Japanese Level">
            <input className={inputCls} value={form.japanese_level} onChange={e => set('japanese_level', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* ── Contact Links ─────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border space-y-5">
        {sectionHead('🔗 Contact Links')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address">
            <input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
          </Field>
          <Field label="Phone Number">
            <input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+20 101 486 0948" />
          </Field>
          <Field label="GitHub URL">
            <input type="url" className={inputCls} value={form.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..." />
          </Field>
          <Field label="LinkedIn URL">
            <input type="url" className={inputCls} value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </Field>
          <Field label="WhatsApp URL">
            <input type="url" className={inputCls} value={form.whatsapp_url} onChange={e => set('whatsapp_url', e.target.value)} placeholder="https://wa.me/201..." />
          </Field>
          <Field label="Twitter / X URL">
            <input type="url" className={inputCls} value={form.twitter_url} onChange={e => set('twitter_url', e.target.value)} placeholder="https://twitter.com/..." />
          </Field>
          <Field label="Telegram URL">
            <input type="url" className={inputCls} value={form.telegram_url} onChange={e => set('telegram_url', e.target.value)} placeholder="https://t.me/..." />
          </Field>
          <Field label="Resume / CV URL">
            <input className={inputCls} value={form.resume_url} onChange={e => set('resume_url', e.target.value)} placeholder="/resume.pdf or https://..." />
          </Field>
        </div>
      </div>

      {/* ── Navbar Labels ─────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border space-y-5">
        {sectionHead('🧭 Navbar Labels')}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Field label="Overview Link">
            <input className={inputCls} value={form.nav_overview_label} onChange={e => set('nav_overview_label', e.target.value)} />
          </Field>
          <Field label="Skills Link">
            <input className={inputCls} value={form.nav_skills_label} onChange={e => set('nav_skills_label', e.target.value)} />
          </Field>
          <Field label="Projects Link">
            <input className={inputCls} value={form.nav_projects_label} onChange={e => set('nav_projects_label', e.target.value)} />
          </Field>
          <Field label="Contact Link">
            <input className={inputCls} value={form.nav_contact_label} onChange={e => set('nav_contact_label', e.target.value)} />
          </Field>
          <Field label="CTA Button">
            <input className={inputCls} value={form.nav_cta_label} onChange={e => set('nav_cta_label', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* ── Skills & Roles ────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border space-y-5">
        {sectionHead('⚡ Skills & Roles')}
        <Field label="Typewriter Roles (one per line)">
          <textarea className={inputCls} rows={5} value={form.roles} onChange={e => set('roles', e.target.value)} placeholder="Mechatronics Eng. Student&#10;AI & ML Engineer" />
        </Field>
        <Field label="Hero Skill Chips (comma-separated)">
          <input className={inputCls} value={form.hero_skills} onChange={e => set('hero_skills', e.target.value)} placeholder="Python, C / C++, Flask, MongoDB..." />
        </Field>
        <Field label="Marquee Ticker Skills (comma-separated)">
          <input className={inputCls} value={form.marquee_skills} onChange={e => set('marquee_skills', e.target.value)} placeholder="Python, Robotics, FastAPI..." />
        </Field>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border space-y-5">
        {sectionHead('📊 Stats (JSON Array)')}
        <p className="text-xs text-slate-500 font-mono">
          Format: [{"{"}"label":"Projects Built","value":"10+","count":10{"}"}]  — set count to null to skip animation.
        </p>
        <Field label="Stats JSON">
          <textarea className={`${inputCls} font-mono text-xs`} rows={8} value={form.stats_json} onChange={e => set('stats_json', e.target.value)} />
        </Field>
      </div>

      {/* ── Education ─────────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border space-y-5">
        {sectionHead('🎓 Education')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="University Name">
            <input className={inputCls} value={form.edu_university} onChange={e => set('edu_university', e.target.value)} />
          </Field>
          <Field label="University Location">
            <input className={inputCls} value={form.edu_location} onChange={e => set('edu_location', e.target.value)} />
          </Field>
          <Field label="Degree">
            <input className={inputCls} value={form.edu_degree} onChange={e => set('edu_degree', e.target.value)} />
          </Field>
          <Field label="Stage / Year">
            <input className={inputCls} value={form.edu_stage} onChange={e => set('edu_stage', e.target.value)} />
          </Field>
          <Field label="Coursework">
            <input className={inputCls} value={form.edu_coursework} onChange={e => set('edu_coursework', e.target.value)} />
          </Field>
          <Field label="Enrollment Status">
            <input className={inputCls} value={form.edu_status} onChange={e => set('edu_status', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* ── Contact Section Text ──────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border space-y-5">
        {sectionHead('✉️ Contact Section Copy')}
        <Field label="Contact Headline">
          <input className={inputCls} value={form.contact_headline} onChange={e => set('contact_headline', e.target.value)} placeholder="Have a challenge worth solving?" />
        </Field>
        <Field label="Contact Subtext">
          <textarea className={inputCls} rows={3} value={form.contact_subtext} onChange={e => set('contact_subtext', e.target.value)} />
        </Field>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border space-y-5">
        {sectionHead('🦶 Footer')}
        <Field label="Footer Tagline (shown next to copyright)">
          <input className={inputCls} value={form.footer_tagline} onChange={e => set('footer_tagline', e.target.value)} placeholder="Mechatronics & AI Engineering" />
        </Field>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-lg text-base"
      >
        {saving ? 'Syncing to Supabase...' : '💾 Save All Site Settings'}
      </button>

      {/* ── Direct Site Settings Database JSON Modal ── */}
      <DatabaseJsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        title="محرر إعدادات الموقع المباشر (Site Settings Raw DB)"
        tableName="public.site_settings (id='global')"
        initialData={settings}
        templateData={DEFAULT_SITE_SETTINGS}
        validationOptions={{
          isArray: false,
          requiredKeys: Object.keys(DEFAULT_SITE_SETTINGS),
          nestedTemplate: {
            education: ['university', 'location', 'degree', 'stage', 'coursework', 'status'],
          },
        }}
        onSave={handleSaveJsonSettings}
      />
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN ADMIN DASHBOARD
───────────────────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'settings' | 'inquiries'
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blankForm());
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  // Direct Database JSON Modals State
  const [bulkProjectsModalOpen, setBulkProjectsModalOpen] = useState(false);
  const [singleProjectForJson, setSingleProjectForJson] = useState(null);
  const [inquiriesJsonModalOpen, setInquiriesJsonModalOpen] = useState(false);

  // Load data with fallback resilience
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (isConfigured && supabase) {
        const { data: projs } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });
        setProjects(projs && projs.length > 0 ? projs : FALLBACK_PROJECTS);

        const { data: inqs } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });
        setInquiries(inqs || []);
      } else {
        setProjects(FALLBACK_PROJECTS);
        setInquiries([]);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      setProjects(FALLBACK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveBulkProjects = async (newProjectsList) => {
    const sanitized = newProjectsList.map(p => ({
      ...p,
      rank: p.rank ? parseInt(p.rank, 10) : null,
      sort_order: parseInt(p.sort_order, 10) || 0,
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
      tech: Array.isArray(p.tech) ? p.tech : [],
      custom_links: Array.isArray(p.custom_links) ? p.custom_links : [],
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
    }));

    if (isConfigured && supabase) {
      const { error } = await supabase.from('projects').upsert(sanitized);
      if (error) throw error;
    }
    setProjects(sanitized);
    setMsg({ text: 'تم تحديث وحفظ جميع المشاريع في قاعدة البيانات مباشرة!', type: 'success' });
    loadData();
  };

  const handleSaveSingleProjectJson = async (updatedProj) => {
    const sanitized = {
      ...updatedProj,
      rank: updatedProj.rank ? parseInt(updatedProj.rank, 10) : null,
      sort_order: parseInt(updatedProj.sort_order, 10) || 0,
      highlights: Array.isArray(updatedProj.highlights) ? updatedProj.highlights : [],
      tech: Array.isArray(updatedProj.tech) ? updatedProj.tech : [],
      custom_links: Array.isArray(updatedProj.custom_links) ? updatedProj.custom_links : [],
      gallery: Array.isArray(updatedProj.gallery) ? updatedProj.gallery : [],
    };

    if (isConfigured && supabase) {
      if (sanitized.id) {
        const { error } = await supabase.from('projects').upsert(sanitized);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([sanitized]);
        if (error) throw error;
      }
    }
    setProjects(prev => prev.map(p => p.id === sanitized.id ? sanitized : p));
    setMsg({ text: `تم تحديث المشروع "${sanitized.title}" في قاعدة البيانات بنجاح!`, type: 'success' });
    loadData();
  };

  const handleSaveInquiriesJson = async (newInquiriesList) => {
    if (isConfigured && supabase) {
      const { error } = await supabase.from('inquiries').upsert(newInquiriesList);
      if (error) throw error;
    }
    setInquiries(newInquiriesList);
    setMsg({ text: 'تم حفظ وتحديث الرسائل في قاعدة البيانات مباشرة!', type: 'success' });
    loadData();
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate('/', { replace: true });
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || '',
      subtitle: p.subtitle || '',
      slug: p.slug || '',
      category: p.category || 'fullstack',
      year: p.year || '',
      status: p.status || 'Complete',
      rank: p.rank != null ? String(p.rank) : '',
      is_featured: Boolean(p.is_featured),
      description: p.description || '',
      highlights: (p.highlights || []).join('\n'),
      details: p.details || '',
      tech: (p.tech || []).join(', '),
      github_url: p.github_url || '',
      demo_url: p.demo_url || '',
      video_url: p.video_url || '',
      tech_sheet_url: p.tech_sheet_url || '',
      sort_order: p.sort_order ?? 0,
      published: Boolean(p.published),
      image_path: p.image_path || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(blankForm());
    setFile(null);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    setMsg({ text: '', type: '' });

    try {
      let image_path = form.image_path;

      if (file && supabase) {
        const ext = file.name.split('.').pop().toLowerCase();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from(BUCKET_IMAGES)
          .upload(fileName, file, { cacheControl: '3600', upsert: true });
        if (uploadErr) throw uploadErr;
        image_path = fileName;
      }

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: form.category,
        year: form.year.trim() || null,
        status: form.status,
        rank: form.rank ? parseInt(form.rank, 10) : null,
        is_featured: form.is_featured,
        description: form.description.trim() || null,
        highlights: form.highlights.split('\n').map(h => h.trim()).filter(Boolean),
        details: form.details.trim() || null,
        tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
        github_url: form.github_url.trim() || null,
        demo_url: form.demo_url.trim() || null,
        video_url: form.video_url.trim() || null,
        tech_sheet_url: form.tech_sheet_url.trim() || null,
        sort_order: parseInt(form.sort_order, 10) || 0,
        published: form.published,
        image_path: image_path || null,
      };

      if (editingId) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
        if (error) throw error;
        setMsg({ text: 'Project updated successfully!', type: 'success' });
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        setMsg({ text: 'New project created successfully!', type: 'success' });
      }

      resetForm();
      loadData();
    } catch (err) {
      setMsg({ text: err.message || 'Operation failed', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ── Tab button helper ───────────────────────────────────────────────── */
  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
        activeTab === id
          ? 'bg-cyber-cyan text-cyber-bg shadow-md'
          : 'bg-cyber-card border border-cyber-border text-slate-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyber-border">
          <div>
            <span className="text-cyber-cyan font-mono text-xs uppercase tracking-widest">// control center</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Administrator Console</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyber-card border border-cyber-border text-slate-300 hover:text-white transition-all"
            >
              &larr; View Live Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <TabBtn id="projects"  label={`Projects Manager (${projects.length})`} />
          <TabBtn id="settings"  label="⚙️ Site Settings" />
          <TabBtn id="inquiries" label={`Inquiries Inbox (${inquiries.length})`} />
        </div>

        {/* ── PROJECTS TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div className="space-y-8">

            {/* Direct DB Raw JSON Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-cyber-card border border-cyber-cyan/40 bg-gradient-to-r from-cyber-cyan/10 via-transparent to-transparent shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan text-lg shadow-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">محرر قاعدة البيانات المباشر للمشاريع ({projects.length} مشاريع)</h3>
                  <p className="text-xs text-slate-400">تعديل جماعي أو فردي لبيانات المشاريع بصيغة JSON مع قفل حماية القوالب والمفاتيح</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBulkProjectsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-cyber-cyan/20 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-bg border border-cyber-cyan/40 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>{`{ }`} تعديل جميع المشاريع دفعة واحدة (Bulk DB JSON)</span>
              </button>
            </div>

            {/* Create / Edit Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border shadow-xl space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Edit Project Telemetry' : 'Deploy New Project'}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = {
                        id: editingId || crypto.randomUUID(),
                        title: form.title || '',
                        subtitle: form.subtitle || '',
                        slug: form.slug || '',
                        category: form.category || 'fullstack',
                        year: form.year || '',
                        status: form.status || 'Complete',
                        rank: form.rank ? parseInt(form.rank, 10) : null,
                        is_featured: form.is_featured,
                        description: form.description || '',
                        highlights: form.highlights ? form.highlights.split('\n').filter(Boolean) : [],
                        details: form.details || '',
                        tech: form.tech ? form.tech.split(',').map(s => s.trim()).filter(Boolean) : [],
                        github_url: form.github_url || '',
                        demo_url: form.demo_url || '',
                        video_url: form.video_url || '',
                        tech_sheet_url: form.tech_sheet_url || '',
                        sort_order: parseInt(form.sort_order, 10) || 0,
                        published: form.published,
                        image_path: form.image_path || '',
                      };
                      setSingleProjectForJson(cur);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-cyber-surface border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>⚡ تعديل الحقول كـ JSON</span>
                  </button>
                  {editingId && (
                    <button onClick={resetForm} className="text-xs text-slate-400 hover:text-white underline cursor-pointer">
                      Cancel Editing
                    </button>
                  )}
                </div>
              </div>

              {msg.text && (
                <div className={`p-3.5 rounded-xl text-xs font-medium ${msg.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' : 'bg-red-500/15 border border-red-500/40 text-red-300'}`}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Title *</label>
                    <input
                      type="text" required placeholder="e.g. LifeOS" value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Slug (URL)</label>
                    <input
                      type="text" placeholder="e.g. lifeos" value={form.slug}
                      onChange={e => setForm({ ...form, slug: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Subtitle</label>
                    <input
                      type="text" placeholder="e.g. Personal Life Management System" value={form.subtitle}
                      onChange={e => setForm({ ...form, subtitle: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                      <option value="fullstack">Full-Stack Web</option>
                      <option value="aipipeline">AI Pipeline</option>
                      <option value="desktop">Desktop App</option>
                      <option value="embedded">Embedded</option>
                      <option value="soon">In Development</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                      <option value="Active">Active</option>
                      <option value="Published">Published</option>
                      <option value="Complete">Complete</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className={labelCls}>Year</label>
                    <input type="text" placeholder="2026" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Rank (#)</label>
                    <input type="number" placeholder="1, 2, 3..." value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Sort Order</label>
                    <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} className={inputCls} />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
                      <span>Featured</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" />
                      <span>Published</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Tech Stack (comma-separated)</label>
                  <input type="text" placeholder="Python, Flask, MongoDB, JWT, Gemini API" value={form.tech} onChange={e => setForm({ ...form, tech: e.target.value })} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Brief Description</label>
                  <textarea rows={2} placeholder="Summary shown on the cards..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} />
                </div>

                <div>
                  <label className={labelCls}>Key Highlights (One per line)</label>
                  <textarea rows={3} placeholder="AI Action System directly mutation in MongoDB&#10;Waterfall fallback: Gemini → Grok → Ollama" value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Engineering Breakdown & Details (Markdown / Text for Case Study Page)</label>
                  <textarea rows={4} placeholder="Full in-depth narrative on architecture, decisions and metrics..." value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} className={inputCls} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className={labelCls}>GitHub URL</label>
                    <input type="url" placeholder="https://github.com/..." value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Live Demo URL</label>
                    <input type="url" placeholder="https://..." value={form.demo_url} onChange={e => setForm({ ...form, demo_url: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Video Demo URL</label>
                    <input type="url" placeholder="YouTube / Vimeo link" value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tech Sheet PDF URL</label>
                    <input type="text" placeholder="/sheet.pdf or https://..." value={form.tech_sheet_url} onChange={e => setForm({ ...form, tech_sheet_url: e.target.value })} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Cover Image Upload</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-400"
                  />
                  {form.image_path && (
                    <span className="text-[11px] text-cyber-cyan font-mono block mt-1">
                      Current file: {form.image_path}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-lg"
                >
                  {submitting ? 'Committing Changes...' : editingId ? 'Update Project' : 'Publish Project'}
                </button>
              </form>
            </div>

            {/* Existing Projects Table */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Live Inventory</h2>
              <div className="rounded-2xl overflow-hidden border border-cyber-border bg-cyber-card/60">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-cyber-surface text-slate-400 font-mono text-xs uppercase border-b border-cyber-border">
                    <tr>
                      <th className="p-4">Rank</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4">Published</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-border/60">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-cyber-surface/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-cyber-cyan">{p.rank ?? '-'}</td>
                        <td className="p-4 font-bold text-white">
                          <Link to={`/projects/${p.slug || p.id}`} className="hover:underline">{p.title}</Link>
                        </td>
                        <td className="p-4 text-slate-400">{p.category}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-xs bg-cyber-surface border border-cyber-border">{p.status}</span>
                        </td>
                        <td className="p-4">{p.is_featured ? '⭐ Yes' : 'No'}</td>
                        <td className="p-4">
                          {p.published ? (
                            <span className="text-emerald-400 font-bold">Public</span>
                          ) : (
                            <span className="text-amber-400">Draft</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSingleProjectForJson(p)}
                            className="px-2.5 py-1 rounded bg-cyber-surface border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg transition-colors font-mono text-xs"
                            title="تعديل هذا المشروع كـ JSON مباشر مع حماية الحقول"
                          >
                            {`{ }`} JSON
                          </button>
                          <button
                            onClick={() => startEdit(p)}
                            className="px-3 py-1 rounded bg-cyber-surface border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="px-3 py-1 rounded bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── SITE SETTINGS TAB ─────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2">
              <h2 className="text-xl font-bold text-white">Site Settings</h2>
              <span className="text-xs font-mono text-slate-500">Changes sync to Supabase & update the live site immediately</span>
            </div>
            <SiteSettingsTab />
          </div>
        )}

        {/* ── INQUIRIES TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">

            {/* Direct DB Raw JSON Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-cyber-card border border-cyber-cyan/40 bg-gradient-to-r from-cyber-cyan/10 via-transparent to-transparent shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan text-lg shadow-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">محرر قاعدة البيانات المباشر للرسائل ({inquiries.length} رسائل)</h3>
                  <p className="text-xs text-slate-400">تعديل الرسائل وحالات القراءة مباشرة في قاعدة البيانات بصيغة JSON مع قفل الأمان</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInquiriesJsonModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-cyber-cyan/20 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-bg border border-cyber-cyan/40 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>{`{ }`} فتح الرسائل في محرر JSON المباشر</span>
              </button>
            </div>

            <h2 className="text-xl font-bold text-white">Transmitted Messages</h2>
            {inquiries.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-cyber-card/40 border border-cyber-border text-slate-400">
                No inquiries received yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map(inq => (
                  <div key={inq.id} className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{inq.name}</span>
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <a href={`mailto:${inq.email}`} className="text-xs text-cyber-cyan font-mono hover:underline block">
                      {inq.email}
                    </a>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed pt-1">
                      {inq.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Bulk Projects DB JSON Modal ────────────────────────────────────── */}
      <DatabaseJsonModal
        isOpen={bulkProjectsModalOpen}
        onClose={() => setBulkProjectsModalOpen(false)}
        title="محرر جميع مشاريع قاعدة البيانات (Bulk Projects Raw DB)"
        tableName="public.projects (All Rows)"
        initialData={projects}
        templateData={projects.length > 0 ? projects : FALLBACK_PROJECTS}
        validationOptions={{
          isArray: true,
          requiredKeys: PROJECT_REQUIRED_KEYS,
        }}
        onSave={handleSaveBulkProjects}
      />

      {/* ── Single Project DB JSON Modal ───────────────────────────────────── */}
      {singleProjectForJson && (
        <DatabaseJsonModal
          isOpen={Boolean(singleProjectForJson)}
          onClose={() => setSingleProjectForJson(null)}
          title={`محرر المشروع المباشر: ${singleProjectForJson.title || 'مشروع'}`}
          tableName={`public.projects (${singleProjectForJson.id ? `ID: ${String(singleProjectForJson.id).slice(0, 8)}...` : 'New'})`}
          initialData={singleProjectForJson}
          templateData={singleProjectForJson}
          validationOptions={{
            isArray: false,
            requiredKeys: PROJECT_REQUIRED_KEYS,
          }}
          onSave={handleSaveSingleProjectJson}
        />
      )}

      {/* ── Inquiries DB JSON Modal ────────────────────────────────────────── */}
      <DatabaseJsonModal
        isOpen={inquiriesJsonModalOpen}
        onClose={() => setInquiriesJsonModalOpen(false)}
        title="محرر الرسائل المباشر (Raw JSON Inquiries)"
        tableName="public.inquiries"
        initialData={inquiries}
        templateData={inquiries.length > 0 ? inquiries : [{ id: 'sample-1', name: 'User', email: 'user@example.com', message: 'Hello', is_read: false, created_at: new Date().toISOString() }]}
        validationOptions={{
          isArray: true,
          requiredKeys: INQUIRY_REQUIRED_KEYS,
        }}
        onSave={handleSaveInquiriesJson}
      />
    </div>
  );
}
