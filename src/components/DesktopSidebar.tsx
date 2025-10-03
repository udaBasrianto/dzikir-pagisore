import React from 'react';
import { Home, Clock, CheckCircle, Menu, Trophy, BarChart3, Database, BookOpen, Bot, Moon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ activeTab, onTabChange }) => {

  const tabs = [
    { id: 'pagi', label: 'Dzikir Pagi', icon: Clock },
    { id: 'petang', label: 'Dzikir Petang', icon: Home },
    { id: 'umum', label: 'Doa Umum', icon: BookOpen },
    { id: 'sholat', label: 'Jadwal Sholat', icon: Moon },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'progress', label: 'Progress', icon: CheckCircle },
    { id: 'gamification', label: 'Gamifikasi', icon: Trophy },
    { id: 'statistics', label: 'Statistik', icon: BarChart3 },
    { id: 'crud', label: 'Kelola Dzikir', icon: Database },
    { id: 'menu', label: 'Menu', icon: Menu },
  ];

  return (
    <div className="w-80 bg-card border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Dzikir App</h1>
        <p className="text-sm text-muted-foreground">Dzikir harian untuk hidup berkah</p>
      </div>


      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};