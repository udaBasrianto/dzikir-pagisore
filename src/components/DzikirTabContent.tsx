import React from 'react';
import { DzikirCard } from '@/components/DzikirCard';
import { DzikirItem } from '@/types/dzikir';

interface DzikirTabContentProps {
  title: string;
  icon: string;
  description: string;
  items: DzikirItem[];
  completedItems: Set<number>;
  onComplete: (id: number) => void;
}

export const DzikirTabContent: React.FC<DzikirTabContentProps> = ({
  title,
  icon,
  description,
  items,
  completedItems,
  onComplete
}) => {
  return (
    <div className="space-y-4 pb-20">
      <div className="text-center mb-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {icon} {title}
        </h1>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
        <div className="text-xs text-muted-foreground mt-2">
          {completedItems.size}/{items.length} selesai
        </div>
      </div>
      
      {items.map((item) => (
        <DzikirCard
          key={item.id}
          item={item}
          onComplete={onComplete}
          isCompleted={completedItems.has(item.id)}
        />
      ))}
    </div>
  );
};