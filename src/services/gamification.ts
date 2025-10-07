import { supabase } from '@/integrations/supabase/client';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: {
    type: 'streak' | 'total_reads' | 'weekly_challenge' | 'perfect_day';
    value: number;
  };
  reward: {
    xp: number;
    badge: string;
  };
}

export interface UserLevel {
  level: number;
  currentXP: number;
  requiredXP: number;
  title: string;
}

export interface LeaderboardEntry {
  userId: string;
  nickname: string;
  level: number;
  totalXP: number;
  totalReads: number;
  streak: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  type: 'daily_dzikir' | 'streak_days' | 'total_reads';
  reward: {
    xp: number;
    title: string;
  };
  startDate: Date;
  endDate: Date;
}

export interface UserProgress {
  userId: string;
  nickname: string;
  level: number;
  totalXP: number;
  totalReads: number;
  currentStreak: number;
  longestStreak: number;
  unlockedAchievements: string[];
  completedChallenges: string[];
  lastActiveDate: Date;
}

// Predefined achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_dzikir',
    title: '🌟 Langkah Pertama',
    description: 'Membaca dzikir pertama kali',
    icon: '🌟',
    condition: { type: 'total_reads', value: 1 },
    reward: { xp: 10, badge: '🌟' }
  },
  {
    id: 'streak_3',
    title: '🔥 Istiqomah 3 Hari',
    description: 'Berdzikir selama 3 hari berturut-turut',
    icon: '🔥',
    condition: { type: 'streak', value: 3 },
    reward: { xp: 50, badge: '🔥' }
  },
  {
    id: 'streak_7',
    title: '⭐ Istiqomah Seminggu',
    description: 'Berdzikir selama 7 hari berturut-turut',
    icon: '⭐',
    condition: { type: 'streak', value: 7 },
    reward: { xp: 100, badge: '⭐' }
  },
  {
    id: 'streak_30',
    title: '👑 Master Istiqomah',
    description: 'Berdzikir selama 30 hari berturut-turut',
    icon: '👑',
    condition: { type: 'streak', value: 30 },
    reward: { xp: 500, badge: '👑' }
  },
  {
    id: 'reads_100',
    title: '📿 Pecinta Dzikir',
    description: 'Membaca 100 dzikir',
    icon: '📿',
    condition: { type: 'total_reads', value: 100 },
    reward: { xp: 150, badge: '📿' }
  },
  {
    id: 'reads_1000',
    title: '🕌 Ahli Dzikir',
    description: 'Membaca 1000 dzikir',
    icon: '🕌',
    condition: { type: 'total_reads', value: 1000 },
    reward: { xp: 1000, badge: '🕌' }
  },
  {
    id: 'perfect_week',
    title: '✨ Sempurna Seminggu',
    description: 'Menyelesaikan semua dzikir selama 7 hari',
    icon: '✨',
    condition: { type: 'perfect_day', value: 7 },
    reward: { xp: 300, badge: '✨' }
  }
];

// Level system
export const calculateLevel = (totalXP: number): UserLevel => {
  const levels = [
    { level: 1, requiredXP: 0, title: 'Pemula' },
    { level: 2, requiredXP: 100, title: 'Pelajar' },
    { level: 3, requiredXP: 250, title: 'Pengamal' },
    { level: 4, requiredXP: 500, title: 'Istiqomah' },
    { level: 5, requiredXP: 1000, title: 'Ahli Dzikir' },
    { level: 6, requiredXP: 2000, title: 'Master Dzikir' },
    { level: 7, requiredXP: 4000, title: 'Guru Spiritual' },
    { level: 8, requiredXP: 8000, title: 'Wali Allah' }
  ];

  let currentLevel = levels[0];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].requiredXP) {
      currentLevel = levels[i];
      break;
    }
  }

  const nextLevel = levels.find(l => l.level === currentLevel.level + 1);
  const requiredXP = nextLevel ? nextLevel.requiredXP : currentLevel.requiredXP;

  return {
    level: currentLevel.level,
    currentXP: totalXP,
    requiredXP,
    title: currentLevel.title
  };
};

