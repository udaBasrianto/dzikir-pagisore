import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];
export type UserRole = AppRole | 'anonymous';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('anonymous');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async (uid: string) => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', uid)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user');
        } else if (data) {
          setRole(data.role);
        } else {
          setRole('user');
        }
      } catch (err) {
        console.error('Error in fetchRole:', err);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchRole(session.user.id);
      } else {
        setRole('anonymous');
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setTimeout(() => fetchRole(session.user.id), 0);
      } else {
        setUserId(null);
        setRole('anonymous');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = role === 'admin';

  return { role, loading, isAdmin, userId };
};
