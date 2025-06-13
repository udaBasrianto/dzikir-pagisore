import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Smile } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodTrackerProps {
  onMoodSelected?: (mood: MoodData) => void;
  onClose?: () => void;
}

interface MoodData {
  emoji: string;
  label: string;
  value: number;
  color: string;
}

const moods: MoodData[] = [
  { emoji: '😔', label: 'Sedih', value: 1, color: 'text-gray-500' },
  { emoji: '😐', label: 'Biasa', value: 2, color: 'text-yellow-500' },
  { emoji: '😊', label: 'Senang', value: 3, color: 'text-green-500' },
  { emoji: '😄', label: 'Gembira', value: 4, color: 'text-blue-500' },
  { emoji: '🤲', label: 'Khusyuk', value: 5, color: 'text-purple-500' }
];

export const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodSelected, onClose }) => {
  const [selectedMood, setSelectedMood] = useState<MoodData | null>(null);
  const [todayMood, setTodayMood] = useState<MoodData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load today's mood if already set
    const today = new Date().toDateString();
    const savedMood = localStorage.getItem(`dzikir_mood_${today}`);
    if (savedMood) {
      setTodayMood(JSON.parse(savedMood));
    }
  }, []);

  const handleMoodSelect = (mood: MoodData) => {
    setSelectedMood(mood);
    const today = new Date().toDateString();
    
    // Save mood to localStorage
    localStorage.setItem(`dzikir_mood_${today}`, JSON.stringify(mood));
    setTodayMood(mood);
    
    if (onMoodSelected) {
      onMoodSelected(mood);
    }
    
    toast({
      title: "Mood Tersimpan! 💝",
      description: `Terima kasih telah berbagi perasaan Anda: ${mood.label}`,
    });
  };

  const getMoodStats = () => {
    const stats = { total: 0, average: 0, moods: {} as Record<string, number> };
    
    // Get mood data from last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      const mood = localStorage.getItem(`dzikir_mood_${dateString}`);
      
      if (mood) {
        const moodData = JSON.parse(mood);
        stats.total++;
        stats.average += moodData.value;
        stats.moods[moodData.label] = (stats.moods[moodData.label] || 0) + 1;
      }
    }
    
    if (stats.total > 0) {
      stats.average = Math.round((stats.average / stats.total) * 10) / 10;
    }
    
    return stats;
  };

  const stats = getMoodStats();
  const averageMood = moods.find(m => Math.round(m.value) === Math.round(stats.average));

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          💝 Mood Tracker
        </h1>
        <p className="text-muted-foreground">
          Bagaimana perasaan Anda setelah berdzikir hari ini?
        </p>
      </div>

      {/* Today's Mood Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {todayMood ? 'Mood Hari Ini' : 'Pilih Mood Anda'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayMood ? (
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-4xl mb-2">{todayMood.emoji}</div>
              <p className="font-medium">{todayMood.label}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Terima kasih telah berbagi! 🤲
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setTodayMood(null)}
              >
                Ubah Mood
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood)}
                  className="flex flex-col items-center p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <span className="text-2xl mb-1">{mood.emoji}</span>
                  <span className="text-xs text-center">{mood.label}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Statistics */}
      {stats.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5" />
              Statistik Mood (30 Hari Terakhir)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <div className="text-3xl mb-2">{averageMood?.emoji || '😊'}</div>
              <p className="font-medium">Mood Rata-rata: {averageMood?.label || 'Senang'}</p>
              <p className="text-sm text-muted-foreground">
                Berdasarkan {stats.total} hari data
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Distribusi Mood:</h4>
              {Object.entries(stats.moods).map(([mood, count]) => {
                const percentage = Math.round((count / stats.total) * 100);
                const moodData = moods.find(m => m.label === mood);
                return (
                  <div key={mood} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{moodData?.emoji}</span>
                      <span>{mood}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivational Messages */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6 text-center">
          <div className="text-lg font-semibold mb-2">🌟 Refleksi</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {todayMood ? (
              todayMood.value >= 4 ? (
                "Alhamdulillah! Dzikir membawa ketenangan dan kebahagiaan dalam hati Anda. 🤲"
              ) : todayMood.value >= 3 ? (
                "Subhanallah! Dzikir telah memberi Anda ketenangan. Terus istiqomah! ✨"
              ) : (
                "Semoga dzikir hari ini membawa kedamaian dan menenangkan hati Anda. 🤍"
              )
            ) : (
              "Berbagi perasaan setelah berdzikir membantu kita lebih menghayati manfaat spiritual. 💝"
            )}
          </p>
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