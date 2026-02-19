// src/components/UsernamePopup.tsx
import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-11/12 text-center">
        <h2 className="text-2xl font-bold text-night mb-4">Welcome, dear one ♡</h2>
        <p className="text-neutral-600 mb-6">
          What name would you like me to call you by?  
          (You can always change it in Settings later)
        </p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your beautiful name..."
          className="w-full border border-neutral-300 p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-olive/50"
        />
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="bg-olive text-white px-8 py-3 rounded-lg font-medium hover:bg-olive/90 transition disabled:opacity-50"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}