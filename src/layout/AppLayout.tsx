import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import UsernamePopup from '../components/UsernamePopUp';

export default function AppLayout() {
  const { appData } = useAppContext();

  useEffect(() => {
    const root = document.documentElement;
    if (appData.settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (appData.settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
  }, [appData.settings.theme]);

  return (
    // Added 'transition-colors' for smooth theme switching and 'selection' colors for branding
    <div className="min-h-screen flex flex-col bg-sand dark:bg-night-950 text-night-900 dark:text-sand transition-colors duration-500 selection:bg-olive-200">
      
      {/* Background Ornament (Optional: adds a soft glow to the top right) */}
      <div className="fixed top-0 right-0 w-[300px] h-[300px] bg-olive-100/40 dark:bg-olive-900/10 blur-[100px] pointer-events-none" />
      
      <main className="flex-1 pb-24 overflow-y-auto relative">
        {/* We keep the popup here so it layers over content */}
        <UsernamePopup /> 
        
        {/* Modern page transition wrapper */}
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <Outlet />
        </div>
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />
      
      {/* Safe Area Spacer for modern iPhones (Home Indicator) */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white/80 dark:bg-night-900/80 backdrop-blur-lg" />
    </div>
  )
}