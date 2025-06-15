import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Palette, Type } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeCustomizerProps {
  onClose: () => void;
}

const colorThemes = [
  { name: 'Hijau', primary: '142 76% 36%', secondary: '142 30% 94%', accent: '142 30% 94%' },
  { name: 'Biru', primary: '221 83% 53%', secondary: '221 30% 94%', accent: '221 30% 94%' },
  { name: 'Ungu', primary: '262 83% 58%', secondary: '262 30% 94%', accent: '262 30% 94%' },
  { name: 'Merah', primary: '0 72% 51%', secondary: '0 30% 94%', accent: '0 30% 94%' },
  { name: 'Orange', primary: '24 95% 53%', secondary: '24 30% 94%', accent: '24 30% 94%' },
  { name: 'Pink', primary: '330 81% 60%', secondary: '330 30% 94%', accent: '330 30% 94%' },
  { name: 'Indigo', primary: '239 84% 67%', secondary: '239 30% 94%', accent: '239 30% 94%' },
  { name: 'Teal', primary: '173 58% 39%', secondary: '173 30% 94%', accent: '173 30% 94%' },
];

const fontOptions = [
  { name: 'Inter (Default)', value: 'Inter, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const [selectedColor, setSelectedColor] = useState('Hijau');
  const [selectedFont, setSelectedFont] = useState('Inter (Default)');

  useEffect(() => {
    const savedColor = localStorage.getItem('dzikir-color-theme');
    const savedFont = localStorage.getItem('dzikir-font-family');
    
    if (savedColor) setSelectedColor(savedColor);
    if (savedFont) setSelectedFont(savedFont);
  }, []);

  const applyColorTheme = (colorTheme: typeof colorThemes[0]) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.setProperty('--primary', '142 69% 58%');
      root.style.setProperty('--secondary', '217.2 32.6% 17.5%');
      root.style.setProperty('--accent', '217.2 32.6% 17.5%');
    } else {
      root.style.setProperty('--primary', colorTheme.primary);
      root.style.setProperty('--secondary', colorTheme.secondary);
      root.style.setProperty('--accent', colorTheme.accent);
    }
    
    setSelectedColor(colorTheme.name);
    localStorage.setItem('dzikir-color-theme', colorTheme.name);
  };

  const applyFont = (font: typeof fontOptions[0]) => {
    document.body.style.fontFamily = font.value;
    setSelectedFont(font.name);
    localStorage.setItem('dzikir-font-family', font.name);
    localStorage.setItem('dzikir-font-value', font.value);
  };

  // Apply saved settings on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('dzikir-color-theme');
    const savedFontValue = localStorage.getItem('dzikir-font-value');
    
    if (savedColor) {
      const colorTheme = colorThemes.find(t => t.name === savedColor);
      if (colorTheme && theme !== 'dark') {
        applyColorTheme(colorTheme);
      }
    }
    
    if (savedFontValue) {
      document.body.style.fontFamily = savedFontValue;
    }
  }, [theme]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Kustomisasi Tema</h1>
          <p className="text-sm text-muted-foreground">Personalisasi tampilan aplikasi</p>
        </div>
      </div>

      {/* Color Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Warna Tema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {colorThemes.map((colorTheme) => (
              <Button
                key={colorTheme.name}
                variant={selectedColor === colorTheme.name ? "default" : "outline"}
                className="h-auto p-3 flex items-center gap-3"
                onClick={() => applyColorTheme(colorTheme)}
                disabled={theme === 'dark'}
              >
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: `hsl(${colorTheme.primary})` }}
                />
                <span className="text-sm">{colorTheme.name}</span>
              </Button>
            ))}
          </div>
          {theme === 'dark' && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              💡 Warna kustom tidak tersedia di mode gelap
            </p>
          )}
        </CardContent>
      </Card>

      {/* Font Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Font Keluarga
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {fontOptions.map((font) => (
            <Button
              key={font.name}
              variant={selectedFont === font.name ? "default" : "outline"}
              className="w-full h-auto p-4 justify-start"
              onClick={() => applyFont(font)}
            >
              <div className="text-left">
                <div className="font-medium" style={{ fontFamily: font.value }}>
                  {font.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1" style={{ fontFamily: font.value }}>
                  Contoh teks menggunakan font ini
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <h3 className="font-bold text-primary mb-2">Contoh Judul</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Ini adalah contoh bagaimana teks akan terlihat dengan pengaturan tema saat ini.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Tombol Primary</Button>
              <Button variant="outline" size="sm">Tombol Secondary</Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            ✨ Pengaturan akan tersimpan secara otomatis
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <Card>
        <CardContent className="p-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              // Reset to default
              const defaultColor = colorThemes[0];
              const defaultFont = fontOptions[0];
              
              applyColorTheme(defaultColor);
              applyFont(defaultFont);
              
              localStorage.removeItem('dzikir-color-theme');
              localStorage.removeItem('dzikir-font-family');
              localStorage.removeItem('dzikir-font-value');
            }}
          >
            Reset ke Pengaturan Default
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};