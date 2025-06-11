import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle, Circle, Plus, Minus } from 'lucide-react';

interface DzikirItem {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  category?: string;
}

interface DzikirCardProps {
  item: DzikirItem;
  onComplete: (id: number) => void;
  isCompleted: boolean;
}

export const DzikirCard: React.FC<DzikirCardProps> = ({ item, onComplete, isCompleted }) => {
  const [currentCount, setCurrentCount] = useState(0);

  const handleIncrement = () => {
    if (currentCount < item.count) {
      const newCount = currentCount + 1;
      setCurrentCount(newCount);
      
      if (newCount === item.count) {
        onComplete(item.id);
      }
    }
  };

  const handleDecrement = () => {
    if (currentCount > 0) {
      setCurrentCount(currentCount - 1);
    }
  };

  const resetCounter = () => {
    setCurrentCount(0);
  };

  return (
    <Card className="mb-4 shadow-sm border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground leading-relaxed">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                Dibaca {item.count}x
              </span>
              {isCompleted && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Arabic Text */}
        <div className="text-right">
          <p className="text-xl leading-loose font-arabic" style={{ fontFamily: 'Arial, sans-serif' }}>
            {item.arabic}
          </p>
        </div>
        
        {/* Transliteration */}
        <div>
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            {item.transliteration}
          </p>
        </div>
        
        {/* Translation */}
        <div>
          <p className="text-sm text-foreground leading-relaxed">
            {item.translation}
          </p>
        </div>
        
        {/* Counter Section */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={currentCount === 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <div className="text-center min-w-[60px]">
              <div className="text-lg font-semibold">
                {currentCount}/{item.count}
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round((currentCount / item.count) * 100)}%
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              disabled={currentCount >= item.count}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCounter}
              className="text-xs"
            >
              Reset
            </Button>
            
            {currentCount === item.count && (
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Selesai
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};