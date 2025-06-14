import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WeeklyChallenge, UserProgress, getCurrentWeeklyChallenge } from '@/services/gamification';
import { Target, Calendar, Gift } from 'lucide-react';

interface WeeklyChallengeCardProps {
  userProgress: UserProgress;
}

export const WeeklyChallengeCard: React.FC<WeeklyChallengeCardProps> = ({ userProgress }) => {
  const challenge = getCurrentWeeklyChallenge();
  
  const calculateProgress = () => {
    switch (challenge.type) {
      case 'streak_days':
        return Math.min(userProgress.currentStreak, challenge.target);
      case 'total_reads':
        // For weekly challenge, we'd need to track weekly reads separately
        // For now, using a simplified calculation
        const weeklyReads = userProgress.totalReads % 100; // Simplified
        return Math.min(weeklyReads, challenge.target);
      case 'daily_dzikir':
        return Math.min(userProgress.currentStreak, challenge.target);
      default:
        return 0;
    }
  };

  const currentProgress = calculateProgress();
  const progressPercentage = (currentProgress / challenge.target) * 100;
  const isCompleted = currentProgress >= challenge.target;

  const daysLeft = Math.ceil((challenge.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-accent/5 to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold">Weekly Challenge</CardTitle>
          </div>
          {isCompleted ? (
            <Badge className="bg-green-500/10 text-green-600 border-green-200">
              ✓ Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {daysLeft}d left
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground mb-1">{challenge.title}</h3>
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {currentProgress} / {challenge.target}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Reward:</span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-primary">+{challenge.reward.xp} XP</div>
            <div className="text-xs text-muted-foreground">{challenge.reward.title}</div>
          </div>
        </div>

        {isCompleted && (
          <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-200">
            <div className="text-green-600 font-semibold">🎉 Challenge Completed!</div>
            <div className="text-xs text-green-600 mt-1">
              You've earned {challenge.reward.xp} XP and the title "{challenge.reward.title}"
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};