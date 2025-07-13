import React from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFloatingAction: (action: string) => void;
  showFloatingButton: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onFloatingAction,
  showFloatingButton
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        {children}
      </div>
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
      />
      
      {/* Floating Action Button - only show on dzikir tabs */}
      {showFloatingButton && (
        <FloatingActionButton onActionSelect={onFloatingAction} />
      )}
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};