import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Home, Book, Settings, Info, Heart, Bell, Palette, Volume2, Database, Bot, CalendarDays } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { NotificationSettings } from '@/components/NotificationSettings';
import { AudioSettings } from '@/components/AudioSettings';
import { GlobalStats } from '@/components/GlobalStats';

interface MenuPageProps {
  onNavigate: (tab: string) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const menuItems = [
    {
      id: 'pagi',
      title: 'Dzikir Pagi',
      description: 'Dzikir dan doa untuk memulai hari',
      icon: Clock,
      color: 'text-orange-500'
    },
    {
      id: 'petang',
      title: 'Dzikir Petang',
      description: 'Dzikir dan doa untuk mengakhiri hari',
      icon: Home,
      color: 'text-blue-500'
    },
    {
      id: 'sholat',
      title: 'Dzikir Setelah Sholat',
      description: 'Dzikir dan doa setelah sholat fardhu',
      icon: Book,
      color: 'text-teal-500'
    },
    {
      id: 'prayer-times',
      title: '🕌 Jadwal Sholat',
      description: 'Lihat waktu sholat berdasarkan lokasi Anda',
      icon: CalendarDays,
      color: 'text-emerald-500'
    },
    {
      id: 'ai',
      title: '🤖 AI Assistant',
      description: 'Tanya jawab tentang dzikir dan doa',
      icon: Bot,
      color: 'text-violet-500'
    },
    {
      id: 'progress',
      title: 'Progress Harian',
      description: 'Pantau kemajuan dzikir Anda',
      icon: Book,
      color: 'text-green-500'
    },
    {
      id: 'gamification',
      title: '⭐ Gamifikasi',
      description: 'Achievement, level, dan leaderboard',
      icon: Settings,
      color: 'text-purple-500'
    },
    {
      id: 'statistik',
      title: '📊 Statistik Dzikir',
      description: 'Lihat detail aktivitas dan progress dzikir',
      icon: Book,
      color: 'text-blue-600'
    },
    {
      id: 'crud',
      title: '🗂️ Kelola Dzikir',
      description: 'Tambah, edit, atau hapus konten dzikir',
      icon: Database,
      color: 'text-indigo-600'
    }
  ];

  const settingsItems = [
    {
      title: 'Pengaturan Audio',
      description: 'Setup ElevenLabs AI untuk pronunciation Arabic terbaik',
      icon: Volume2,
      color: 'text-green-500',
      action: () => setShowAudioSettings(true)
    },
    {
      title: 'Pengaturan Notifikasi',
      description: 'Atur pengingat dzikir pagi dan petang',
      icon: Bell,
      color: 'text-blue-500',
      action: () => setShowNotifications(true)
    },
    {
      title: 'Tema Aplikasi',
      description: 'Pilih tema terang, gelap, atau otomatis',
      icon: Palette,
      color: 'text-purple-500',
      component: <ThemeToggle />
    },
    {
      title: 'Kustomisasi Tema',
      description: 'Ubah warna dan font aplikasi',
      icon: Palette,
      color: 'text-pink-500',
      action: () => setShowThemeCustomizer(true)
    }
  ];

  const aboutItems = [
    {
      title: 'Tentang Aplikasi',
      description: 'Aplikasi panduan dzikir pagi dan petang sesuai sunnah',
      icon: Info,
      color: 'text-purple-500'
    },
    {
      title: 'Manfaat Dzikir',
      description: 'Keutamaan dan hikmah membaca dzikir harian',
      icon: Heart,
      color: 'text-red-500'
    }
  ];

  if (showNotifications) {
    return <NotificationSettings onClose={() => setShowNotifications(false)} />;
  }

  if (showAudioSettings) {
    return <AudioSettings onClose={() => setShowAudioSettings(false)} />;
  }

  if (showThemeCustomizer) {
    return <ThemeCustomizer onClose={() => setShowThemeCustomizer(false)} />;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Panduan Dzikir
        </h1>
        <p className="text-muted-foreground">
          Aplikasi dzikir pagi dan petang sesuai sunnah
        </p>
      </div>

      {/* Main Menu */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Menu Utama</h2>
        <div className="grid gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.id} className="cursor-pointer transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-0 justify-start"
                    onClick={() => onNavigate(item.id)}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className={`p-3 rounded-lg bg-muted ${item.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Pengaturan</h2>
        <div className="grid gap-4">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className={item.action ? "cursor-pointer hover:shadow-md transition-all" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-lg bg-muted ${item.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {item.component && (
                      <div className="ml-4">
                        {item.component}
                      </div>
                    )}
                    {item.action && (
                      <Button variant="outline" size="sm" onClick={item.action} className="ml-4">
                        <Settings className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Informasi</h2>
        <div className="grid gap-4">
          {aboutItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-muted ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* App Info */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <CardTitle className="text-center text-lg">
            🤲 Panduan Dzikir Harian
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Aplikasi ini membantu Anda untuk melakukan dzikir pagi dan petang 
            sesuai dengan sunnah Rasulullah ﷺ
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>"Dan ingatlah Allah, baik di waktu pagi maupun petang"</p>
            <p className="italic">- QS. Al-Kahf: 28</p>
          </div>
        </CardContent>
      </Card>

      {/* Global Statistics */}
      <GlobalStats />

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Fitur Aplikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Dzikir lengkap dengan teks Arab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Audio pronunciation dzikir</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Transliterasi dan terjemahan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Reminder notification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Counter otomatis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Streak tracking & achievements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Weekly progress analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Dark/Light theme toggle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Desain mobile-friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Sesuai sunnah Rasulullah ﷺ</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};