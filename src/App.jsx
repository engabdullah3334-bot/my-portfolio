import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { supabase, isConfigured } from './lib/supabase';
import Home from './pages/Home';

// Lazy loaded routes: Admin code is kept in separate chunks to maximize visitor performance
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

function useAdminStatus() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'admin' | 'guest'

  useEffect(() => {
    let alive = true;
    const set = s => alive && setStatus(s);

    (async () => {
      if (!isConfigured || !supabase) return set('guest');
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return set('guest');
      const { data: ok } = await supabase.rpc('is_admin');
      set(ok === true ? 'admin' : 'guest');
    })();

    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange(ev => {
      if (ev === 'SIGNED_OUT') set('guest');
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  return status;
}

// Protected route for logged in admin only
function AdminGate() {
  const s = useAdminStatus();
  if (s === 'loading') {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
      </div>
    );
  }
  return s === 'admin' ? <AdminDashboard /> : <Navigate to="/admin_add/login" replace />;
}

// Login Gate: redirects to admin dashboard if already logged in
function LoginGate() {
  const s = useAdminStatus();
  if (s === 'loading') return null;
  return s === 'admin' ? <Navigate to="/admin_add" replace /> : <AdminLogin />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/admin_add" element={<AdminGate />} />
          <Route path="/admin_add/login" element={<LoginGate />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
