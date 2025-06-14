import { useState, useEffect } from 'react';
import { 
  getUserProgress, 
  updateUserProgress, 
  awardXP, 
  checkAchievements,
  calculateLevel,
  type UserProgress,
  type UserLevel,
  type Achievement
} from '@/services/gamification';
import { useToast } from '@/hooks/use-toast';

export const useGamification = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get or create user ID
  const getUserId = () => {
    let userId = localStorage.getItem('temp-user-id');
    if (!userId) {
      userId = 'temp-user-' + Date.now();
      localStorage.setItem('temp-user-id', userId);
    }
    return userId;
  };

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const userId = getUserId();
        const progress = await getUserProgress(userId);
        const level = calculateLevel(progress.totalXP);
        
        setUserProgress(progress);
        setUserLevel(level);
      } catch (error) {
        console.error('Error loading user progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, []);

  const incrementDzikirRead = async () => {
    if (!userProgress) return;

    try {
      const userId = getUserId();
      
      // Update total reads
      const newTotalReads = userProgress.totalReads + 1;
      await updateUserProgress(userId, {
        totalReads: newTotalReads
      });
      
      // Award XP for reading dzikir
      const updatedProgress = await awardXP(userId, 5); // 5 XP per dzikir read
      
      // Check for new achievements
      const newAchievements = await checkAchievements(userId, {
        ...userProgress,
        totalReads: newTotalReads,
        totalXP: updatedProgress.totalXP
      });
      
      // Update local state
      const refreshedProgress = await getUserProgress(userId);
      const refreshedLevel = calculateLevel(refreshedProgress.totalXP);
      
      setUserProgress(refreshedProgress);
      setUserLevel(refreshedLevel);
      
      // Show notifications for new achievements
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${achievement.title} - ${achievement.description}`,
            duration: 5000,
          });
        });
      }
      
      // Show level up notification
      if (userLevel && refreshedLevel.level > userLevel.level) {
        toast({
          title: "🌟 Level Up!",
          description: `You've reached Level ${refreshedLevel.level} - ${refreshedLevel.title}!`,
          duration: 5000,
        });
      }
      
    } catch (error) {
      console.error('Error incrementing dzikir read:', error);
    }
  };

  const updateStreak = async (newStreak: number) => {
    if (!userProgress) return;

    try {
      const userId = getUserId();
      
      await updateUserProgress(userId, {
        currentStreak: newStreak,
        longestStreak: Math.max(userProgress.longestStreak, newStreak)
      });
      
      // Check for streak achievements
      const newAchievements = await checkAchievements(userId, {
        ...userProgress,
        currentStreak: newStreak
      });
      
      // Update local state
      const refreshedProgress = await getUserProgress(userId);
      setUserProgress(refreshedProgress);
      
      // Show notifications for new achievements
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${achievement.title} - ${achievement.description}`,
            duration: 5000,
          });
        });
      }
      
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const updateNickname = async (nickname: string) => {
    if (!userProgress) return;

    try {
      const userId = getUserId();
      await updateUserProgress(userId, { nickname });
      
      const refreshedProgress = await getUserProgress(userId);
      setUserProgress(refreshedProgress);
      
      toast({
        title: "✅ Nickname Updated",
        description: `Your nickname has been changed to "${nickname}"`,
      });
      
    } catch (error) {
      console.error('Error updating nickname:', error);
      toast({
        title: "❌ Error",
        description: "Failed to update nickname",
        variant: "destructive",
      });
    }
  };

  return {
    userProgress,
    userLevel,
    loading,
    incrementDzikirRead,
    updateStreak,
    updateNickname,
    getUserId
  };
};