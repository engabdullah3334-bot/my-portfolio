import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const BUCKET_IMAGES = 'project-images';
export const BUCKET_DOCS = 'documents';

/* Session lives in cookies (SameSite=Strict, Secure on https), split in chunks to stay under the 4KB cookie limit. */
const CHUNK = 1500;
const opts = () => `; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict${typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : ''}`;
const read = n => {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.split('; ').find(c => c.startsWith(n + '='));
  return m ? decodeURIComponent(m.slice(n.length + 1)) : null;
};
const wipe = n => {
  if (typeof document === 'undefined') return;
  document.cookie = `${n}=; path=/; max-age=0; SameSite=Strict`;
};

const cookieStorage = {
  getItem(k) {
    const n = Number(read(`${k}.n`));
    if (!n) return null;
    let s = '';
    for (let i = 0; i < n; i++) {
      const p = read(`${k}.${i}`);
      if (p == null) return null;
      s += p;
    }
    return s;
  },
  setItem(k, v) {
    this.removeItem(k);
    const parts = v.match(new RegExp(`.{1,${CHUNK}}`, 'gs')) || [];
    document.cookie = `${k}.n=${parts.length}${opts()}`;
    parts.forEach((p, i) => {
      document.cookie = `${k}.${i}=${encodeURIComponent(p)}${opts()}`;
    });
  },
  removeItem(k) {
    const n = Number(read(`${k}.n`)) || 0;
    for (let i = 0; i < n; i++) wipe(`${k}.${i}`);
    wipe(`${k}.n`);
  },
};

export const isConfigured = Boolean(url && key && !url.includes('YOUR-PROJECT'));

export const supabase = isConfigured
  ? createClient(url, key, {
      auth: {
        storage: cookieStorage,
        storageKey: 'aa-session',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const imageUrl = (path, bucket = BUCKET_IMAGES) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (!supabase) return path;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};

export const isHttps = u => {
  try {
    return new URL(String(u).trim()).protocol === 'https:';
  } catch {
    return false;
  }
};
