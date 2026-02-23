import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { HiSparkles } from 'react-icons/hi';

export default function UsernamePopup() {
  const { appData, setAppData } = useAppContext();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(!appData.settings.username);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    setAppData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        username: name.trim(),
      },
    }));
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
      {/* Softened Backdrop */}
      <div className="absolute inset-0 bg-night-950/40 backdrop-blur-md" />

      {/* Popup Card */}
      <div className="relative bg-sand dark:bg-night-900 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-olive-100 dark:border-night-800 animate-in zoom-in-95 duration-300">
        
        {/* Decorative Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-olive-50 dark:bg-olive-900/30 p-4 rounded-2xl">
            <HiSparkles className="w-8 h-8 text-olive-600 dark:text-gold-400" />
          </div>
        </div>

        <h2 className="text-3xl font-serif font-bold text-olive-800 dark:text-sand mb-3">
          Welcome, dear one
        </h2>
        
        <p className="text-sm text-night-600 dark:text-night-300 mb-8 leading-relaxed px-2">
          What name would you like to be called by during this blessed journey?
        </p>

        <div className="space-y-4">
          <input
            type="text"
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Your beautiful name..."
            className="w-full bg-white dark:bg-night-950 border-none p-4 rounded-2xl focus:ring-2 focus:ring-olive-500 dark:text-sand shadow-inner text-center font-serif text-lg placeholder:text-neutral-300 dark:placeholder:text-night-800 transition-all"
          />

          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full bg-olive-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-olive-900/20 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:pointer-events-none"
          >
            Begin Journey ♡
          </button>
          
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-night-500">
            You can change this in settings later
          </p>
        </div>
      </div>
    </div>
  );
}