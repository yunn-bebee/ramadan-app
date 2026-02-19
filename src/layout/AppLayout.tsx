import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import UsernamePopup from '../components/UsernamePopUp';

export default function AppLayout() {const { appData } = useAppContext();
useEffect(() => {
    if (appData.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (appData.settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // 'auto' - follow system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [appData.settings.theme]);
  return (
    <div className="min-h-screen flex flex-col bg-olive-100 dark:bg-night-800 dark:text-white text-night">
      {/* You can add a Header here later */}
      
      <main className="flex-1 pb-20 overflow-y-auto">
        <UsernamePopup /> 
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}