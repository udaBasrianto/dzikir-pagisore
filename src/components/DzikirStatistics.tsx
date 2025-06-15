import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, RotateCcw, Calendar, TrendingUp } from 'lucide-react';

interface DzikirStats {
  id: number;
  title: string;
  totalViews: number;
  totalReads: number;
  lastRead: Date | null;
}

export const DzikirStatistics: React.FC = () => {
  const getDzikirStats = (): DzikirStats[] => {
    const stats: DzikirStats[] = [];
    
    // Get stats from localStorage for all dzikir
    for (let i = 1; i <= 50; i++) {
      const countData = localStorage.getItem(`dzikir-count-${i}`);
      const viewsData = localStorage.getItem(`dzikir-views-${i}`);
      
      if (countData || viewsData) {
        let title = `Dzikir ${i}`;
        let totalReads = 0;
        let lastRead = null;
        let totalViews = parseInt(viewsData || '0');
        
        if (countData) {
          try {
            const parsed = JSON.parse(countData);
            totalReads = parsed.count || 0;
            lastRead = parsed.lastRead ? new Date(parsed.lastRead) : null;
          } catch (error) {
            console.error('Error parsing dzikir stats:', error);
          }
        }
        
        // Try to get dzikir title from data
        const dzikirData = JSON.parse(localStorage.getItem('dzikir-data') || '[]');
        const dzikir = dzikirData.find((d: any) => d.id === i);
        if (dzikir) {
          title = dzikir.title;
        }
        
        stats.push({
          id: i,
          title,
          totalViews,
          totalReads,
          lastRead
        });
      }
    }
    
    return stats.sort((a, b) => (b.totalViews + b.totalReads) - (a.totalViews + a.totalReads));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('id-ID', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const clearAllStats = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua statistik dzikir?')) {
      // Clear all dzikir stats
      for (let i = 1; i <= 100; i++) {
        localStorage.removeItem(`dzikir-count-${i}`);
        localStorage.removeItem(`dzikir-views-${i}`);
      }
      window.location.reload();
    }
  };

  const stats = getDzikirStats();
  const totalViews = stats.reduce((sum, stat) => sum + stat.totalViews, 0);
  const totalReads = stats.reduce((sum, stat) => sum + stat.totalReads, 0);
  const mostReadDzikir = stats.find(s => s.totalReads > 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          📊 Statistik Dzikir
        </h1>
        <p className="text-muted-foreground">
          Pantau aktivitas dan progress dzikir Anda
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Views</span>
            </div>
            <div className="text-2xl font-bold text-primary">{totalViews}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Total Baca</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{totalReads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Most Active */}
      {mostReadDzikir && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🏆 Dzikir Terfavorit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{mostReadDzikir.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {mostReadDzikir.totalReads} kali dibaca • {mostReadDzikir.totalViews} views
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                Terakhir: {formatDate(mostReadDzikir.lastRead)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Stats */}
      {stats.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Detail Statistik</CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearAllStats}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset Semua
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{stat.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {stat.totalViews}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.totalReads}
                      </span>
                      {stat.lastRead && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(stat.lastRead)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary">
                      {stat.totalViews + stat.totalReads}
                    </div>
                    <div className="text-xs text-muted-foreground">aktivitas</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Eye className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>Belum ada aktivitas dzikir</p>
              <p className="text-sm mt-1">Mulai membaca dzikir untuk melihat statistik</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};