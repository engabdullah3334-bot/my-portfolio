import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isConfigured } from '../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!isConfigured || !supabase) {
      setErrorMsg('Supabase is not configured yet. Please add your credentials in .env.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (!data?.user) {
        throw new Error('Authentication failed.');
      }

      // Check if user is registered in admins table
      const { data: ok, error: adminErr } = await supabase.rpc('is_admin');
      if (adminErr || ok !== true) {
        await supabase.auth.signOut();
        setErrorMsg('Access denied. This user account does not have administrator privileges.');
        setLoading(false);
        return;
      }

      navigate('/admin_add', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials or connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0e12] border border-white/[0.08] shadow-2xl relative z-10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black text-lg shadow-sm">
            🔐
          </div>
          <h1 className="text-2xl font-black text-white">System Administration</h1>
          <p className="text-xs font-mono text-slate-400">
            Sign in to manage portfolio projects & inquiries
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl text-xs font-medium bg-red-500/15 border border-red-500/40 text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@domain.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#14171d] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#14171d] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide bg-white text-zinc-950 hover:bg-slate-200 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In To Console'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            &larr; Return to Portfolio Home
          </Link>
        </div>

      </div>
    </div>
  );
}
