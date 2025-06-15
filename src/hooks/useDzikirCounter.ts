import { useState, useEffect } from 'react';

export interface DzikirCount {
  id: number;
  count: number;
  lastRead: Date;
  totalViews: number;
}

export const useDzikirCounter = (dzikirId: number) => {
  const [count, setCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [lastRead, setLastRead] = useState<Date | null>(null);

  const storageKey = `dzikir-count-${dzikirId}`;
  const viewsKey = `dzikir-views-${dzikirId}`;

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    const savedViews = localStorage.getItem(viewsKey);
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCount(parsed.count || 0);
        setLastRead(parsed.lastRead ? new Date(parsed.lastRead) : null);
      } catch (error) {
        console.error('Error parsing saved dzikir data:', error);
      }
    }

    if (savedViews) {
      setTotalViews(parseInt(savedViews) || 0);
    }

    // Increment view count when component mounts (dzikir is viewed)
    const currentViews = parseInt(savedViews || '0');
    const newViews = currentViews + 1;
    setTotalViews(newViews);
    localStorage.setItem(viewsKey, newViews.toString());
  }, [dzikirId]);

  // Save data whenever count changes
  useEffect(() => {
    if (count > 0 || lastRead) {
      const dataToSave = {
        id: dzikirId,
        count,
        lastRead: lastRead?.toISOString(),
        totalViews
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [count, lastRead, totalViews, dzikirId]);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    setLastRead(new Date());
  };

  const resetCount = () => {
    setCount(0);
    setLastRead(null);
    localStorage.removeItem(storageKey);
  };

  const resetViews = () => {
    setTotalViews(0);
    localStorage.removeItem(viewsKey);
  };

  const resetAll = () => {
    resetCount();
    resetViews();
  };

  return {
    count,
    totalViews,
    lastRead,
    incrementCount,
    resetCount,
    resetViews,
    resetAll
  };
};