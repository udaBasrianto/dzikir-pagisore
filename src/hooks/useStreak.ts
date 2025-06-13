import { useEffect } from 'react';

export const useStreak = (completedItems: Set<number>, totalItems: number) => {
  useEffect(() => {
    const completedCount = completedItems.size;
    const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
    
    // Only update streak if dzikir is completely finished (100%)
    if (progressPercentage === 100) {
      updateStreak();
    }
  }, [completedItems, totalItems]);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const streakData = localStorage.getItem('dzikir-streak');
    
    let streak = {
      current: 0,
      best: 0,
      lastDate: today
    };
    
    if (streakData) {
      streak = JSON.parse(streakData);
    }
    
    // Check if this is a new day
    if (streak.lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      // If last completion was yesterday, continue streak
      if (streak.lastDate === yesterdayString) {
        streak.current += 1;
      } else {
        // Reset streak if more than 1 day gap
        streak.current = 1;
      }
      
      // Update best streak
      if (streak.current > streak.best) {
        streak.best = streak.current;
      }
      
      streak.lastDate = today;
      
      localStorage.setItem('dzikir-streak', JSON.stringify(streak));
    }
  };

  const getStreakData = () => {
    const streakData = localStorage.getItem('dzikir-streak');
    if (streakData) {
      return JSON.parse(streakData);
    }
    return { current: 0, best: 0, lastDate: new Date().toDateString() };
  };

  return { getStreakData };
};