// Load saved theme customizations on app start
export const loadSavedThemeCustomizations = () => {
  // Load saved font
  const savedFontValue = localStorage.getItem('dzikir-font-value');
  if (savedFontValue) {
    document.body.style.fontFamily = savedFontValue;
  }

  // Load saved color theme (only for light mode)
  const savedColor = localStorage.getItem('dzikir-color-theme');
  if (savedColor && !document.documentElement.classList.contains('dark')) {
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

    const colorTheme = colorThemes.find(t => t.name === savedColor);
    if (colorTheme) {
      const root = document.documentElement;
      root.style.setProperty('--primary', colorTheme.primary);
      root.style.setProperty('--secondary', colorTheme.secondary);
      root.style.setProperty('--accent', colorTheme.accent);
    }
  }
};