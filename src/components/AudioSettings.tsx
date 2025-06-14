import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Volume2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioSettingsProps {
  onClose: () => void;
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('elevenlabs-api-key') || '');
  const [enableElevenLabs, setEnableElevenLabs] = useState(
    localStorage.getItem('enable-elevenlabs') === 'true'
  );
  const { toast } = useToast();

  const handleSaveSettings = () => {
    if (apiKey.trim()) {
      localStorage.setItem('elevenlabs-api-key', apiKey.trim());
    } else {
      localStorage.removeItem('elevenlabs-api-key');
    }
    
    localStorage.setItem('enable-elevenlabs', enableElevenLabs.toString());
    
    toast({
      title: "✅ Pengaturan Disimpan",
      description: "Pengaturan audio telah diperbarui",
    });
    
    onClose();
  };

  const testAudio = async () => {
    const testText = "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ";
    
    if (enableElevenLabs && apiKey) {
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text: testText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true
            }
          }),
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          audio.onended = () => URL.revokeObjectURL(audioUrl);
          audio.play();
          
          toast({
            title: "🎵 Test Berhasil",
            description: "ElevenLabs API berfungsi dengan baik!",
          });
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      } catch (error) {
        toast({
          title: "❌ Test Gagal",
          description: "Periksa API key ElevenLabs Anda",
          variant: "destructive",
        });
      }
    } else {
      // Test with speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(testText);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.6;
        speechSynthesis.speak(utterance);
        
        toast({
          title: "🔊 Test Speech Synthesis",
          description: "Menggunakan audio browser",
        });
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold text-foreground">🎵 Pengaturan Audio</h1>
      </div>

      {/* ElevenLabs Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            ElevenLabs AI Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-elevenlabs" className="text-sm font-medium">
                Aktifkan ElevenLabs
              </Label>
              <p className="text-xs text-muted-foreground">
                Audio berkualitas tinggi dengan pronunciation Arabic yang sempurna
              </p>
            </div>
            <Switch
              id="enable-elevenlabs"
              checked={enableElevenLabs}
              onCheckedChange={setEnableElevenLabs}
            />
          </div>

          {enableElevenLabs && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="api-key" className="text-sm font-medium">
                  ElevenLabs API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Masukkan API key ElevenLabs..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Dapatkan API key gratis di{' '}
                  <a 
                    href="https://elevenlabs.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    elevenlabs.io
                  </a>
                </p>
              </div>

              <Button
                onClick={testAudio}
                disabled={!apiKey.trim()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Test Audio
              </Button>
            </div>
          )}

          {!enableElevenLabs && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                📱 Menggunakan audio browser default. Kualitas pronunciation mungkin bervariasi tergantung device.
              </p>
              <Button
                onClick={testAudio}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Test Audio Browser
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3">
            🎯 Keunggulan ElevenLabs AI Audio:
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <span>Pronunciation Arabic yang sangat akurat</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <span>Kualitas audio professional HD</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <span>Konsisten di semua device dan browser</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <span>Voice yang natural dan mudah didengar</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <span>Unlimited usage dengan free tier</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3">
            📋 Cara Setup ElevenLabs:
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Buka <strong>elevenlabs.io</strong> dan buat akun gratis</p>
            <p>2. Masuk ke dashboard dan copy API key Anda</p>
            <p>3. Paste API key di field di atas</p>
            <p>4. Aktifkan toggle ElevenLabs</p>
            <p>5. Test audio untuk memastikan semuanya berfungsi</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSaveSettings} className="w-full" size="lg">
        <Settings className="w-4 h-4 mr-2" />
        Simpan Pengaturan
      </Button>
    </div>
  );
};