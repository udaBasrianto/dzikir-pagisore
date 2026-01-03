import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Moon, Star, Sparkles, User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

// Animated floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
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
          <Star 
            className="text-primary/20" 
            size={8 + Math.random() * 12} 
          />
        </div>
      ))}
    </div>
  );
};

// Islamic pattern decoration
const IslamicPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path 
            d="M10 0L20 10L10 20L0 10Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5"
            className="text-primary"
          />
          <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
    </div>
  );
};

// Mosque silhouette illustration
const MosqueIllustration = () => {
  return (
    <div className="relative w-full h-32 mb-6">
      <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="mosqueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <rect width="400" height="120" fill="url(#skyGradient)" rx="12" />
        
        {/* Moon */}
        <circle cx="340" cy="30" r="15" fill="hsl(var(--primary))" opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
        
        {/* Stars */}
        <g className="animate-pulse">
          <circle cx="50" cy="25" r="1.5" fill="hsl(var(--primary))" opacity="0.6" />
          <circle cx="100" cy="15" r="1" fill="hsl(var(--primary))" opacity="0.5" />
          <circle cx="280" cy="20" r="1.5" fill="hsl(var(--primary))" opacity="0.6" />
          <circle cx="320" cy="45" r="1" fill="hsl(var(--primary))" opacity="0.4" />
          <circle cx="70" cy="40" r="1" fill="hsl(var(--primary))" opacity="0.5" />
        </g>
        
        {/* Main Dome */}
        <ellipse cx="200" cy="75" rx="45" ry="30" fill="url(#mosqueGradient)" />
        <rect x="155" y="75" width="90" height="45" fill="url(#mosqueGradient)" />
        
        {/* Crescent on dome */}
        <g transform="translate(200, 40)">
          <circle cx="0" cy="0" r="6" fill="hsl(var(--primary-foreground))" />
          <circle cx="2" cy="-1" r="5" fill="hsl(var(--primary))" />
        </g>
        
        {/* Left Minaret */}
        <rect x="120" y="50" width="15" height="70" fill="url(#mosqueGradient)" />
        <ellipse cx="127.5" cy="50" rx="7.5" ry="5" fill="url(#mosqueGradient)" />
        <circle cx="127.5" cy="42" r="3" fill="hsl(var(--primary-foreground))" opacity="0.8" />
        
        {/* Right Minaret */}
        <rect x="265" y="50" width="15" height="70" fill="url(#mosqueGradient)" />
        <ellipse cx="272.5" cy="50" rx="7.5" ry="5" fill="url(#mosqueGradient)" />
        <circle cx="272.5" cy="42" r="3" fill="hsl(var(--primary-foreground))" opacity="0.8" />
        
        {/* Windows */}
        <rect x="175" y="90" width="12" height="20" rx="6" fill="hsl(var(--primary-foreground))" opacity="0.3" />
        <rect x="195" y="85" width="10" height="25" rx="5" fill="hsl(var(--primary-foreground))" opacity="0.4" />
        <rect x="213" y="90" width="12" height="20" rx="6" fill="hsl(var(--primary-foreground))" opacity="0.3" />
        
        {/* Small domes */}
        <ellipse cx="145" cy="85" rx="20" ry="15" fill="url(#mosqueGradient)" />
        <ellipse cx="255" cy="85" rx="20" ry="15" fill="url(#mosqueGradient)" />
      </svg>
    </div>
  );
};

// Feature item component
const FeatureItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-3 text-sm text-muted-foreground">
    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon className="w-3 h-3 text-primary" />
    </div>
    <span>{text}</span>
  </div>
);

export const LoginPage: React.FC = () => {
  const { signInGoogle, signInAnonymous, signInEmail, signUpEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

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
      toast.success('Registrasi berhasil! Selamat datang 🎉');
    } catch (error: any) {
      toast.error(error.message || 'Gagal registrasi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingParticles />
      <IslamicPattern />
      
      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Animated Header */}
        <div className="text-center animate-fade-in">
          <MosqueIllustration />
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <Moon className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Panduan Dzikir
            </h1>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          
          <p className="text-muted-foreground">
            Aplikasi dzikir pagi dan petang sesuai sunnah
          </p>
        </div>

        {/* Main Card with Animation */}
        <Card className="animate-scale-in backdrop-blur-sm bg-card/95 border-primary/20 shadow-xl shadow-primary/5">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  Masuk
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  Daftar Baru
                </TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 animate-fade-in">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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
                    className="w-full group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Memproses...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Masuk
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground">atau lanjut dengan</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    variant="outline"
                    className="transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>

                  <Button
                    onClick={handleAnonymousSignIn}
                    disabled={loading}
                    variant="outline"
                    className="transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                  >
                    <User className="w-5 h-5 mr-2 text-muted-foreground" />
                    Tamu
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4 animate-fade-in">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Nama Lengkap
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Nama Anda"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={loading}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 6 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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
                    <Label htmlFor="register-confirm" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Konfirmasi Password
                    </Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Ulangi password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Memproses...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Daftar Sekarang
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Benefits section for registration */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Keuntungan mendaftar:
                  </p>
                  <div className="space-y-2">
                    <FeatureItem icon={Check} text="Sinkronisasi progress antar perangkat" />
                    <FeatureItem icon={Check} text="Backup data otomatis ke cloud" />
                    <FeatureItem icon={Check} text="Ikuti tantangan & raih achievement" />
                    <FeatureItem icon={Check} text="Lihat statistik dzikir lengkap" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer quote */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-muted-foreground italic">
            "Ingatlah Allah, niscaya Dia akan mengingatmu"
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">- QS. Al-Baqarah: 152</p>
        </div>
      </div>
    </div>
  );
};
