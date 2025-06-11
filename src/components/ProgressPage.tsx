import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface ProgressPageProps {
  completedItems: Set<number>;
  totalItems: number;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ completedItems, totalItems }) => {
  const completedCount = completedItems.size;
  const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const getProgressMessage = () => {
    if (progressPercentage === 100) {
      return "Alhamdulillah! Anda telah menyelesaikan semua dzikir pagi hari ini.";
    } else if (progressPercentage >= 75) {
      return "Subhanallah! Anda hampir menyelesaikan dzikir pagi.";
    } else if (progressPercentage >= 50) {
      return "Barakallahu fiik! Terus lanjutkan dzikir Anda.";
    } else if (progressPercentage >= 25) {
      return "Semangat! Anda sudah memulai dzikir dengan baik.";
    } else if (progressPercentage > 0) {
      return "Mulai yang baik! Lanjutkan dzikir Anda.";
    } else {
      return "Mari mulai dzikir pagi untuk memulai hari dengan berkah.";
    }
  };

  const getProgressColor = () => {
    if (progressPercentage >= 75) return "bg-green-500";
    if (progressPercentage >= 50) return "bg-blue-500";
    if (progressPercentage >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Progress Dzikir Pagi
        </h1>
        <p className="text-muted-foreground">
          Pantau kemajuan dzikir harian Anda
        </p>
      </div>

      {/* Main Progress Card */}
      <Card className="shadow-lg border-l-4 border-l-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Progress Hari Ini</CardTitle>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Selesai</p>
              <p className="text-xl font-bold">{completedCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Tersisa</p>
              <p className="text-xl font-bold">{totalItems - completedCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Kemajuan</p>
              <p className="text-xl font-bold">{progressPercentage}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Keutamaan Dzikir Pagi</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            "Barangsiapa yang membaca dzikir pagi, maka ia akan dilindungi Allah 
            dari berbagai gangguan hingga sore hari. Dan barangsiapa yang membaca 
            dzikir sore, maka ia akan dilindungi hingga pagi hari."
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            - Hadits Shahih
          </p>
        </CardContent>
      </Card>

      {/* Reset Progress Info */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Progress akan direset setiap hari untuk memulai dzikir yang baru.</p>
            <p className="mt-1">Jaga konsistensi dzikir harian Anda! 🤲</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};