import { useState } from 'react';
import { supabase, isConfigured } from '../../lib/supabase';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function ContactSection() {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', msg: '' }); // 'idle' | 'sending' | 'success' | 'error'

  const email = settings.email || 'engabdullah3334@gmail.com';
  const phone = settings.phone || '+20 101 486 0948';
  const github = settings.github_url || 'https://github.com/abdullahadel';
  const linkedin = settings.linkedin_url || 'https://linkedin.com/in/abdullahadel';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ state: 'error', msg: 'Please complete all required fields.' });
      return;
    }

    setStatus({ state: 'sending', msg: 'Transmitting inquiry...' });

    if (isConfigured && supabase) {
      try {
        const { error } = await supabase.from('inquiries').insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          },
        ]);
        if (error) throw error;
        setStatus({ state: 'success', msg: `Inquiry transmitted successfully! ${settings.name || 'Abdullah'} will reply shortly.` });
        setFormData({ name: '', email: '', message: '' });
      } catch (err) {
        console.error('Supabase contact submission error:', err);
        // Fallback to mailto
        window.location.href = `mailto:${email}?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message)}%0A%0AFrom:%20${encodeURIComponent(formData.email)}`;
        setStatus({ state: 'success', msg: 'Opened email client to send your message.' });
      }
    } else {
      // Local fallback via mailto
      window.location.href = `mailto:${email}?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message)}%0A%0AFrom:%20${encodeURIComponent(formData.email)}`;
      setStatus({ state: 'success', msg: 'Opened email client to send your message.' });
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-cyber-surface/70 border-t border-cyber-border overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Contact Info & Value Prop */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-cyber-cyan font-mono text-xs sm:text-sm tracking-widest uppercase">
                // communication channel
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {(settings.contact_headline || 'Have a challenge worth solving?').split(' ').slice(0, -2).join(' ')}{' '}
                <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                  {(settings.contact_headline || 'Have a challenge worth solving?').split(' ').slice(-2).join(' ')}
                </span>
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {settings.contact_subtext || 'Open to technical internships, robotics collaborations, and engineering opportunities in artificial intelligence, backend systems, and mechatronics.'}
            </p>

            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-between p-4 rounded-xl bg-cyber-card/80 border border-cyber-border hover:border-cyber-cyan hover:bg-cyber-card transition-all group"
              >
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Direct Email</span>
                  <span className="text-sm sm:text-base font-semibold text-white group-hover:text-cyber-cyan transition-colors">
                    {email}
                  </span>
                </div>
                <span className="text-cyber-cyan group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>

              <a
                href={`tel:${phone}`}
                className="flex items-center justify-between p-4 rounded-xl bg-cyber-card/80 border border-cyber-border hover:border-cyber-cyan hover:bg-cyber-card transition-all group"
              >
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Phone & WhatsApp</span>
                  <span className="text-sm sm:text-base font-semibold text-white group-hover:text-cyber-cyan transition-colors" dir="ltr">
                    {phone}
                  </span>
                </div>
                <span className="text-cyber-cyan group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-medium"
                  >
                    <span>🐙 GitHub</span>
                    <span className="ml-auto text-slate-500">&nearr;</span>
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-medium"
                  >
                    <span>💼 LinkedIn</span>
                    <span className="ml-auto text-slate-500">&nearr;</span>
                  </a>
                )}
                {settings.twitter_url && (
                  <a
                    href={settings.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-medium"
                  >
                    <span>🐦 Twitter</span>
                    <span className="ml-auto text-slate-500">&nearr;</span>
                  </a>
                )}
                {settings.telegram_url && (
                  <a
                    href={settings.telegram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-medium"
                  >
                    <span>✈️ Telegram</span>
                    <span className="ml-auto text-slate-500">&nearr;</span>
                  </a>
                )}
                {settings.whatsapp_url && (
                  <a
                    href={settings.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-medium"
                  >
                    <span>💬 WhatsApp</span>
                    <span className="ml-auto text-slate-500">&nearr;</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Box */}
          <div className="lg:col-span-7 rounded-2xl bg-cyber-card/75 border border-cyber-border p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-1">Transmit an Inquiry</h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Messages are saved directly and trigger immediate notification.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Hunter"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cyber-surface border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                    Your Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cyber-surface border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-msg" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                  Message Details *
                </label>
                <textarea
                  id="contact-msg"
                  required
                  rows={4}
                  placeholder="Tell me about the project, team, or opportunity..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-cyber-surface border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-colors resize-none"
                />
              </div>

              {status.state !== 'idle' && (
                <div
                  className={`p-3 rounded-xl text-xs sm:text-sm font-medium ${
                    status.state === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : status.state === 'error'
                      ? 'bg-red-500/15 border border-red-500/40 text-red-300'
                      : 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan'
                  }`}
                >
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={status.state === 'sending'}
                className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg hover:opacity-95 hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] disabled:opacity-50 transition-all cursor-pointer"
              >
                {status.state === 'sending' ? 'Transmitting...' : 'Send Message 🚀'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
