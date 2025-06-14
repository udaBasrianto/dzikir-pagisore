import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserLevel, UserProgress } from '@/services/gamification';
import { Star, TrendingUp } from 'lucide-react';

interface UserLevelCardProps {
  userProgress: UserProgress;
  userLevel: UserLevel;
}

export const UserLevelCard: React.FC<UserLevelCardProps> = ({ userProgress, userLevel }) => {
  const progressPercentage = userLevel.requiredXP > 0 
    ? Math.min((userProgress.totalXP / userLevel.requiredXP) * 100, 100)
    : 100;

  const xpToNext = userLevel.requiredXP - userProgress.totalXP;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold">Level {userLevel.level}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {userLevel.title}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Nickname</div>
          <div className="font-semibold text-foreground">{userProgress.nickname}</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">XP Progress</span>
            <span className="font-medium">
              {userProgress.totalXP} / {userLevel.requiredXP} XP
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {xpToNext > 0 && (
            <div className="text-xs text-center text-muted-foreground">
              {xpToNext} XP to next level
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{userProgress.totalReads}</div>
            <div className="text-xs text-muted-foreground">Total Dzikir</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{userProgress.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{userProgress.unlockedAchievements.length}</div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};