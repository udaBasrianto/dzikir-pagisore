import { db } from '@/config/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface UserData {
  // Dzikir progress
  dzikirProgress: Record<string, number[]>; // date -> completed IDs
  dzikirCounts: Record<number, {
    count: number;
    lastRead: string;
    totalViews: number;
  }>;
  
  // Streak data
  streakData: {
    current: number;
    best: number;
    lastDate: string;
  };
  
  // App preferences
  preferences: {
    fontSize: number;
    theme: string;
    font: string;
  };
  
  // Statistics
  stats: {
    totalDzikirRead: number;
    totalDaysActive: number;
  };
  
  lastSync: Date;
}

// Sync user data to Firebase
export const syncUserDataToFirebase = async (userId: string): Promise<void> => {
  try {
    const userData = gatherLocalData();
    const userRef = doc(db, 'userdata', userId);
    
    await setDoc(userRef, {
      ...userData,
      lastSync: serverTimestamp()
    }, { merge: true });
    
    console.log('User data synced to Firebase successfully');
  } catch (error) {
    console.error('Error syncing data to Firebase:', error);
    throw error;
  }
};

// Load user data from Firebase
export const loadUserDataFromFirebase = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'userdata', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        lastSync: data.lastSync?.toDate() || new Date()
      } as UserData;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading data from Firebase:', error);
    return null;
  }
};

// Gather all local data from localStorage
const gatherLocalData = (): Omit<UserData, 'lastSync'> => {
  // Get dzikir progress
  const dzikirProgress: Record<string, number[]> = {};
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('dzikir_progress_')) {
      const date = key.replace('dzikir_progress_', '');
      const progress = localStorage.getItem(key);
      if (progress) {
        dzikirProgress[date] = JSON.parse(progress);
      }
    }
  });

  // Get dzikir counts
  const dzikirCounts: Record<number, any> = {};
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('dzikir-count-')) {
      const id = parseInt(key.replace('dzikir-count-', ''));
      const data = localStorage.getItem(key);
      if (data) {
        dzikirCounts[id] = JSON.parse(data);
      }
    }
  });

  // Get streak data
  const streakData = localStorage.getItem('dzikir-streak');
  const parsedStreakData = streakData ? JSON.parse(streakData) : {
    current: 0,
    best: 0,
    lastDate: new Date().toDateString()
  };

  // Get preferences
  const preferences = {
    fontSize: parseInt(localStorage.getItem('dzikir-theme-fontSize') || '100'),
    theme: localStorage.getItem('dzikir-theme') || 'light',
    font: localStorage.getItem('dzikir-theme-font') || 'inter'
  };

  // Calculate stats
  const totalDzikirRead = Object.values(dzikirCounts).reduce((total, data) => total + (data.count || 0), 0);
  const totalDaysActive = Object.keys(dzikirProgress).length;

  return {
    dzikirProgress,
    dzikirCounts,
    streakData: parsedStreakData,
    preferences,
    stats: {
      totalDzikirRead,
      totalDaysActive
    }
  };
};

// Apply Firebase data to local storage
export const applyUserDataToLocal = (userData: UserData): void => {
  try {
    // Apply dzikir progress
    Object.entries(userData.dzikirProgress || {}).forEach(([date, progress]) => {
      localStorage.setItem(`dzikir_progress_${date}`, JSON.stringify(progress));
    });

    // Apply dzikir counts
    Object.entries(userData.dzikirCounts || {}).forEach(([id, data]) => {
      localStorage.setItem(`dzikir-count-${id}`, JSON.stringify(data));
    });

    // Apply streak data
    if (userData.streakData) {
      localStorage.setItem('dzikir-streak', JSON.stringify(userData.streakData));
    }

    // Apply preferences
    if (userData.preferences) {
      localStorage.setItem('dzikir-theme-fontSize', userData.preferences.fontSize.toString());
      localStorage.setItem('dzikir-theme', userData.preferences.theme);
      localStorage.setItem('dzikir-theme-font', userData.preferences.font);
    }

    console.log('Firebase data applied to local storage');
  } catch (error) {
    console.error('Error applying Firebase data to local:', error);
  }
};

// Sync data on app close/page unload
export const setupAutoSync = (userId: string) => {
  const handleSync = () => {
    syncUserDataToFirebase(userId).catch(console.error);
  };

  // Sync on page unload
  window.addEventListener('beforeunload', handleSync);
  
  // Sync periodically (every 5 minutes)
  const interval = setInterval(handleSync, 5 * 60 * 1000);

  return () => {
    window.removeEventListener('beforeunload', handleSync);
    clearInterval(interval);
  };
};