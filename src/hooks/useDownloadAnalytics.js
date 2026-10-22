import { useState, useCallback, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';

const STORAGE_KEY = 'aa_cv_downloads';

export function useDownloadAnalytics() {
  const [downloadCount, setDownloadCount] = useState(0);
  const [justDownloaded, setJustDownloaded] = useState(false);

  useEffect(() => {
    // 1. Read local storage first for instant feedback
    const local = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    setDownloadCount(local);

    // 2. Fetch live global count from Supabase if configured
    if (isConfigured && supabase) {
      supabase
        .from('site_metrics')
        .select('value')
        .eq('key', 'cv_downloads')
        .maybeSingle()
        .then(({ data }) => {
          if (data?.value != null) {
            setDownloadCount(Number(data.value));
          }
        });
    }
  }, []);

  const trackDownload = useCallback(async () => {
    // Optimistic UI update
    setDownloadCount(prev => {
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });

    setJustDownloaded(true);
    setTimeout(() => setJustDownloaded(false), 2800);

    // Atomic increment via Supabase RPC if available
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('increment_cv_download');
        if (!error && data != null) {
          setDownloadCount(Number(data));
        }
      } catch (err) {
        console.warn('Could not increment remote CV download count:', err);
      }
    }
  }, []);

  return { downloadCount, trackDownload, justDownloaded };
}
