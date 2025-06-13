import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface CalendarProgressProps {
  onClose?: () => void;
}

export const CalendarProgress: React.FC<CalendarProgressProps> = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDayProgress = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toDateString();
    const progress = localStorage.getItem(`dzikir_progress_${dateString}`);
    return progress ? JSON.parse(progress).length : 0;
  };

  const getMoodForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toDateString();
    const mood = localStorage.getItem(`dzikir_mood_${dateString}`);
    return mood ? JSON.parse(mood) : null;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const progress = getDayProgress(day);
      const mood = getMoodForDay(day);
      const isToday = isCurrentMonth && day === today.getDate();
      const isFuture = isCurrentMonth && day > today.getDate();
      
      const progressPercentage = progress > 0 ? Math.min((progress / 20) * 100, 100) : 0; // Assuming ~20 total dzikir
      
      days.push(
        <div
          key={day}
          className={`
            h-12 w-full rounded-lg border-2 flex flex-col items-center justify-center text-xs
            ${isToday ? 'border-primary bg-primary/10' : 'border-border'}
            ${isFuture ? 'opacity-50' : ''}
            ${progressPercentage === 100 ? 'bg-green-100 dark:bg-green-950' : ''}
            ${progressPercentage > 0 && progressPercentage < 100 ? 'bg-yellow-100 dark:bg-yellow-950' : ''}
          `}
        >
          <span className={`font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
            {day}
          </span>
          {progressPercentage === 100 && (
            <CheckCircle className="w-3 h-3 text-green-600" />
          )}
          {mood && (
            <span className="text-xs">{mood.emoji}</span>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          📅 Kalender Progress
        </h1>
        <p className="text-muted-foreground">
          Pantau konsistensi dzikir harian Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <CardTitle className="text-lg">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map(dayName => (
              <div key={dayName} className="text-center text-xs font-medium text-muted-foreground py-2">
                {dayName}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border-2 border-border" />
              <span>Belum</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-100 dark:bg-yellow-950" />
              <span>Sebagian</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-950" />
              <span>Selesai</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {onClose && (
        <Button onClick={onClose} variant="outline" className="w-full">
          Kembali
        </Button>
      )}
    </div>
  );
};