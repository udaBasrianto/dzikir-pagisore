import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { signInGoogle, signInAnonymous, signInEmail, signUpEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInGoogle();
      toast.success('Berhasil masuk dengan Google!');
    } catch (error) {
      toast.error('Gagal masuk dengan Google');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setLoading(true);
      await signInAnonymous();
      toast.success('Masuk sebagai tamu');
    } catch (error) {
      toast.error('Gagal masuk sebagai tamu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email dan password harus diisi');
      return;
    }
    try {
      setLoading(true);
      await signInEmail(email, password);
      toast.success('Berhasil masuk!');
    } catch (error: any) {
      toast.error(error.message || 'Gagal masuk dengan email');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      toast.error('Semua field harus diisi');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Password tidak sama');
      return;
    }
    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    try {
      setLoading(true);
      await signUpEmail(email, password, displayName);
      toast.success('Registrasi berhasil!');
    } catch (error: any) {
      toast.error(error.message || 'Gagal registrasi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🤲 Panduan Dzikir
          </h1>
          <p className="text-muted-foreground">
            Aplikasi dzikir pagi dan petang sesuai sunnah
          </p>
        </div>

        {/* Login Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Masuk ke Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">atau</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Masuk dengan Google
                  </div>
                </Button>

                <Button
                  onClick={handleAnonymousSignIn}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Lanjut sebagai Tamu
                  </div>
                </Button>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nama Lengkap</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Nama Anda"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Konfirmasi Password</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Ulangi password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Memproses...' : 'Daftar'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Login dengan Akun:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Sinkronisasi progress antar perangkat</li>
                <li>Backup data otomatis ke cloud</li>
                <li>Akses dari berbagai perangkat</li>
                <li>Data aman dan tersimpan permanen</li>
              </ul>
              <p className="mt-3"><strong>Sebagai Tamu:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Akses langsung tanpa registrasi</li>
                <li>Data tersimpan lokal di perangkat</li>
                <li>Tidak perlu email atau password</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};