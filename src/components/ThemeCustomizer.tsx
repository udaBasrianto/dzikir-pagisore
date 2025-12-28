import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Palette, Type, TextCursor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Slider } from '@/components/ui/slider';

interface ThemeCustomizerProps {
  onClose: () => void;
}

const lightColorThemes = [
  { name: 'Hijau', primary: '142 76% 36%', secondary: '142 30% 94%', accent: '142 30% 94%' },
  { name: 'Biru', primary: '221 83% 53%', secondary: '221 30% 94%', accent: '221 30% 94%' },
  { name: 'Ungu', primary: '262 83% 58%', secondary: '262 30% 94%', accent: '262 30% 94%' },
  { name: 'Merah', primary: '0 72% 51%', secondary: '0 30% 94%', accent: '0 30% 94%' },
  { name: 'Orange', primary: '24 95% 53%', secondary: '24 30% 94%', accent: '24 30% 94%' },
  { name: 'Pink', primary: '330 81% 60%', secondary: '330 30% 94%', accent: '330 30% 94%' },
  { name: 'Indigo', primary: '239 84% 67%', secondary: '239 30% 94%', accent: '239 30% 94%' },
  { name: 'Teal', primary: '173 58% 39%', secondary: '173 30% 94%', accent: '173 30% 94%' },
];

const darkColorThemes = [
  { name: 'Hijau', primary: '142 69% 58%', secondary: '142 30% 15%', accent: '142 30% 15%' },
  { name: 'Biru', primary: '221 83% 65%', secondary: '221 30% 15%', accent: '221 30% 15%' },
  { name: 'Ungu', primary: '262 83% 68%', secondary: '262 30% 15%', accent: '262 30% 15%' },
  { name: 'Merah', primary: '0 72% 60%', secondary: '0 30% 15%', accent: '0 30% 15%' },
  { name: 'Orange', primary: '24 95% 60%', secondary: '24 30% 15%', accent: '24 30% 15%' },
  { name: 'Pink', primary: '330 81% 70%', secondary: '330 30% 15%', accent: '330 30% 15%' },
  { name: 'Indigo', primary: '239 84% 75%', secondary: '239 30% 15%', accent: '239 30% 15%' },
  { name: 'Teal', primary: '173 58% 50%', secondary: '173 30% 15%', accent: '173 30% 15%' },
];

