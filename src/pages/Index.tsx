import React, { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { DesktopLayout } from '@/components/layouts/DesktopLayout';
import { ContentRenderer } from '@/components/ContentRenderer';
import { LoginPage } from '@/components/LoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { useStreak } from '@/hooks/useStreak';
import { useDzikirData } from '@/hooks/useDzikirData';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const shouldShowFloatingButton = (activeTab === 'pagi' || activeTab === 'petang' || activeTab === 'umum') && !floatingMenuAction;

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

  const content = (
    <ContentRenderer
      activeTab={activeTab}
      floatingMenuAction={floatingMenuAction}
      setFloatingMenuAction={setFloatingMenuAction}
      setActiveTab={setActiveTab}
      dzikirData={dzikirData}
      completedItems={completedItems}
      onComplete={handleComplete}
      lastDzikirTab={lastDzikirTab}
      refreshData={refreshData}
    />
  );

  if (isMobile) {
    return (
      <MobileLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onFloatingAction={handleFloatingAction}
        showFloatingButton={shouldShowFloatingButton}
      >
        {content}
      </MobileLayout>
    );
  }

  return (
    <DesktopLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {content}
    </DesktopLayout>
  );
};

export default Index;
