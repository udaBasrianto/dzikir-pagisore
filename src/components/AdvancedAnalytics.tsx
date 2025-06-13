import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AdvancedAnalyticsProps {
  onClose?: () => void;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getAnalyticsData = () => {
    const data = {
      totalDays: 0,
      completedDays: 0,
      partialDays: 0,
      streakData: { current: 0, best: 0, total: 0 },
      timeAnalysis: { bestTime: '', consistency: 0 },
      weeklyPattern: [] as any[],
      monthlyTrend: [] as any[],
      achievements: [] as any[]
    };

    // Calculate based on selected period
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      const progress = localStorage.getItem(`dzikir_progress_${dateString}`);
      
      data.totalDays++;
      
      if (progress) {
        const completed = JSON.parse(progress).length;
        if (completed >= 20) { // Assuming ~20 total dzikir
          data.completedDays++;
        } else if (completed > 0) {
          data.partialDays++;
        }
      }
    }

    // Get streak data
    const streakData = localStorage.getItem('dzikir-streak');
    if (streakData) {
      const streak = JSON.parse(streakData);
      data.streakData = {
        current: streak.current || 0,
        best: streak.best || 0,
        total: data.completedDays
      };
    }

    // Weekly pattern analysis
    const weekDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const weeklyStats = Array(7).fill(0).map(() => ({ total: 0, completed: 0 }));
    
    for (let i = 0; i < Math.min(days, 28); i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      const dateString = date.toDateString();
      const progress = localStorage.getItem(`dzikir_progress_${dateString}`);
      
      weeklyStats[dayOfWeek].total++;
      if (progress) {
        const completed = JSON.parse(progress).length;
        if (completed >= 20) {
          weeklyStats[dayOfWeek].completed++;
        }
      }
    }

    data.weeklyPattern = weekDays.map((day, index) => ({
      day,
      percentage: weeklyStats[index].total > 0 
        ? Math.round((weeklyStats[index].completed / weeklyStats[index].total) * 100)
        : 0
    }));

    // Time consistency
    data.timeAnalysis.consistency = Math.round((data.completedDays / data.totalDays) * 100);
    
    // Find best performing day
    const bestDay = data.weeklyPattern.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    );
    data.timeAnalysis.bestTime = bestDay.day;

    return data;
  };

  const data = getAnalyticsData();
  const completionRate = Math.round((data.completedDays / data.totalDays) * 100);

  const periodLabels = {
    week: 'Minggu Ini',
    month: 'Bulan Ini', 
    year: 'Tahun Ini'
  };

  const getSectionContent = (section: string) => {
    switch (section) {
      case 'overview':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{completionRate}%</p>
              <p className="text-xs text-muted-foreground">Tingkat Penyelesaian</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{data.completedDays}</p>
              <p className="text-xs text-muted-foreground">Hari Sempurna</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{data.partialDays}</p>
              <p className="text-xs text-muted-foreground">Hari Sebagian</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{data.streakData.best}</p>
              <p className="text-xs text-muted-foreground">Streak Terbaik</p>
            </div>
          </div>
        );

      case 'trends':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Konsistensi Harian</h4>
              <Progress value={data.timeAnalysis.consistency} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {data.timeAnalysis.consistency}% konsistensi dalam {periodLabels[selectedPeriod].toLowerCase()}
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Hari Terbaik</h4>
              <p className="text-lg font-bold text-primary">{data.timeAnalysis.bestTime}</p>
              <p className="text-sm text-muted-foreground">
                Hari dengan tingkat penyelesaian tertinggi
              </p>
            </div>
          </div>
        );

      case 'weekly':
        return (
          <div className="space-y-3">
            {data.weeklyPattern.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium w-16">{day.day}</span>
                <div className="flex-1 mx-3">
                  <Progress value={day.percentage} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground w-10 text-right">
                  {day.percentage}%
                </span>
              </div>
            ))}
          </div>
        );

      case 'insights':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
              <h4 className="font-medium mb-2">💡 Insight Utama</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Anda paling konsisten di hari {data.timeAnalysis.bestTime}</li>
                <li>• Tingkat penyelesaian: {completionRate}% ({completionRate >= 80 ? 'Sangat Baik' : completionRate >= 60 ? 'Baik' : 'Perlu Ditingkatkan'})</li>
                <li>• Streak terbaik: {data.streakData.best} hari berturut-turut</li>
                {data.partialDays > 0 && <li>• Ada {data.partialDays} hari dengan dzikir tidak lengkap</li>}
              </ul>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-950 dark:to-yellow-950 rounded-lg">
              <h4 className="font-medium mb-2">🎯 Rekomendasi</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {completionRate < 60 && <li>• Tetapkan reminder untuk dzikir pagi dan petang</li>}
                {data.streakData.current === 0 && <li>• Mulai streak baru hari ini!</li>}
                {data.partialDays > data.completedDays && <li>• Fokus menyelesaikan semua dzikir dalam satu sesi</li>}
                <li>• Manfaatkan hari {data.timeAnalysis.bestTime} sebagai momentum</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const sections = [
    { id: 'overview', title: 'Ringkasan', icon: BarChart3 },
    { id: 'trends', title: 'Tren & Konsistensi', icon: TrendingUp },
    { id: 'weekly', title: 'Pola Mingguan', icon: Calendar },
    { id: 'insights', title: 'Insight & Rekomendasi', icon: Target }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          📊 Analitik Lanjutan
        </h1>
        <p className="text-muted-foreground">
          Analisis mendalam performa dzikir Anda
        </p>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="flex-1"
              >
                {periodLabels[period]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Sections */}
      {sections.map((section) => {
        const Icon = section.icon;
        const isExpanded = expandedSections.has(section.id);
        
        return (
          <Card key={section.id}>
            <CardHeader className="pb-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {section.title}
                </CardTitle>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </CardHeader>
            
            {isExpanded && (
              <CardContent className="pt-0">
                {getSectionContent(section.id)}
              </CardContent>
            )}
          </Card>
        );
      })}

      {onClose && (
        <Button onClick={onClose} variant="outline" className="w-full">
          Kembali
        </Button>
      )}
    </div>
  );
};