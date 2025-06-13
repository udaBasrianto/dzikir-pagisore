import React, { useState, useEffect } from 'react';
import { DzikirCard } from '@/components/DzikirCard';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ProgressPage } from '@/components/ProgressPage';
import { MenuPage } from '@/components/MenuPage';
import { dzikirPagiData, dzikirPetangData } from '@/data/dzikirData';

const Index = () => {
  const [activeTab, setActiveTab] = useState('pagi');
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [lastDzikirTab, setLastDzikirTab] = useState('pagi');

  // Load progress from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedProgress = localStorage.getItem(`dzikir_progress_${today}`);
    if (savedProgress) {
      setCompletedItems(new Set(JSON.parse(savedProgress)));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`dzikir_progress_${today}`, JSON.stringify([...completedItems]));
  }, [completedItems]);

  const handleComplete = (id: number) => {
    setCompletedItems(prev => new Set([...prev, id]));
  };

  // Update lastDzikirTab when switching between dzikir tabs
  useEffect(() => {
    if (activeTab === 'pagi' || activeTab === 'petang') {
      setLastDzikirTab(activeTab);
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'pagi':
        return (
          <div className="space-y-4 pb-20">
            <div className="text-center mb-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                💫 Dzikir Pagi
              </h1>
              <p className="text-muted-foreground text-sm">
                Mulai hari dengan dzikir dan doa
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {completedItems.size}/{dzikirPagiData.length} selesai
              </div>
            </div>
            
            {dzikirPagiData.map((item) => (
              <DzikirCard
                key={item.id}
                item={item}
                onComplete={handleComplete}
                isCompleted={completedItems.has(item.id)}
              />
            ))}
          </div>
        );
      
      case 'petang':
        return (
          <div className="space-y-4 pb-20">
            <div className="text-center mb-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                🌅 Dzikir Petang
              </h1>
              <p className="text-muted-foreground text-sm">
                Akhiri hari dengan dzikir dan doa
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {completedItems.size}/{dzikirPetangData.length} selesai
              </div>
            </div>
            
            {dzikirPetangData.map((item) => (
              <DzikirCard
                key={item.id}
                item={item}
                onComplete={handleComplete}
                isCompleted={completedItems.has(item.id)}
              />
            ))}
          </div>
        );
      
      case 'progress':
        return (
          <ProgressPage 
            completedItems={completedItems}
            totalItems={lastDzikirTab === 'pagi' ? dzikirPagiData.length : dzikirPetangData.length}
          />
        );
      
      case 'menu':
        return <MenuPage onNavigate={setActiveTab} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        {renderContent()}
      </div>
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Index;
