import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Download, BookOpen } from 'lucide-react';
import { useGlobalCounter } from '@/hooks/useGlobalCounter';

export const GlobalStats = () => {
  const { stats, isOnline } = useGlobalCounter();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        📊 Statistik Global
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Total Dzikir Dibaca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(stats.totalReads)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              oleh semua pengguna
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              App Terinstall
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(stats.appInstalls)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              perangkat aktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Pengguna Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(stats.activeUsers)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              hari ini
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground text-center mt-4 p-3 bg-muted/50 rounded-lg">
        ✨ Bergabunglah dengan ribuan muslim lainnya dalam mengamalkan dzikir harian
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-xs">{isOnline ? 'Data Real-time' : 'Mode Offline'}</span>
        </div>
      </div>
    </div>
  );
};