const fontOptions = [
  { name: 'Poppins (Default)', value: 'Poppins, sans-serif' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
];

const arabicFontOptions = [
  { name: 'Amiri (Default)', value: 'Amiri', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
  { name: 'Scheherazade New', value: 'Scheherazade New', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
  { name: 'Noto Naskh Arabic', value: 'Noto Naskh Arabic', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
  { name: 'Lateef', value: 'Lateef', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
];

const fontSizeOptions = [
  { name: 'Kecil', value: 'small', class: 'font-size-small' },
  { name: 'Sedang', value: 'medium', class: 'font-size-medium' },
  { name: 'Besar', value: 'large', class: 'font-size-large' },
  { name: 'Sangat Besar', value: 'xlarge', class: 'font-size-xlarge' },
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const [selectedLightColor, setSelectedLightColor] = useState('Hijau');
  const [selectedDarkColor, setSelectedDarkColor] = useState('Hijau');
  const [selectedFont, setSelectedFont] = useState('Poppins (Default)');
  const [selectedArabicFont, setSelectedArabicFont] = useState('Amiri (Default)');
  const [selectedFontSize, setSelectedFontSize] = useState('medium');

  useEffect(() => {
    const savedLightColor = localStorage.getItem('dzikir-light-color-theme');
    const savedDarkColor = localStorage.getItem('dzikir-dark-color-theme');
    const savedFont = localStorage.getItem('dzikir-font-family');
    const savedArabicFont = localStorage.getItem('dzikir-arabic-font');
    const savedFontSize = localStorage.getItem('dzikir-font-size');
    
    if (savedLightColor) setSelectedLightColor(savedLightColor);
    if (savedDarkColor) setSelectedDarkColor(savedDarkColor);
    if (savedFont) setSelectedFont(savedFont);
    if (savedArabicFont) setSelectedArabicFont(savedArabicFont);
    if (savedFontSize) setSelectedFontSize(savedFontSize);
  }, []);

  const applyLightColorTheme = (colorTheme: typeof lightColorThemes[0]) => {
    const root = document.documentElement;
    
    if (theme !== 'dark') {
      root.style.setProperty('--primary', colorTheme.primary);
      root.style.setProperty('--secondary', colorTheme.secondary);
      root.style.setProperty('--accent', colorTheme.accent);
    }
    
    setSelectedLightColor(colorTheme.name);
    localStorage.setItem('dzikir-light-color-theme', colorTheme.name);
    localStorage.setItem('dzikir-light-color-primary', colorTheme.primary);
    localStorage.setItem('dzikir-light-color-secondary', colorTheme.secondary);
    localStorage.setItem('dzikir-light-color-accent', colorTheme.accent);
  };

  const applyDarkColorTheme = (colorTheme: typeof darkColorThemes[0]) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.setProperty('--primary', colorTheme.primary);
      root.style.setProperty('--secondary', colorTheme.secondary);
      root.style.setProperty('--accent', colorTheme.accent);
    }
    
    setSelectedDarkColor(colorTheme.name);
    localStorage.setItem('dzikir-dark-color-theme', colorTheme.name);
    localStorage.setItem('dzikir-dark-color-primary', colorTheme.primary);
    localStorage.setItem('dzikir-dark-color-secondary', colorTheme.secondary);
    localStorage.setItem('dzikir-dark-color-accent', colorTheme.accent);
  };

  const applyFont = (font: typeof fontOptions[0]) => {
    document.body.style.fontFamily = font.value;
    setSelectedFont(font.name);
    localStorage.setItem('dzikir-font-family', font.name);
    localStorage.setItem('dzikir-font-value', font.value);
  };

  const applyArabicFont = (font: typeof arabicFontOptions[0]) => {
    document.documentElement.style.setProperty('--arabic-font', font.value);
    setSelectedArabicFont(font.name);
    localStorage.setItem('dzikir-arabic-font', font.name);
    localStorage.setItem('dzikir-arabic-font-value', font.value);
  };

  const applyFontSize = (size: typeof fontSizeOptions[0]) => {
    // Remove all font size classes
    fontSizeOptions.forEach(s => {
      document.documentElement.classList.remove(s.class);
    });
    // Add selected font size class
    document.documentElement.classList.add(size.class);
    setSelectedFontSize(size.value);
    localStorage.setItem('dzikir-font-size', size.value);
    localStorage.setItem('dzikir-font-size-class', size.class);
  };

  // Apply saved settings on mount and theme change
  useEffect(() => {
    const root = document.documentElement;
    const savedFontValue = localStorage.getItem('dzikir-font-value');
    const savedArabicFontValue = localStorage.getItem('dzikir-arabic-font-value');
    const savedFontSizeClass = localStorage.getItem('dzikir-font-size-class');
    
    // Apply color theme based on current mode
    if (theme === 'dark') {
      const savedDarkPrimary = localStorage.getItem('dzikir-dark-color-primary');
      const savedDarkSecondary = localStorage.getItem('dzikir-dark-color-secondary');
      const savedDarkAccent = localStorage.getItem('dzikir-dark-color-accent');
      
      if (savedDarkPrimary) {
        root.style.setProperty('--primary', savedDarkPrimary);
        root.style.setProperty('--secondary', savedDarkSecondary || '142 30% 15%');
        root.style.setProperty('--accent', savedDarkAccent || '142 30% 15%');
      }
    } else {
      const savedLightPrimary = localStorage.getItem('dzikir-light-color-primary');
      const savedLightSecondary = localStorage.getItem('dzikir-light-color-secondary');
      const savedLightAccent = localStorage.getItem('dzikir-light-color-accent');
      
      if (savedLightPrimary) {
        root.style.setProperty('--primary', savedLightPrimary);
        root.style.setProperty('--secondary', savedLightSecondary || '142 30% 94%');
        root.style.setProperty('--accent', savedLightAccent || '142 30% 94%');
      }
    }
    
    if (savedFontValue) {
      document.body.style.fontFamily = savedFontValue;
    }

    if (savedArabicFontValue) {
      root.style.setProperty('--arabic-font', savedArabicFontValue);
    }

    if (savedFontSizeClass) {
      fontSizeOptions.forEach(s => {
        document.documentElement.classList.remove(s.class);
      });
      document.documentElement.classList.add(savedFontSizeClass);
    }
  }, [theme]);

  const resetToDefault = () => {
    const defaultLightColor = lightColorThemes[0];
    const defaultDarkColor = darkColorThemes[0];
    const defaultFont = fontOptions[0];
    const defaultArabicFont = arabicFontOptions[0];
    const defaultFontSize = fontSizeOptions[1]; // medium
    
    applyLightColorTheme(defaultLightColor);
    applyDarkColorTheme(defaultDarkColor);
    applyFont(defaultFont);
    applyArabicFont(defaultArabicFont);
    applyFontSize(defaultFontSize);
    
    localStorage.removeItem('dzikir-light-color-theme');
    localStorage.removeItem('dzikir-light-color-primary');
    localStorage.removeItem('dzikir-light-color-secondary');
    localStorage.removeItem('dzikir-light-color-accent');
    localStorage.removeItem('dzikir-dark-color-theme');
    localStorage.removeItem('dzikir-dark-color-primary');
    localStorage.removeItem('dzikir-dark-color-secondary');
    localStorage.removeItem('dzikir-dark-color-accent');
    localStorage.removeItem('dzikir-font-family');
    localStorage.removeItem('dzikir-font-value');
    localStorage.removeItem('dzikir-arabic-font');
    localStorage.removeItem('dzikir-arabic-font-value');
    localStorage.removeItem('dzikir-font-size');
    localStorage.removeItem('dzikir-font-size-class');
  };

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

      {/* Font Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TextCursor className="w-5 h-5" />
            Ukuran Font
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {fontSizeOptions.map((size) => (
              <Button
                key={size.value}
                variant={selectedFontSize === size.value ? "default" : "outline"}
                className="h-auto p-3"
                onClick={() => applyFontSize(size)}
              >
                <span className="text-sm">{size.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Arabic Font Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Font Arab
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {arabicFontOptions.map((font) => (
            <Button
              key={font.name}
              variant={selectedArabicFont === font.name ? "default" : "outline"}
              className="w-full h-auto p-4 justify-start"
              onClick={() => applyArabicFont(font)}
            >
              <div className="text-left w-full">
                <div className="font-medium text-sm mb-2">
                  {font.name}
                </div>
                <div 
                  className="text-lg leading-relaxed" 
                  style={{ 
                    fontFamily: font.value, 
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                >
                  {font.preview}
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Light Mode Color Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Warna Tema (Mode Terang)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {lightColorThemes.map((colorTheme) => (
              <Button
                key={colorTheme.name}
                variant={selectedLightColor === colorTheme.name ? "default" : "outline"}
                className="h-auto p-3 flex items-center gap-3"
                onClick={() => applyLightColorTheme(colorTheme)}
              >
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: `hsl(${colorTheme.primary})` }}
                />
                <span className="text-sm">{colorTheme.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dark Mode Color Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Warna Tema (Mode Gelap)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {darkColorThemes.map((colorTheme) => (
              <Button
                key={colorTheme.name}
                variant={selectedDarkColor === colorTheme.name ? "default" : "outline"}
                className="h-auto p-3 flex items-center gap-3"
                onClick={() => applyDarkColorTheme(colorTheme)}
              >
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: `hsl(${colorTheme.primary})` }}
                />
                <span className="text-sm">{colorTheme.name}</span>
              </Button>
            ))}
          </div>
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
            <div 
              className="font-arabic text-xl mb-3 p-3 bg-background/50 rounded"
              style={{ fontFamily: `var(--arabic-font, 'Amiri')` }}
            >
              سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
            </div>
            <div className="flex gap-2">
              <Button size="sm">Tombol Primary</Button>
              <Button variant="outline" size="sm">Tombol Secondary</Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Pengaturan akan tersimpan secara otomatis
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      <Card>
        <CardContent className="p-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={resetToDefault}
          >
            Reset ke Pengaturan Default
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};