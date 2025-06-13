import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  onClose?: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [morningTime, setMorningTime] = useState('06:00');
  const [eveningTime, setEveningTime] = useState('18:00');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('dzikir-notifications');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setNotificationsEnabled(settings.enabled || false);
      setMorningTime(settings.morningTime || '06:00');
      setEveningTime(settings.eveningTime || '18:00');
      setSoundEnabled(settings.soundEnabled !== false);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast({
          title: "Notifikasi Diaktifkan",
          description: "Anda akan menerima pengingat dzikir pagi dan petang.",
        });
        saveSettings(true);
      } else {
        toast({
          title: "Izin Ditolak",
          description: "Silakan aktifkan notifikasi di pengaturan browser.",
          variant: "destructive",
        });
      }
    }
  };

  const saveSettings = (enabled: boolean = notificationsEnabled) => {
    const settings = {
      enabled,
      morningTime,
      eveningTime,
      soundEnabled
    };
    localStorage.setItem('dzikir-notifications', JSON.stringify(settings));
    
    if (enabled) {
      scheduleNotifications();
    }
  };

  const scheduleNotifications = () => {
    // This is a simplified version - in a real app you'd use a service worker
    const now = new Date();
    const [morningHour, morningMinute] = morningTime.split(':').map(Number);
    const [eveningHour, eveningMinute] = eveningTime.split(':').map(Number);

    // Schedule morning notification
    const morningDate = new Date();
    morningDate.setHours(morningHour, morningMinute, 0, 0);
    if (morningDate <= now) {
      morningDate.setDate(morningDate.getDate() + 1);
    }

    // Schedule evening notification
    const eveningDate = new Date();
    eveningDate.setHours(eveningHour, eveningMinute, 0, 0);
    if (eveningDate <= now) {
      eveningDate.setDate(eveningDate.getDate() + 1);
    }

    toast({
      title: "Pengingat Dijadwalkan",
      description: `Dzikir pagi: ${morningTime}, Dzikir petang: ${eveningTime}`,
    });
  };

  const handleToggleNotifications = () => {
    if (!notificationsEnabled) {
      requestNotificationPermission();
    } else {
      setNotificationsEnabled(false);
      saveSettings(false);
      toast({
        title: "Notifikasi Dinonaktifkan",
        description: "Pengingat dzikir telah dimatikan.",
      });
    }
  };

  const handleTimeChange = (type: 'morning' | 'evening', value: string) => {
    if (type === 'morning') {
      setMorningTime(value);
    } else {
      setEveningTime(value);
    }
  };

  const handleSaveSettings = () => {
    saveSettings();
    toast({
      title: "Pengaturan Disimpan",
      description: "Waktu pengingat telah diperbarui.",
    });
    if (onClose) onClose();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Pengaturan Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Aktifkan Pengingat</p>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi untuk dzikir pagi dan petang
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
            />
          </div>

          {notificationsEnabled && (
            <>
              {/* Morning Time */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4" />
                  Waktu Dzikir Pagi
                </label>
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => handleTimeChange('morning', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              {/* Evening Time */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4" />
                  Waktu Dzikir Petang
                </label>
                <input
                  type="time"
                  value={eveningTime}
                  onChange={(e) => handleTimeChange('evening', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 font-medium">
                    <Volume2 className="w-4 h-4" />
                    Suara Notifikasi
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Putar suara saat notifikasi muncul
                  </p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              <Button onClick={handleSaveSettings} className="w-full">
                Simpan Pengaturan
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};