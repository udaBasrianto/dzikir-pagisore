// Font size options for reference
const fontSizeClasses = ['font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge'];

// Load saved theme customizations on app start
export const loadSavedThemeCustomizations = () => {
  // Load saved font
  const savedFontValue = localStorage.getItem('dzikir-font-value');
  if (savedFontValue) {
    document.body.style.fontFamily = savedFontValue;
  }

  // Load saved Arabic font
  const savedArabicFontValue = localStorage.getItem('dzikir-arabic-font-value');
  if (savedArabicFontValue) {
    document.documentElement.style.setProperty('--arabic-font', savedArabicFontValue);
  }

  // Load saved font size
  const savedFontSizeClass = localStorage.getItem('dzikir-font-size-class');
  if (savedFontSizeClass) {
    fontSizeClasses.forEach(cls => {
      document.documentElement.classList.remove(cls);
    });
    document.documentElement.classList.add(savedFontSizeClass);
  }

  // Load saved color theme based on current mode
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  if (isDarkMode) {
    const savedDarkPrimary = localStorage.getItem('dzikir-dark-color-primary');
    const savedDarkSecondary = localStorage.getItem('dzikir-dark-color-secondary');
    const savedDarkAccent = localStorage.getItem('dzikir-dark-color-accent');
    
    if (savedDarkPrimary) {
      const root = document.documentElement;
      root.style.setProperty('--primary', savedDarkPrimary);
      root.style.setProperty('--secondary', savedDarkSecondary || '142 30% 15%');
      root.style.setProperty('--accent', savedDarkAccent || '142 30% 15%');
    }
  } else {
    const savedLightPrimary = localStorage.getItem('dzikir-light-color-primary');
    const savedLightSecondary = localStorage.getItem('dzikir-light-color-secondary');
    const savedLightAccent = localStorage.getItem('dzikir-light-color-accent');
    
    if (savedLightPrimary) {
      const root = document.documentElement;
      root.style.setProperty('--primary', savedLightPrimary);
      root.style.setProperty('--secondary', savedLightSecondary || '142 30% 94%');
      root.style.setProperty('--accent', savedLightAccent || '142 30% 94%');
    }
  }
};