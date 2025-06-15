import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadSavedThemeCustomizations } from './utils/themeLoader'

// Load saved theme customizations
loadSavedThemeCustomizations();

createRoot(document.getElementById("root")!).render(<App />);
