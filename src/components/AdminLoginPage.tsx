import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle, Sparkles, UserPlus } from 'lucide-react';
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

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'setup'>('login');
  const [needsSetup, setNeedsSetup] = useState(false);

  // Check if already logged in as admin
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Check if user is admin
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('role')
            .eq('email', session.user.email)
            .maybeSingle();

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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Defer admin check to avoid deadlock
        setTimeout(async () => {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('role')
            .eq('email', session.user.email)
            .maybeSingle();

          if (adminData) {
            navigate('/admin-dashboard');
          }
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Check if admin needs setup (no supabase_user_id yet)
  const checkAdminNeedsSetup = async (adminEmail: string) => {
    const { data } = await supabase
      .from('admin_users')
      .select('supabase_user_id')
      .eq('email', adminEmail.toLowerCase().trim())
      .maybeSingle();

    const linkedId = data?.supabase_user_id ?? '';
    return !linkedId || !isUuid(linkedId);
  };

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
        .select('id, email, role, supabase_user_id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (adminError || !adminData) {
        setError('Email tidak terdaftar sebagai admin');
        setLoading(false);
        return;
      }

      const linkedId = adminData.supabase_user_id ?? '';
      const needsActivation = !linkedId || !isUuid(linkedId);

      // Try to sign in with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          if (needsActivation) {
            setNeedsSetup(true);
            setActiveTab('setup');
            setError('Akun admin belum diaktivasi. Silakan buat password terlebih dahulu.');
          } else {
            setError('Password salah');
          }
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (authData.user) {
        if (needsActivation) {
          await supabase
            .from('admin_users')
            .update({ supabase_user_id: authData.user.id })
            .eq('email', email.toLowerCase().trim());
        }

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

  const handleAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      // Check if email is registered as admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, role, supabase_user_id')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (adminError || !adminData) {
        setError('Email tidak terdaftar sebagai admin');
        setLoading(false);
        return;
      }

      // Check if already has supabase account
      const linkedId = adminData.supabase_user_id ?? '';
      if (linkedId && isUuid(linkedId)) {
        setError('Akun sudah diaktivasi. Silakan login dengan password Anda.');
        setActiveTab('login');
        setLoading(false);
        return;
      }

      // Sign up with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin-dashboard`
        }
      });

      if (signUpError) {
        // If user already exists but not linked, try to sign in
        if (signUpError.message.includes('already registered')) {
          setError('Email sudah terdaftar di sistem auth. Silakan login.');
          setActiveTab('login');
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (signUpData.user) {
        // Update admin_users with Supabase user id
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ supabase_user_id: signUpData.user.id })
          .eq('email', email.toLowerCase().trim());

        if (updateError) {
          console.error('Error updating admin user:', updateError);
        }

        toast.success('Akun admin berhasil diaktivasi!');
        
        // If auto-confirm is enabled, user is already signed in
        if (signUpData.session) {
          navigate('/admin-dashboard');
        } else {
          toast.info('Silakan cek email untuk konfirmasi, atau login langsung.');
          setActiveTab('login');
        }
      }
    } catch (err: any) {
      console.error('Admin setup error:', err);
      setError(err.message || 'Terjadi kesalahan saat setup');
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
              {activeTab === 'login' ? 'Masuk untuk mengelola aplikasi Dzikir' : 'Aktivasi akun admin baru'}
            </p>
          </CardHeader>
          
          <CardContent className="p-6 pt-4">
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2 animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as 'login' | 'setup'); setError(''); }}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="setup" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Setup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
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
              </TabsContent>

              <TabsContent value="setup">
                <form onSubmit={handleAdminSetup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="setup-email" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="w-4 h-4 text-primary" />
                      Email Admin
                    </Label>
                    <Input
                      id="setup-email"
                      type="email"
                      placeholder="admin@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background/50"
                      autoComplete="email"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email harus sudah terdaftar di tabel admin_users
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setup-password" className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="w-4 h-4 text-primary" />
                      Buat Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="setup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 6 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background/50"
                        autoComplete="new-password"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="w-4 h-4 text-primary" />
                      Konfirmasi Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ulangi password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background/50"
                      autoComplete="new-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 mt-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Mengaktivasi...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Aktivasi Akun Admin
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Hanya admin terdaftar yang dapat mengakses panel ini.
                <br />
                {activeTab === 'setup' ? 'Email harus sudah ada di database admin.' : 'Hubungi superadmin jika membutuhkan akses.'}
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
