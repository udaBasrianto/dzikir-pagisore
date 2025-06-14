import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  text: string;
  className?: string;
  enableElevenLabs?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  text, 
  className = '', 
  enableElevenLabs = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      speechSynthesis.cancel();
    };
  }, [audioUrl]);

  const generateElevenLabsAudio = async (): Promise<string> => {
    const apiKey = localStorage.getItem('elevenlabs-api-key');
    if (!apiKey) {
      throw new Error('ElevenLabs API key not found. Please add it in settings.');
    }

    // Using a multi-lingual voice that supports Arabic
    const voiceId = '9BWtsMINqrJLrRacOk9x'; // Aria - good for multilingual content
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid ElevenLabs API key. Please check your API key.');
      }
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  };

  const playElevenLabsAudio = async () => {
    try {
      setIsLoading(true);
      const url = await generateElevenLabsAudio();
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplay = () => {
        setIsLoading(false);
        audio.play();
        setIsPlaying(true);
      };
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        throw new Error('Audio playback failed');
      };

      audio.load();
    } catch (error) {
      console.error('ElevenLabs audio error:', error);
      throw error;
    }
  };

  const playSpeechSynthesis = async () => {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Wait for voices to load
    let voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 2000);
        speechSynthesis.addEventListener('voiceschanged', () => {
          clearTimeout(timeout);
          resolve(void 0);
        }, { once: true });
      });
      voices = speechSynthesis.getVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find best Arabic voice
    let selectedVoice = voices.find(voice => 
      voice.lang.includes('ar') && voice.name.toLowerCase().includes('male')
    ) || voices.find(voice => 
      voice.lang.includes('ar')
    ) || voices.find(voice => 
      voice.lang.startsWith('ar')
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Optimize for Arabic
    utterance.rate = 0.6;
    utterance.pitch = 0.9;
    utterance.volume = 1;
    utterance.lang = 'ar-SA';

    return new Promise<void>((resolve, reject) => {
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        resolve();
      };
      
      utterance.onerror = (event) => {
        setIsPlaying(false);
        setIsLoading(false);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 100);
    });
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      handleStopAudio();
      return;
    }

    try {
      setIsLoading(true);

      // Try ElevenLabs first if enabled and API key is available
      if (enableElevenLabs && localStorage.getItem('elevenlabs-api-key')) {
        try {
          await playElevenLabsAudio();
          return;
        } catch (error) {
          console.warn('ElevenLabs failed, falling back to speech synthesis:', error);
          toast({
            title: "ElevenLabs Error",
            description: "Falling back to browser speech synthesis",
            variant: "destructive",
          });
        }
      }

      // Fallback to speech synthesis
      await playSpeechSynthesis();

    } catch (error) {
      console.error('Audio error:', error);
      setIsLoading(false);
      setIsPlaying(false);
      
      toast({
        title: "Audio Error",
        description: error instanceof Error ? error.message : "Cannot play audio. Please check your device settings.",
        variant: "destructive",
      });
    }
  };

  const handleStopAudio = () => {
    setIsPlaying(false);
    setIsLoading(false);

    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePlayAudio}
        disabled={isLoading}
        className="flex items-center gap-1 min-w-[80px]"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
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
          onClick={handleStopAudio}
          className="text-xs"
        >
          <VolumeX className="w-4 h-4" />
        </Button>
      )}

      {/* Show which audio engine is being used */}
      <div className="text-xs text-muted-foreground">
        {enableElevenLabs && localStorage.getItem('elevenlabs-api-key') ? '🎵' : '🔊'}
      </div>
    </div>
  );
};