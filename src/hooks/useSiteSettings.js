import { useState, useEffect, useCallback } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { DEFAULT_SITE_SETTINGS } from '../data/defaultSiteSettings';

const STORAGE_KEY = 'aa_site_settings';

export function useSiteSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) };
      }
    } catch {
      /* ignore JSON parse errors */
    }
    return DEFAULT_SITE_SETTINGS;
  });
  const [loading, setLoading] = useState(true);

  const fetchRemote = useCallback(async () => {
    if (!isConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', 'global')
        .maybeSingle();

      if (!error && data?.data) {
        const merged = { ...DEFAULT_SITE_SETTINGS, ...data.data };
        setSettings(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Could not fetch remote site settings, using local:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRemote();
  }, [fetchRemote]);

  const updateSettings = useCallback(async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (isConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            id: 'global',
            data: updated,
            updated_at: new Date().toISOString(),
          });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to commit settings to Supabase:', err);
        throw err;
      }
    }
  }, [settings]);

  return { settings, loading, updateSettings, refreshSettings: fetchRemote };
}
