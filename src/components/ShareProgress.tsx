import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Download, Copy, Image, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareProgressProps {
  completedItems: Set<number>;
  totalItems: number;
  currentTab: string;
  onClose?: () => void;
}

export const ShareProgress: React.FC<ShareProgressProps> = ({ 
  completedItems, 
  totalItems, 
  currentTab,
  onClose 
}) => {
  const { toast } = useToast();
  const progressPercentage = totalItems > 0 ? Math.round((completedItems.size / totalItems) * 100) : 0;

  const getStreakData = () => {
    const streakData = localStorage.getItem('dzikir-streak');
    if (streakData) {
      const data = JSON.parse(streakData);
      return { current: data.current || 0, best: data.best || 0 };
    }
    return { current: 0, best: 0 };
  };

  const streak = getStreakData();

  const generateShareText = () => {
    const messages = [
      `🤲 Alhamdulillah! Saya telah menyelesaikan ${progressPercentage}% dzikir ${currentTab} hari ini`,
      `📿 Progress dzikir hari ini: ${completedItems.size}/${totalItems} (${progressPercentage}%)`,
      `🔥 Streak dzikir: ${streak.current} hari berturut-turut`,
      `🏆 Rekor terbaik: ${streak.best} hari`,
      ``,
      `Yuk, jaga konsistensi dzikir bersama! 💫`,
      `#Dzikir #IslamicApp #Spirituality #Consistency`
    ].join('\n');

    return messages;
  };

  const generateDetailedReport = () => {
    const today = new Date();
    const weekDays = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      const dayProgress = localStorage.getItem(`dzikir_progress_${dateString}`);
      const completed = dayProgress ? JSON.parse(dayProgress).length : 0;
      const percentage = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
      
      weekDays.push({
        date: date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }),
        completed,
        percentage
      });
    }

    const weeklyAverage = Math.round(weekDays.reduce((sum, day) => sum + day.percentage, 0) / 7);

    return [
      `📊 LAPORAN DZIKIR MINGGUAN`,
      `==========================`,
      ``,
      `📅 Periode: ${weekDays[0].date} - ${weekDays[6].date}`,
      ``,
      `📈 Progress Harian:`,
      ...weekDays.map(day => `${day.date}: ${day.percentage}% (${day.completed}/${totalItems})`),
      ``,
      `📊 Statistik:`,
      `• Rata-rata mingguan: ${weeklyAverage}%`,
      `• Streak saat ini: ${streak.current} hari`,
      `• Rekor terbaik: ${streak.best} hari`,
      `• Progress hari ini: ${progressPercentage}%`,
      ``,
      `🤲 Alhamdulillahi rabbil 'alamiin`,
      ``,
      `#DzikirReport #IslamicLifestyle #Spirituality`
    ].join('\n');
  };

  const handleShare = async (type: 'simple' | 'detailed') => {
    const text = type === 'simple' ? generateShareText() : generateDetailedReport();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Progress Dzikir Saya',
          text: text
        });
        toast({
          title: "Berhasil Dibagikan! 🎉",
          description: "Progress dzikir Anda telah dibagikan.",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          handleCopyToClipboard(text);
        }
      }
    } else {
      handleCopyToClipboard(text);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Disalin ke Clipboard! 📋",
        description: "Text telah disalin, paste di aplikasi favorit Anda.",
      });
    } catch (error) {
      toast({
        title: "Gagal Menyalin",
        description: "Silakan salin text secara manual.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = () => {
    const report = generateDetailedReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dzikir-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Laporan Diunduh! 📁",
      description: "File laporan dzikir telah disimpan.",
    });
  };

  const motivationalMessages = [
    "Konsistensi adalah kunci kesuksesan spiritual! 🔑",
    "Setiap dzikir membawa berkah dalam hidup. ✨",
    "Berbagi kebaikan akan menginspirasi orang lain. 🌟",
    "Progress sekecil apapun tetap bermakna. 💪"
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          📤 Bagikan Progress
        </h1>
        <p className="text-muted-foreground">
          Inspirasi orang lain dengan perjalanan dzikir Anda
        </p>
      </div>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6 text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {progressPercentage}%
          </div>
          <p className="text-foreground font-medium mb-1">
            Progress Dzikir {currentTab === 'pagi' ? 'Pagi' : 'Petang'} Hari Ini
          </p>
          <p className="text-sm text-muted-foreground">
            {completedItems.size} dari {totalItems} dzikir selesai
          </p>
          
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-orange-600">🔥 {streak.current}</div>
              <div className="text-muted-foreground">Hari Streak</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-yellow-600">🏆 {streak.best}</div>
              <div className="text-muted-foreground">Rekor Terbaik</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Pilihan Berbagi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={() => handleShare('simple')} 
            className="w-full justify-start"
            variant="outline"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan Progress Singkat
          </Button>
          
          <Button 
            onClick={() => handleShare('detailed')} 
            className="w-full justify-start"
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Bagikan Laporan Lengkap
          </Button>
          
          <Button 
            onClick={() => handleCopyToClipboard(generateShareText())} 
            className="w-full justify-start"
            variant="outline"
          >
            <Copy className="w-4 h-4 mr-2" />
            Salin ke Clipboard
          </Button>
          
          <Button 
            onClick={handleDownloadReport} 
            className="w-full justify-start"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Unduh Laporan (.txt)
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>👀 Preview Pesan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg text-sm">
            <pre className="whitespace-pre-wrap font-sans">
              {generateShareText()}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardContent className="p-6 text-center">
          <div className="text-lg font-semibold mb-2">💡 Inspirasi</div>
          <p className="text-sm text-muted-foreground">
            {randomMessage}
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