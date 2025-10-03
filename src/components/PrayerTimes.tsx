import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, RefreshCw, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrayerTimesData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export const PrayerTimes: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string>('');
  const { toast } = useToast();

  const fetchPrayerTimes = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lon}&method=2`
      );
      
      if (!response.ok) throw new Error('Failed to fetch prayer times');
      
      const data = await response.json();
      
      setPrayerTimes(data.data.timings);
      setLocation({
        city: data.data.meta.timezone.split('/')[1] || 'Unknown',
        country: data.data.meta.timezone.split('/')[0] || 'Unknown',
        latitude: lat,
        longitude: lon
      });
      setDate(data.data.date.readable);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengambil jadwal sholat',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation tidak didukung oleh browser Anda',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.',
          variant: 'destructive'
        });
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const prayerNames = [
    { key: 'Fajr', name: 'Subuh', icon: '🌅' },
    { key: 'Dhuhr', name: 'Dzuhur', icon: '☀️' },
    { key: 'Asr', name: 'Ashar', icon: '🌤️' },
    { key: 'Maghrib', name: 'Maghrib', icon: '🌆' },
    { key: 'Isha', name: 'Isya', icon: '🌙' }
  ];

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const times = prayerNames.map(prayer => {
      const [hours, minutes] = prayerTimes[prayer.key as keyof PrayerTimesData].split(':');
      return {
        name: prayer.name,
        time: parseInt(hours) * 60 + parseInt(minutes)
      };
    });
    
    for (let i = 0; i < times.length; i++) {
      if (currentTime < times[i].time) {
        return times[i].name;
      }
    }
    
    return times[0].name;
  };

  const nextPrayer = getCurrentPrayer();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Jadwal Sholat</h1>
        <p className="text-muted-foreground">Waktu sholat akurat untuk hari ini</p>
        {date && <p className="text-sm text-muted-foreground">{date}</p>}
      </div>

      {/* Location Card */}
      {location && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{location.city}</p>
                <p className="text-sm text-muted-foreground">{location.country}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={getUserLocation}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </Card>
      )}

      {/* Next Prayer Alert */}
      {nextPrayer && (
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Sholat berikutnya</p>
              <p className="text-lg font-bold text-foreground">{nextPrayer}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Prayer Times List */}
      {loading && !prayerTimes ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
          <p className="text-muted-foreground">Memuat jadwal sholat...</p>
        </div>
      ) : prayerTimes ? (
        <div className="space-y-3">
          {prayerNames.map((prayer) => {
            const isNext = prayer.name === nextPrayer;
            return (
              <Card
                key={prayer.key}
                className={`p-4 transition-all ${
                  isNext
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{prayer.icon}</span>
                    <div>
                      <p className={`font-semibold ${isNext ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {prayer.name}
                      </p>
                      {isNext && (
                        <p className="text-xs text-primary-foreground/80">Sholat berikutnya</p>
                      )}
                    </div>
                  </div>
                  <p className={`text-2xl font-bold ${isNext ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {prayerTimes[prayer.key as keyof PrayerTimesData]}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Izinkan akses lokasi untuk melihat jadwal sholat
          </p>
          <Button onClick={getUserLocation}>
            <MapPin className="w-4 h-4 mr-2" />
            Aktifkan Lokasi
          </Button>
        </Card>
      )}
    </div>
  );
};
