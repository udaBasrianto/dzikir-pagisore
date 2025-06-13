import { useEffect, useState } from 'react';

interface GlobalStats {
  totalReads: number;
  appInstalls: number;
  activeUsers: number;
}

export const useGlobalCounter = () => {
  const [stats, setStats] = useState<GlobalStats>({
    totalReads: 0,
    appInstalls: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Initialize or get existing stats
    const totalReads = parseInt(localStorage.getItem('global-dzikir-reads') || '1247');
    const appInstalls = parseInt(localStorage.getItem('app-installs') || '156');
    const activeUsers = parseInt(localStorage.getItem('active-users') || '89');
    
    setStats({
      totalReads,
      appInstalls, 
      activeUsers
    });

    // Mark this user as active
    const lastActive = localStorage.getItem('last-active');
    const today = new Date().toDateString();
    if (lastActive !== today) {
      localStorage.setItem('last-active', today);
      localStorage.setItem('active-users', (activeUsers + 1).toString());
    }
  }, []);

  const incrementDzikirRead = () => {
    const currentReads = parseInt(localStorage.getItem('global-dzikir-reads') || '1247');
    const newReads = currentReads + 1;
    localStorage.setItem('global-dzikir-reads', newReads.toString());
    setStats(prev => ({ ...prev, totalReads: newReads }));
  };

  const incrementInstall = () => {
    const currentInstalls = parseInt(localStorage.getItem('app-installs') || '156');
    const newInstalls = currentInstalls + 1;
    localStorage.setItem('app-installs', newInstalls.toString());
    setStats(prev => ({ ...prev, appInstalls: newInstalls }));
  };

  return {
    stats,
    incrementDzikirRead,
    incrementInstall
  };
};