import React from 'react';
import { Home, Clock, Menu, BookOpen, Bot, Moon } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useUserRole();
  
  const tabs = [
    { id: 'pagi', label: 'Pagi', icon: Clock },
    { id: 'petang', label: 'Petang', icon: Home },
    { id: 'sholat', label: 'Sholat', icon: Moon },
    { id: 'ai', label: 'AI', icon: Bot },
    ...(isAdmin ? [{ id: 'menu', label: 'Menu', icon: Menu }] : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};