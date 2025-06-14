import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/services/gamification';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }) => {
  return (
    <Card className={`mb-4 transition-all duration-300 ${
      isUnlocked 
        ? 'border-primary shadow-lg hover:shadow-xl animate-scale-in' 
        : 'border-muted bg-muted/30'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`text-2xl ${isUnlocked ? '' : 'opacity-40'}`}>
              {achievement.icon}
            </div>
            <div>
              <CardTitle className={`font-semibold text-lg ${
                isUnlocked ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {achievement.title}
              </CardTitle>
            </div>
          </div>
          {isUnlocked && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Unlocked
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-sm ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
          {achievement.description}
        </p>
        
        {isUnlocked ? (
          <div className="mt-3 text-sm font-medium text-primary">
            +{achievement.reward.xp} XP earned
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {achievement.condition.type === 'streak' && `Complete ${achievement.condition.value} day streak`}
              {achievement.condition.type === 'total_reads' && `Read ${achievement.condition.value} dzikir`}
              {achievement.condition.type === 'perfect_day' && `Complete ${achievement.condition.value} perfect days`}
            </div>
            <div className="text-sm text-muted-foreground">
              +{achievement.reward.xp} XP
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};