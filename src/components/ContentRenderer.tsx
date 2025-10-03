import React from 'react';
import { DzikirTabContent } from '@/components/DzikirTabContent';
import { EnhancedProgress } from '@/components/EnhancedProgress';
import { MenuPage } from '@/components/MenuPage';
import { ShareProgress } from '@/components/ShareProgress';
import { CalendarProgress } from '@/components/CalendarProgress';
import { MoodTracker } from '@/components/MoodTracker';
import { CustomDzikir } from '@/components/CustomDzikir';
import { GamificationPage } from '@/components/GamificationPage';
import { DzikirStatistics } from '@/components/DzikirStatistics';
import { AdminDashboard } from '@/components/AdminDashboard';
import { DzikirManagement } from '@/components/DzikirManagement';
import { AIAssistant } from '@/components/AIAssistant';
import { PrayerTimes } from '@/components/PrayerTimes';
import { DzikirData } from '@/hooks/useDzikirData';

interface ContentRendererProps {
  activeTab: string;
  floatingMenuAction: string | null;
  setFloatingMenuAction: (action: string | null) => void;
  setActiveTab: (tab: string) => void;
  dzikirData: DzikirData;
  completedItems: Set<number>;
  onComplete: (id: number) => void;
  lastDzikirTab: string;
  refreshData: () => void;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  activeTab,
  floatingMenuAction,
  setFloatingMenuAction,
  setActiveTab,
  dzikirData,
  completedItems,
  onComplete,
  lastDzikirTab,
  refreshData
}) => {
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
        <DzikirTabContent
          title="Dzikir Pagi"
          icon="💫"
          description="Mulai hari dengan dzikir dan doa"
          items={dzikirData.pagi}
          completedItems={completedItems}
          onComplete={onComplete}
        />
      );
    
    case 'petang':
      return (
        <DzikirTabContent
          title="Dzikir Petang"
          icon="🌅"
          description="Akhiri hari dengan dzikir dan doa"
          items={dzikirData.petang}
          completedItems={completedItems}
          onComplete={onComplete}
        />
      );
    
    case 'umum':
      return (
        <DzikirTabContent
          title="Doa Umum"
          icon="🤲"
          description="Doa dan dzikir untuk sehari-hari"
          items={dzikirData.umum}
          completedItems={completedItems}
          onComplete={onComplete}
        />
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
    
    case 'ai':
      return <AIAssistant />;
    
    case 'sholat':
      return <PrayerTimes />;
    
    default:
      return null;
  }
};