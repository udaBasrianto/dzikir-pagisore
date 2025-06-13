import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  text: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if browser supports speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find an Arabic voice
        const voices = speechSynthesis.getVoices();
        const arabicVoice = voices.find(voice => 
          voice.lang.includes('ar') || voice.name.includes('Arabic')
        );
        
        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }
        
        utterance.rate = 0.8; // Slower for better pronunciation
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
          setIsPlaying(true);
          setIsLoading(false);
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = (event) => {
          setIsPlaying(false);
          setIsLoading(false);
          toast({
            title: "Error",
            description: "Tidak dapat memutar audio. Coba lagi nanti.",
            variant: "destructive",
          });
        };
        
        speechSynthesis.speak(utterance);
      } else {
        setIsLoading(false);
        toast({
          title: "Fitur Tidak Tersedia",
          description: "Browser tidak mendukung audio untuk bacaan dzikir.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memutar audio.",
        variant: "destructive",
      });
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePlayAudio}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        <span className="text-xs hidden sm:inline">
          {isLoading ? 'Loading...' : isPlaying ? 'Jeda' : 'Dengar'}
        </span>
      </Button>
      
      {isPlaying && (
        <Button
          variant="ghost"
          size="sm"
          onClick={stopAudio}
          className="text-xs"
        >
          <VolumeX className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};