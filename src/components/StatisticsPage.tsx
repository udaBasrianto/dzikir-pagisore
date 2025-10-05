import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, Award, Target, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalStats } from '@/components/GlobalStats';
import { DzikirStatistics } from '@/components/DzikirStatistics';
import { useStreak } from '@/hooks/useStreak';
import { useGamification } from '@/hooks/useGamification';
import { UserLevelCard } from '@/components/UserLevelCard';
import { CalendarProgress } from '@/components/CalendarProgress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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

  // Generate mock trend data for charts
  const weeklyData = useMemo(() => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days.map((day, i) => ({
      name: day,
      dzikir: Math.floor(Math.random() * 30) + 10,
      target: 25,
    }));
  }, []);

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return months.map(month => ({
      name: month,
      dzikir: Math.floor(Math.random() * 200) + 100,
      streak: Math.floor(Math.random() * 15) + 5,
    }));
  }, []);

  const statsChange = {
    streak: streakData.current > 0 ? '+15%' : '0%',
    reads: '+32%',
    best: streakData.best > streakData.current ? '+8%' : '0%',
    level: '+12%'
  };

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
              📊 Statistik Dzikir
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              Analisis lengkap aktivitas dzikir Anda
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Streak Saat Ini</p>
                  <h3 className="text-3xl font-bold">{streakData.current}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{statsChange.streak}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={weeklyData.slice(-7)}>
                  <defs>
                    <linearGradient id="colorStreak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="dzikir" stroke="hsl(var(--primary))" fill="url(#colorStreak)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Dzikir</p>
                  <h3 className="text-3xl font-bold">{totalReads}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">{statsChange.reads}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={weeklyData.slice(-7)}>
                  <defs>
                    <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="target" stroke="#3b82f6" fill="url(#colorReads)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Best Streak</p>
                  <h3 className="text-3xl font-bold">{streakData.best}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{statsChange.best}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={weeklyData.slice(-7)}>
                  <Line type="monotone" dataKey="dzikir" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Level Anda</p>
                  <h3 className="text-3xl font-bold">{userLevel?.level || 1}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-600 font-medium">{statsChange.level}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{userLevel?.title || 'Pemula'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Overview Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Aktivitas Dzikir Bulanan
                </CardTitle>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">Dzikir</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="text-muted-foreground">Streak</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorDzikir" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorStreakChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="dzikir" stroke="hsl(var(--primary))" fill="url(#colorDzikir)" strokeWidth={2} />
                  <Area type="monotone" dataKey="streak" stroke="hsl(var(--secondary))" fill="url(#colorStreakChart)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Statistik Harian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transaksi</p>
                    <p className="text-2xl font-bold">{userProgress?.totalXP || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Dzikir Selesai</p>
                    <p className="text-2xl font-bold text-secondary">{completedItems.size}</p>
                  </div>
                  <Award className="w-8 h-8 text-secondary" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Target Harian</p>
                    <p className="text-2xl font-bold text-green-600">{totalItems}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Aktivitas Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="dzikir" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Level Card */}
        {userProgress && userLevel && (
          <UserLevelCard userProgress={userProgress} userLevel={userLevel} />
        )}

        {/* Detailed Stats Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <DzikirStatistics />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4 mt-4">
            <CalendarProgress onClose={() => {}} />
          </TabsContent>

          <TabsContent value="global" className="space-y-4 mt-4">
            <GlobalStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};