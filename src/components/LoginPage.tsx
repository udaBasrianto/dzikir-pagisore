import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { signInGoogle, signInAnonymous } = useAuth();
  const [loading, setLoading] = useState(false);

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
            <CardTitle className="text-center">Pilih cara masuk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 text-base"
              variant="default"
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

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">atau</span>
              </div>
            </div>

            {/* Anonymous Sign In */}
            <Button
              onClick={handleAnonymousSignIn}
              disabled={loading}
              className="w-full h-12 text-base"
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
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Login dengan Google:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Sinkronisasi progress antar perangkat</li>
                <li>Backup data otomatis</li>
                <li>Akses fitur premium</li>
              </ul>
              <p className="mt-3"><strong>Sebagai Tamu:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Akses langsung tanpa registrasi</li>
                <li>Data tersimpan lokal</li>
                <li>Fitur dasar tersedia</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};