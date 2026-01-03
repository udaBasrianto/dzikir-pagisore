import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Animated shield icon
const AnimatedShield = () => (
  <div className="relative w-24 h-24 mx-auto mb-6">
    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
    <div className="absolute inset-2 bg-primary/30 rounded-full animate-pulse" />
    <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg shadow-primary/30">
      <Shield className="w-10 h-10 text-primary-foreground" />
    </div>
  </div>
);

// Floating particles
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 10}s`,
        }}
      >
        <Sparkles className="text-primary/10" size={8 + Math.random() * 8} />
      </div>
    ))}
  </div>
);

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in as admin
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if user is admin
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('role')
            .eq('email', session.user.email)
            .single();
          
          if (adminData) {
            navigate('/admin-dashboard');
            return;
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkExistingSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Verify admin status
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('role')
          .eq('email', session.user.email)
          .single();
        
        if (adminData) {
          navigate('/admin-dashboard');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    setLoading(true);

    try {
      // First check if email is registered as admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, role')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (adminError || !adminData) {
        setError('Email tidak terdaftar sebagai admin');
        setLoading(false);
        return;
      }

      // Try to sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (authError) {
        // If user doesn't exist in auth, we need to create them first
        if (authError.message.includes('Invalid login credentials')) {
          setError('Password salah atau akun belum diaktivasi. Hubungi superadmin.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Update admin_users with Supabase user id
        await supabase
          .from('admin_users')
          .update({ firebase_uid: authData.user.id })
          .eq('email', email.toLowerCase().trim());

        toast.success('Login admin berhasil!');
        navigate('/admin-dashboard');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="max-w-md w-full relative z-10">
        <Card className="backdrop-blur-sm bg-card/95 border-primary/20 shadow-2xl shadow-primary/10 animate-scale-in">
          <CardHeader className="text-center pb-2">
            <AnimatedShield />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Admin Panel
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Masuk untuk mengelola aplikasi Dzikir
            </p>
          </CardHeader>
          
          <CardContent className="p-6 pt-4">
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2 animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Admin
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background/50"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background/50"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Memverifikasi...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Masuk sebagai Admin
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Hanya admin terdaftar yang dapat mengakses panel ini.
                <br />
                Hubungi superadmin jika membutuhkan akses.
              </p>
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/')}
            >
              ← Kembali ke Halaman Utama
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
