import { useEffect, useState } from 'react';
import { signInAnonymousUser } from '@/config/firebase';
import { 
  getGlobalStats, 
  incrementDzikirRead as firebaseIncrementDzikirRead,
  incrementAppInstall as firebaseIncrementAppInstall,
  trackActiveUser,
  subscribeToGlobalStats,
  type GlobalStats
} from '@/services/firebaseStats';

export const useGlobalCounter = () => {
  const [stats, setStats] = useState<GlobalStats>({
    totalReads: 0,
    appInstalls: 0,
    activeUsers: 0,
    lastUpdated: new Date()
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const initializeFirebase = async () => {
      if (!isOnline) {
        // Load from localStorage when offline
        const totalReads = parseInt(localStorage.getItem('global-dzikir-reads') || '2547');
        const appInstalls = parseInt(localStorage.getItem('app-installs') || '324');
        const activeUsers = parseInt(localStorage.getItem('active-users') || '189');
        
        setStats({
          totalReads,
          appInstalls,
          activeUsers,
          lastUpdated: new Date()
        });
        return;
      }

      try {
        // Sign in anonymously
        await signInAnonymousUser();
        
        // Get initial stats
        const initialStats = await getGlobalStats();
        setStats(initialStats);
        
        // Track active user
        await trackActiveUser();
        
        // Subscribe to real-time updates
        const unsubscribe = subscribeToGlobalStats((newStats) => {
          setStats(newStats);
          // Cache in localStorage for offline use
          localStorage.setItem('global-dzikir-reads', newStats.totalReads.toString());
          localStorage.setItem('app-installs', newStats.appInstalls.toString());
          localStorage.setItem('active-users', newStats.activeUsers.toString());
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        // Fallback to localStorage
        const totalReads = parseInt(localStorage.getItem('global-dzikir-reads') || '2547');
        const appInstalls = parseInt(localStorage.getItem('app-installs') || '324');
        const activeUsers = parseInt(localStorage.getItem('active-users') || '189');
        
        setStats({
          totalReads,
          appInstalls,
          activeUsers,
          lastUpdated: new Date()
        });
      }
    };

    initializeFirebase();
  }, [isOnline]);

  const incrementDzikirRead = async () => {
    if (isOnline) {
      try {
        await firebaseIncrementDzikirRead();
      } catch (error) {
        console.error('Error incrementing dzikir read:', error);
        // Fallback to localStorage
        const currentReads = parseInt(localStorage.getItem('global-dzikir-reads') || '2547');
        const newReads = currentReads + 1;
        localStorage.setItem('global-dzikir-reads', newReads.toString());
        setStats(prev => ({ ...prev, totalReads: newReads }));
      }
    } else {
      // Offline mode
      const currentReads = parseInt(localStorage.getItem('global-dzikir-reads') || '2547');
      const newReads = currentReads + 1;
      localStorage.setItem('global-dzikir-reads', newReads.toString());
      setStats(prev => ({ ...prev, totalReads: newReads }));
    }
  };

  const incrementInstall = async () => {
    if (isOnline) {
      try {
        await firebaseIncrementAppInstall();
      } catch (error) {
        console.error('Error incrementing app install:', error);
        // Fallback to localStorage
        const currentInstalls = parseInt(localStorage.getItem('app-installs') || '324');
        const newInstalls = currentInstalls + 1;
        localStorage.setItem('app-installs', newInstalls.toString());
        setStats(prev => ({ ...prev, appInstalls: newInstalls }));
      }
    } else {
      // Offline mode
      const currentInstalls = parseInt(localStorage.getItem('app-installs') || '324');
      const newInstalls = currentInstalls + 1;
      localStorage.setItem('app-installs', newInstalls.toString());
      setStats(prev => ({ ...prev, appInstalls: newInstalls }));
    }
  };

  // Listen for PWA install events
  useEffect(() => {
    const handlePWAInstall = () => {
      incrementInstall();
    };

    window.addEventListener('pwa-installed', handlePWAInstall);
    return () => window.removeEventListener('pwa-installed', handlePWAInstall);
  }, []);

  return {
    stats,
    incrementDzikirRead,
    incrementInstall,
    isOnline
  };
};