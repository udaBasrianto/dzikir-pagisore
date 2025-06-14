import React, { useEffect, useState } from 'react';
import { UserLevelCard } from '@/components/UserLevelCard';
import { AchievementCard } from '@/components/AchievementCard';
import { LeaderboardCard } from '@/components/LeaderboardCard';
import { WeeklyChallengeCard } from '@/components/WeeklyChallengeCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getUserProgress, 
  calculateLevel, 
  ACHIEVEMENTS, 
  UserProgress,
  UserLevel
} from '@/services/gamification';
import { ArrowLeft } from 'lucide-react';

interface GamificationPageProps {
  onClose: () => void;
}

export const GamificationPage: React.FC<GamificationPageProps> = ({ onClose }) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // For now, using a temporary user ID. In real app, this would come from auth
        const tempUserId = localStorage.getItem('temp-user-id') || 'temp-user-' + Date.now();
        localStorage.setItem('temp-user-id', tempUserId);
        
        const progress = await getUserProgress(tempUserId);
        const level = calculateLevel(progress.totalXP);
        
        setUserProgress(progress);
        setUserLevel(level);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold text-foreground">⭐ Gamifikasi</h1>
        </div>
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!userProgress || !userLevel) {
    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold text-foreground">⭐ Gamifikasi</h1>
        </div>
        <div className="text-center text-muted-foreground">Error loading data</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold text-foreground">⭐ Gamifikasi</h1>
      </div>

      {/* User Level Card */}
      <UserLevelCard userProgress={userProgress} userLevel={userLevel} />

      {/* Weekly Challenge */}
      <WeeklyChallengeCard userProgress={userProgress} />

      {/* Tabs for Achievements and Leaderboard */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="space-y-4 mt-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              🏆 Your Achievements
            </h3>
            <p className="text-sm text-muted-foreground">
              Unlock badges by completing challenges
            </p>
          </div>
          
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={userProgress.unlockedAchievements.includes(achievement.id)}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              🥇 Top Performers
            </h3>
            <p className="text-sm text-muted-foreground">
              See how you rank against other users
            </p>
          </div>
          
          <LeaderboardCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};