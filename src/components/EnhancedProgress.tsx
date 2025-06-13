import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, TrendingUp, Calendar, Award, Flame } from 'lucide-react';

interface EnhancedProgressProps {
  completedItems: Set<number>;
  totalItems: number;
  currentTab: string;
}

export const EnhancedProgress: React.FC<EnhancedProgressProps> = ({ 
  completedItems, 
  totalItems, 
  currentTab 
}) => {
  const completedCount = completedItems.size;
  const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Get streak data
  const getStreakData = () => {
    const today = new Date().toDateString();
    const streakData = localStorage.getItem('dzikir-streak');
    
    if (streakData) {
      const data = JSON.parse(streakData);
      return {
        current: data.current || 0,
        best: data.best || 0,
        lastDate: data.lastDate || today
      };
    }
    
    return { current: 0, best: 0, lastDate: today };
  };

  // Get weekly progress
  const getWeeklyProgress = () => {
    const weekDays = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const dayProgress = localStorage.getItem(`dzikir_progress_${dateString}`);
      const completed = dayProgress ? JSON.parse(dayProgress).length : 0;
      
      weekDays.push({
        day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        date: dateString,
        completed,
        percentage: totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0
      });
    }
    
    return weekDays;
  };

  const streak = getStreakData();
  const weeklyProgress = getWeeklyProgress();
  const weeklyAverage = Math.round(weeklyProgress.reduce((sum, day) => sum + day.percentage, 0) / 7);

  const getProgressMessage = () => {
    if (progressPercentage === 100) {
      return "MashaAllah! Dzikir hari ini telah sempurna. 🤲";
    } else if (progressPercentage >= 75) {
      return "Subhanallah! Hampir selesai, terus semangat! 💫";
    } else if (progressPercentage >= 50) {
      return "Alhamdulillah! Setengah perjalanan telah dilalui. 🌟";
    } else if (progressPercentage >= 25) {
      return "Barakallahu fiik! Awal yang baik. 🌱";
    } else if (progressPercentage > 0) {
      return "Bismillah! Mari lanjutkan dzikir. 🚀";
    } else {
      return "Assalamu'alaikum! Mari mulai dzikir hari ini. 🌅";
    }
  };

  const getMotivationalQuote = () => {
    const quotes = [
      {
        text: "Dan ingatlah Allah sebanyak-banyaknya agar kamu beruntung.",
        source: "QS. Al-Anfal: 45"
      },
      {
        text: "Dzikir adalah kehidupan hati, dan hati yang tidak berdzikir adalah hati yang mati.",
        source: "Ibnu Qayyim"
      },
      {
        text: "Barangsiapa yang membaca dzikir pagi, maka ia akan dilindungi Allah hingga sore hari.",
        source: "Hadits Shahih"
      }
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const quote = getMotivationalQuote();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          📊 Progress Dzikir
        </h1>
        <p className="text-muted-foreground">
          Pantau kemajuan dan raih konsistensi dzikir harian
        </p>
      </div>

      {/* Main Progress Card */}
      <Card className="shadow-lg border-l-4 border-l-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">
            Progress {currentTab === 'pagi' ? 'Pagi' : 'Petang'} Hari Ini
          </CardTitle>
          <div className="text-4xl font-bold text-primary mt-2">
            {progressPercentage}%
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedCount} dari {totalItems} dzikir</span>
            <span>{totalItems - completedCount} tersisa</span>
          </div>
          <div className="text-center text-sm text-foreground font-medium bg-muted/50 p-3 rounded-lg">
            {getProgressMessage()}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-xs text-muted-foreground text-center">Selesai Hari Ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Flame className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{streak.current}</p>
            <p className="text-xs text-muted-foreground text-center">Hari Berturut</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Award className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">{streak.best}</p>
            <p className="text-xs text-muted-foreground text-center">Rekor Terbaik</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <TrendingUp className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{weeklyAverage}%</p>
            <p className="text-xs text-muted-foreground text-center">Rata-rata Minggu</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Progress 7 Hari Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
                <div className="h-16 bg-muted rounded flex items-end justify-center">
                  <div 
                    className="w-full bg-primary rounded transition-all duration-300"
                    style={{ height: `${day.percentage}%`, minHeight: day.percentage > 0 ? '4px' : '0' }}
                  />
                </div>
                <div className="text-xs font-medium mt-1">{day.percentage}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6 text-center">
          <div className="text-lg font-semibold mb-2">💎 Mutiara Hikmah</div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            "{quote.text}"
          </p>
          <p className="text-xs text-muted-foreground italic">
            - {quote.source}
          </p>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Pencapaian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg border text-center ${progressPercentage >= 100 ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-muted bg-muted/50'}`}>
              <div className="text-2xl mb-1">✅</div>
              <div className="text-xs font-medium">Hari Sempurna</div>
            </div>
            <div className={`p-3 rounded-lg border text-center ${streak.current >= 3 ? 'border-orange-500 bg-orange-50 dark:bg-orange-950' : 'border-muted bg-muted/50'}`}>
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xs font-medium">3 Hari Berturut</div>
            </div>
            <div className={`p-3 rounded-lg border text-center ${streak.current >= 7 ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' : 'border-muted bg-muted/50'}`}>
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs font-medium">Seminggu Konsisten</div>
            </div>
            <div className={`p-3 rounded-lg border text-center ${weeklyAverage >= 80 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-muted bg-muted/50'}`}>
              <div className="text-2xl mb-1">📈</div>
              <div className="text-xs font-medium">Rata-rata Tinggi</div>
            </div>
            <div className={`p-3 rounded-lg border text-center ${streak.best >= 30 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' : 'border-muted bg-muted/50'}`}>
              <div className="text-2xl mb-1">👑</div>
              <div className="text-xs font-medium">Master Dzikir</div>
            </div>
            <div className={`p-3 rounded-lg border text-center ${completedCount > 0 ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-muted bg-muted/50'}`}>
              <div className="text-2xl mb-1">🌱</div>
              <div className="text-xs font-medium">Memulai Hari Ini</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};