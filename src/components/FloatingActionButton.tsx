import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Share2, Calendar, Smile, BookOpen } from 'lucide-react';

interface FloatingActionButtonProps {
  onActionSelect: (action: string) => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onActionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'share', icon: Share2, label: 'Bagikan', color: 'bg-blue-500' },
    { id: 'calendar', icon: Calendar, label: 'Kalender', color: 'bg-green-500' },
    { id: 'mood', icon: Smile, label: 'Mood', color: 'bg-yellow-500' },
    { id: 'custom-dzikir', icon: BookOpen, label: 'Dzikir', color: 'bg-purple-500' }
  ];

  const handleAction = (actionId: string) => {
    onActionSelect(actionId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Action buttons */}
      {isOpen && (
        <div className="flex flex-col gap-2 mb-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="animate-slide-up flex items-center gap-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-background/90 backdrop-blur-sm text-xs px-2 py-1 rounded-lg shadow-lg border">
                  {action.label}
                </span>
                <Button
                  size="sm"
                  className={`w-10 h-10 rounded-full ${action.color} hover:scale-110 transition-transform shadow-lg`}
                  onClick={() => handleAction(action.id)}
                >
                  <Icon className="w-4 h-4 text-white" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="lg"
        className={`w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
};