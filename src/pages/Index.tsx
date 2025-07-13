import React, { useState, useEffect } from 'react';
import { DzikirCard } from '@/components/DzikirCard';
import { BottomNavigation } from '@/components/BottomNavigation';
import { EnhancedProgress } from '@/components/EnhancedProgress';
import { MenuPage } from '@/components/MenuPage';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { CalendarProgress } from '@/components/CalendarProgress';
import { MoodTracker } from '@/components/MoodTracker';
import { CustomDzikir } from '@/components/CustomDzikir';
import { ShareProgress } from '@/components/ShareProgress';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { GamificationPage } from '@/components/GamificationPage';
import { DzikirStatistics } from '@/components/DzikirStatistics';
import { LoginPage } from '@/components/LoginPage';
import { AdminDashboard } from '@/components/AdminDashboard';
import { DzikirManagement } from '@/components/DzikirManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useStreak } from '@/hooks/useStreak';
import { useDzikirData } from '@/hooks/useDzikirData';
import { useIsMobile } from '@/hooks/use-mobile';
import { DesktopSidebar } from '@/components/DesktopSidebar';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const isMobile = useIsMobile();
  const { data: dzikirData, loading: dzikirLoading, refreshData } = useDzikirData();
  const [activeTab, setActiveTab] = useState('pagi');
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [lastDzikirTab, setLastDzikirTab] = useState('pagi');
  const [floatingMenuAction, setFloatingMenuAction] = useState<string | null>(null);
  
  // Use streak hook to track progress
  const currentTotalItems = lastDzikirTab === 'pagi' ? dzikirData.pagi.length : 
                           lastDzikirTab === 'petang' ? dzikirData.petang.length : dzikirData.umum.length;
  useStreak(completedItems, currentTotalItems);

  // Refresh data when tab changes back to dzikir tabs
  useEffect(() => {
    if (activeTab === 'pagi' || activeTab === 'petang' || activeTab === 'umum') {
      refreshData();
    }
  }, [activeTab]);

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
    if (activeTab === 'pagi' || activeTab === 'petang' || activeTab === 'umum') {
      setLastDzikirTab(activeTab);
    }
  }, [activeTab]);

  const handleFloatingAction = (action: string) => {
    setFloatingMenuAction(action);
  };

  const renderContent = () => {
    // Handle floating menu actions
    if (floatingMenuAction) {
      switch (floatingMenuAction) {
        case 'share':
          return (
            <ShareProgress 
              completedItems={completedItems}
              totalItems={lastDzikirTab === 'pagi' ? dzikirData.pagi.length : 
                         lastDzikirTab === 'petang' ? dzikirData.petang.length : dzikirData.umum.length}
              currentTab={lastDzikirTab}
              onClose={() => setFloatingMenuAction(null)}
            />
          );
        case 'calendar':
          return <CalendarProgress onClose={() => setFloatingMenuAction(null)} />;
        case 'mood':
          return <MoodTracker onClose={() => setFloatingMenuAction(null)} />;
        case 'custom-dzikir':
          return <CustomDzikir onClose={() => setFloatingMenuAction(null)} />;
        default:
          setFloatingMenuAction(null);
          break;
      }
    }

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
                {completedItems.size}/{dzikirData.pagi.length} selesai
              </div>
            </div>
            
            {dzikirData.pagi.map((item) => (
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
                {completedItems.size}/{dzikirData.petang.length} selesai
              </div>
            </div>
            
            {dzikirData.petang.map((item) => (
              <DzikirCard
                key={item.id}
                item={item}
                onComplete={handleComplete}
                isCompleted={completedItems.has(item.id)}
              />
            ))}
          </div>
        );
      
      case 'umum':
        return (
          <div className="space-y-4 pb-20">
            <div className="text-center mb-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                🤲 Doa Umum
              </h1>
              <p className="text-muted-foreground text-sm">
                Doa dan dzikir untuk sehari-hari
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {completedItems.size}/{dzikirData.umum.length} selesai
              </div>
            </div>
            
            {dzikirData.umum.map((item) => (
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
          <EnhancedProgress 
            completedItems={completedItems}
            totalItems={lastDzikirTab === 'pagi' ? dzikirData.pagi.length : 
                       lastDzikirTab === 'petang' ? dzikirData.petang.length : dzikirData.umum.length}
            currentTab={lastDzikirTab}
          />
        );
      
      case 'menu':
        return (
          <MenuPage 
            onNavigate={setActiveTab} 
          />
        );
      
      case 'gamifikasi':
        return <GamificationPage onClose={() => setActiveTab('menu')} />;
      
      case 'statistik':
        return <DzikirStatistics />;
      
      case 'admin':
        return <AdminDashboard onClose={() => setActiveTab('menu')} />;
      
      case 'crud':
        return <DzikirManagement onDataChange={refreshData} />;
      
      default:
        return null;
    }
  };

  if (loading || dzikirLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (isMobile) {
    // Mobile Layout
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-6">
          {renderContent()}
        </div>
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        {/* Floating Action Button - only show on dzikir tabs */}
        {(activeTab === 'pagi' || activeTab === 'petang' || activeTab === 'umum') && !floatingMenuAction && (
          <FloatingActionButton onActionSelect={handleFloatingAction} />
        )}
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background flex">
      <DesktopSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
