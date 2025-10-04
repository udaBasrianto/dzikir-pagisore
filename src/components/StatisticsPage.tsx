import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalStats } from '@/components/GlobalStats';
import { DzikirStatistics } from '@/components/DzikirStatistics';
import { useStreak } from '@/hooks/useStreak';
import { useGamification } from '@/hooks/useGamification';
import { UserLevelCard } from '@/components/UserLevelCard';
import { CalendarProgress } from '@/components/CalendarProgress';

interface StatisticsPageProps {
  onClose: () => void;
  completedItems: Set<number>;
  totalItems: number;
}

export const StatisticsPage: React.FC<StatisticsPageProps> = ({ 
  onClose, 
  completedItems,
  totalItems 
}) => {
  const { getStreakData } = useStreak(completedItems, totalItems);
  const streakData = getStreakData();
  const { userProgress, userLevel } = useGamification();

  // Get total reads from localStorage (same as DzikirStatistics)
  const getTotalReads = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('dzikir_')) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            total += parsed.count || 0;
          } catch (e) {
            // Skip invalid entries
          }
        }
      }
    }
    return total;
  };

  const totalReads = getTotalReads();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-secondary p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">
              📊 Statistik Lengkap
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              Pantau progress dan pencapaian Anda
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-muted-foreground">Streak</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{streakData.current}</p>
              <p className="text-xs text-muted-foreground">hari berturut-turut</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">Total Baca</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{totalReads}</p>
              <p className="text-xs text-muted-foreground">dzikir dibaca</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Best Streak</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{streakData.best}</p>
              <p className="text-xs text-muted-foreground">hari terbaik</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-muted-foreground">Level</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {userLevel?.level || 1}
              </p>
              <p className="text-xs text-muted-foreground">{userLevel?.title || 'Pemula'}</p>
            </CardContent>
          </Card>
        </div>

        {/* User Level Card (if gamification is enabled) */}
        {userProgress && userLevel && (
          <UserLevelCard userProgress={userProgress} userLevel={userLevel} />
        )}

        {/* Tabbed Content */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Statistik Dzikir Pribadi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DzikirStatistics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Progress Kalender
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarProgress onClose={() => {}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="global" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Statistik Global
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GlobalStats />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Progress Summary */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle>📈 Ringkasan Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Hari ini</span>
              <span className="font-semibold">
                {completedItems.size}/{totalItems} dzikir
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                style={{ width: `${(completedItems.size / totalItems) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-muted-foreground">Total XP</span>
              <span className="font-semibold">{userProgress?.totalXP || 0} XP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Achievement</span>
              <span className="font-semibold">
                {userProgress?.unlockedAchievements?.length || 0} 🏆
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold mb-2">
              "Barangsiapa yang berdzikir kepada Allah, maka Allah akan mengingatnya"
            </p>
            <p className="text-sm text-muted-foreground italic">
              - HR. Bukhari & Muslim
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};