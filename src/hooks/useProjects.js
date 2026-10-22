import { useEffect, useState, useCallback } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { FALLBACK_PROJECTS } from '../data/fallbackProjects';

export function useProjects(options = { adminMode: false }) {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!isConfigured || !supabase) {
      setProjects(FALLBACK_PROJECTS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!options.adminMode) {
        query = query.eq('published', true);
      }

      const { data, error: err } = await query;

      if (err) throw err;

      if (data && data.length > 0) {
        setProjects(data);
      } else if (!options.adminMode) {
        setProjects(FALLBACK_PROJECTS);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.warn('Error fetching Supabase projects, using fallback:', err);
      setError(err);
      if (!options.adminMode) {
        setProjects(FALLBACK_PROJECTS);
      }
    } finally {
      setLoading(false);
    }
  }, [options.adminMode]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refresh: fetchProjects };
}
