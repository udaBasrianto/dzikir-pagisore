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
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if browser supports speech synthesis
      if ('speechSynthesis' in window) {
        // Load voices if not loaded
        let voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
          await new Promise((resolve) => {
            speechSynthesis.addEventListener('voiceschanged', resolve, { once: true });
            setTimeout(resolve, 1000); // Fallback timeout
          });
          voices = speechSynthesis.getVoices();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find an Arabic voice or any available voice
        let selectedVoice = voices.find(voice => 
          voice.lang.includes('ar') || voice.name.toLowerCase().includes('arabic')
        );
        
        // Fallback to any available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0];
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        utterance.rate = 0.7; // Slower for better pronunciation
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = 'ar-SA'; // Arabic language
        
        utterance.onstart = () => {
          setIsPlaying(true);
          setIsLoading(false);
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsPlaying(false);
          setIsLoading(false);
          toast({
            title: "Error",
            description: "Tidak dapat memutar audio. Pastikan volume device tidak dalam mode silent.",
            variant: "destructive",
          });
        };
        
        // Cancel any ongoing speech before starting new one
        speechSynthesis.cancel();
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 100);
        
      } else {
        setIsLoading(false);
        toast({
          title: "Fitur Tidak Tersedia",
          description: "Browser tidak mendukung audio untuk bacaan dzikir.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Audio error:', error);
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