import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminDashboard } from '@/components/AdminDashboard';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast.error('Silakan login terlebih dahulu');
          navigate('/admin-login');
          return;
        }

        // Verify admin status from database
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('id, email, role')
          .eq('email', session.user.email)
          .single();

        if (error || !adminData) {
          toast.error('Anda tidak memiliki akses admin');
          await supabase.auth.signOut();
          navigate('/admin-login');
          return;
        }

        setAdminUser(adminData);
      } catch (err) {
        console.error('Error checking admin access:', err);
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/admin-login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Berhasil logout');
    navigate('/admin-login');
  };

  const handleClose = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="relative flex items-center justify-center w-16 h-16 bg-primary rounded-full">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <p className="text-muted-foreground animate-pulse">Memverifikasi akses admin...</p>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">{adminUser.email} • {adminUser.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-4">
        <AdminDashboard onClose={handleClose} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