// User progress management
export const getUserProgress = async (userId: string): Promise<UserProgress> => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    if (data) {
      const level = calculateLevel(data.total_xp || 0);
      return {
        userId: data.user_id,
        nickname: data.nickname || 'Anonymous',
        level: level.level,
        totalXP: data.total_xp || 0,
        totalReads: data.total_reads || 0,
        currentStreak: data.current_streak || 0,
        longestStreak: data.longest_streak || 0,
        unlockedAchievements: data.unlocked_achievements || [],
        completedChallenges: [],
        lastActiveDate: new Date(data.updated_at)
      };
    } else {
      // Initialize new user
      const newUser = {
        user_id: userId,
        nickname: 'Anonymous',
        total_xp: 0,
        total_reads: 0,
        current_streak: 0,
        longest_streak: 0,
        unlocked_achievements: []
      };
      
      const { data: insertedData, error: insertError } = await supabase
        .from('user_progress')
        .insert(newUser)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      return {
        userId: insertedData.user_id,
        nickname: insertedData.nickname || 'Anonymous',
        level: 1,
        totalXP: insertedData.total_xp || 0,
        totalReads: insertedData.total_reads || 0,
        currentStreak: insertedData.current_streak || 0,
        longestStreak: insertedData.longest_streak || 0,
        unlockedAchievements: insertedData.unlocked_achievements || [],
        completedChallenges: [],
        lastActiveDate: new Date(insertedData.created_at)
      };
    }
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

export const updateUserProgress = async (
  userId: string, 
  updates: Partial<UserProgress>
): Promise<void> => {
  try {
    const dbUpdates: any = {};
    
    if (updates.nickname !== undefined) dbUpdates.nickname = updates.nickname;
    if (updates.totalXP !== undefined) dbUpdates.total_xp = updates.totalXP;
    if (updates.totalReads !== undefined) dbUpdates.total_reads = updates.totalReads;
    if (updates.currentStreak !== undefined) dbUpdates.current_streak = updates.currentStreak;
    if (updates.longestStreak !== undefined) dbUpdates.longest_streak = updates.longestStreak;
    if (updates.unlockedAchievements !== undefined) dbUpdates.unlocked_achievements = updates.unlockedAchievements;
    
    const { error } = await supabase
      .from('user_progress')
      .update(dbUpdates)
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

export const awardXP = async (userId: string, xp: number): Promise<UserProgress> => {
  try {
    const progress = await getUserProgress(userId);
    const newTotalXP = progress.totalXP + xp;
    const newLevel = calculateLevel(newTotalXP);
    
    await updateUserProgress(userId, {
      totalXP: newTotalXP,
      level: newLevel.level
    });
    
    return { ...progress, totalXP: newTotalXP, level: newLevel.level };
  } catch (error) {
    console.error('Error awarding XP:', error);
    throw error;
  }
};

export const checkAchievements = async (userId: string, progress: UserProgress): Promise<Achievement[]> => {
  const newAchievements: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (progress.unlockedAchievements.includes(achievement.id)) continue;
    
    let unlocked = false;
    switch (achievement.condition.type) {
      case 'total_reads':
        unlocked = progress.totalReads >= achievement.condition.value;
        break;
      case 'streak':
        unlocked = progress.currentStreak >= achievement.condition.value;
        break;
      case 'perfect_day':
        // This would need additional logic for perfect days
        break;
    }
    
    if (unlocked) {
      newAchievements.push(achievement);
      await updateUserProgress(userId, {
        unlockedAchievements: [...progress.unlockedAchievements, achievement.id],
        totalXP: progress.totalXP + achievement.reward.xp
      });
    }
  }
  
  return newAchievements;
};

export const getLeaderboard = async (limit_count: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .order('total_xp', { ascending: false })
      .limit(limit_count);
    
    if (error) throw error;
    
    const leaderboard: LeaderboardEntry[] = (data || []).map((item) => {
      const level = calculateLevel(item.total_xp || 0);
      
      return {
        userId: item.user_id,
        nickname: item.nickname || 'Anonymous',
        level: level.level,
        totalXP: item.total_xp || 0,
        totalReads: item.total_reads || 0,
        streak: item.current_streak || 0
      };
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

export const getCurrentWeeklyChallenge = (): WeeklyChallenge => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const challenges: WeeklyChallenge[] = [
    {
      id: 'weekly_streak',
      title: '🎯 Istiqomah Mingguan',
      description: 'Berdzikir setiap hari selama seminggu',
      target: 7,
      type: 'streak_days',
      reward: { xp: 200, title: 'Juara Mingguan' },
      startDate: startOfWeek,
      endDate: endOfWeek
    },
    {
      id: 'weekly_reads',
      title: '📖 Target Dzikir',
      description: 'Baca minimal 50 dzikir minggu ini',
      target: 50,
      type: 'total_reads',
      reward: { xp: 150, title: 'Rajin Berdzikir' },
      startDate: startOfWeek,
      endDate: endOfWeek
    }
  ];
  
  const weekNumber = Math.floor((now.getTime() - startOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) % challenges.length;
  return challenges[weekNumber];
};
