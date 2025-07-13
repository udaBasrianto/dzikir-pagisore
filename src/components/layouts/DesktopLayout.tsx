import React from 'react';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

interface DesktopLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="min-h-screen bg-background flex">
      <DesktopSidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
      />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};