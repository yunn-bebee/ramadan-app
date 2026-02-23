import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { Dua } from '../types/types';
import dayjs from 'dayjs';

export default function DuaVault() {
  const { appData, addDua, deleteDua } = useAppContext();
  const [newText, setNewText] = useState('');

  const duas: Dua[] = appData.duaList ?? [];

  const handleAdd = () => {
    if (!newText.trim()) return;
    addDua(newText);
    setNewText('');
  };

  return (
    <div className="bg-white dark:bg-night-900 p-8 rounded-[2.5rem] shadow-sm border border-olive-100 dark:border-night-800 transition-all">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-olive-800 dark:text-sand">Dua Vault</h2>
          <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold mt-1">My Whispers to Allah</p>
        </div>
        <span className="text-2xl">🕯️</span>
      </div>

      {/* Dua List */}
      <div className="space-y-6 mb-10">
        {duas.length === 0 ? (
          <div className="text-center py-10 opacity-30 italic text-sm">
            <p>Your vault is empty...</p>
            <p>Start writing your heart's desires.</p>
          </div>
        ) : (
          duas.map((dua) => (
            <div 
              key={dua.id} 
              className="relative group bg-sand/30 dark:bg-night-800/40 p-6 rounded-[2rem] border border-olive-50 dark:border-night-800 transition-all hover:shadow-md"
            >
              <p className="text-lg leading-relaxed font-serif text-night-700 dark:text-sand/80 italic">
                "{dua.text}"
              </p>
              
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-olive-100/50 dark:border-night-800/50">
                <span className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">
                  {dayjs(dua.createdAt).format('MMMM D, YYYY')}
                </span>
                <button 
                  onClick={() => deleteDua(dua.id)}
                  className="text-[10px] font-bold text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="What is your heart whispering today?"
          className="w-full bg-sand dark:bg-night-800 border-none rounded-[2rem] p-6 text-base italic focus:ring-2 focus:ring-olive/10 min-h-[140px] resize-none placeholder:opacity-30"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="w-full bg-olive text-white py-5 rounded-[1.8rem] font-bold shadow-lg shadow-olive-500/20 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3"
        >
          <span>✨</span> Deposit Dua
        </button>
      </div>
    </div>
  );
}