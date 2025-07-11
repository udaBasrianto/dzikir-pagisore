import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle, Circle, Plus, Minus, Eye, RotateCcw } from 'lucide-react';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useGlobalCounter } from '@/hooks/useGlobalCounter';
import { useGamification } from '@/hooks/useGamification';
import { useDzikirCounter } from '@/hooks/useDzikirCounter';

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
  const { incrementDzikirRead } = useGlobalCounter();
  const { incrementDzikirRead: incrementGamificationDzikir } = useGamification();
  
  // Use dzikir counter hook for persistent data
  const { 
    count: persistentCount, 
    totalViews, 
    lastRead, 
    incrementCount: incrementPersistentCount,
    resetCount: resetPersistentCount,
    resetAll: resetAllData
  } = useDzikirCounter(item.id);

  const handleIncrement = () => {
    if (currentCount < item.count) {
      const newCount = currentCount + 1;
      setCurrentCount(newCount);
      
      // Increment persistent count
      incrementPersistentCount();
      
      // Increment global counter for each dzikir read
      incrementDzikirRead();
      
      // Increment gamification counter
      incrementGamificationDzikir();
      
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

  const resetSessionCounter = () => {
    setCurrentCount(0);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('id-ID', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="mb-4 shadow-lg border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground leading-relaxed">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                Dibaca 100x
              </span>
              {isCompleted && (
                <CheckCircle className="w-4 h-4 text-green-600 animate-scale-in" />
              )}
            </div>
            
            {/* View Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{totalViews} views</span>
              </div>
              {persistentCount > 0 && (
                <div>
                  Total dibaca: {persistentCount}x
                </div>
              )}
              {lastRead && (
                <div>
                  Terakhir: {formatDate(lastRead)}
                </div>
              )}
            </div>
          </div>
          
          {/* Reset All Button */}
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAllData}
              className="text-xs h-8 px-2"
              title="Reset semua data"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Arabic Text */}
        <div className="text-right">
          <p className="text-xl leading-loose font-arabic text-primary">
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
        
        {/* Audio Player */}
        <div className="flex justify-center pt-2">
          <AudioPlayer 
            text={item.arabic} 
            enableElevenLabs={localStorage.getItem('enable-elevenlabs') === 'true'}
          />
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
              onClick={resetSessionCounter}
              className="text-xs"
            >
              Reset Sesi
            </Button>
            
            {currentCount === item.count && (
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Selesai
              </div>
            )}
          </div>
        </div>
        
        {/* Statistics Summary */}
        {(persistentCount > 0 || totalViews > 0) && (
          <div className="pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-medium text-foreground">{totalViews}</div>
                  <div>Views</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">{persistentCount}</div>
                  <div>Total Baca</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">{currentCount}</div>
                  <div>Sesi Ini</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};