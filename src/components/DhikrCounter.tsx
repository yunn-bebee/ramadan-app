import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import defaultDhikrRaw from '../data/dhikr.json';
import type { Dhikr } from '../types/types';

const defaultDhikr = defaultDhikrRaw as Dhikr[];

interface DhikrDisplay extends Dhikr {
  count: number;
}

export default function DhikrSection() {
  const { 
    appData, 
    addCustomDhikr, 
    editCustomDhikr, 
    deleteCustomDhikr, 
    today, 
    updateDailyLog 
  } = useAppContext();

  const [mode, setMode] = useState<'counter' | 'checklist'>('counter');
  const [newLabel, setNewLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const todayCounts = appData.dailyLogs[today]?.dhikrCounts ?? {};

  const allDhikr: DhikrDisplay[] = [
    ...defaultDhikr.map(d => ({
      ...d,
      count: todayCounts[d.id] ?? 0,
    })),
    ...(appData.customDhikr ?? []).map(d => ({
      ...d,
      count: todayCounts[d.id] ?? 0,
    })),
  ];

  const countUp = (id: string) => {
    const current = todayCounts[id] ?? 0;
    updateDailyLog({
      dhikrCounts: { ...todayCounts, [id]: current + 1 },
    });
  };

  const toggleDone = (id: string) => {
    const current = todayCounts[id] ?? 0;
    updateDailyLog({
      dhikrCounts: { ...todayCounts, [id]: current ? 0 : 1 },
    });
  };

  const addCustom = () => {
    if (!newLabel.trim()) return;
    addCustomDhikr(newLabel);
    setNewLabel('');
  };

  const startEdit = (dhikr: Dhikr) => {
    if (!dhikr.isCustom) return; 
    setEditingId(dhikr.id);
    setEditValue(dhikr.label);
  };

  const saveEdit = (id: string) => {
    if (!editValue.trim()) return;
    editCustomDhikr(id, editValue.trim());
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this custom dhikr forever?')) {
      deleteCustomDhikr(id);
    }
  };

  return (
    <div className="bg-white dark:bg-night-900 p-8 rounded-[2.5rem] shadow-sm border border-olive-100 dark:border-night-800 transition-all">
      
      {/* HEADER & TOGGLE */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-serif font-bold text-olive-800 dark:text-sand">Dhikr</h2>
          <span className="text-2xl opacity-50">📿</span>
        </div>
        
        <div className="flex bg-sand dark:bg-night-800 p-1.5 rounded-2xl w-full">
          <button
            onClick={() => setMode('counter')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all ${
              mode === 'counter' ? 'bg-olive text-white shadow-md' : 'text-neutral-400'
            }`}
          >
            Counter
          </button>
          <button
            onClick={() => setMode('checklist')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all ${
              mode === 'checklist' ? 'bg-olive text-white shadow-md' : 'text-neutral-400'
            }`}
          >
            Checklist
          </button>
        </div>
      </div>

      {/* DHIKR LIST */}
      <div className="space-y-8">
        {allDhikr.map((dhikr) => (
          <div key={dhikr.id} className="group flex flex-col gap-3 pb-6 border-b border-olive-50 dark:border-night-800 last:border-0">
            
            <div className="flex justify-between items-start gap-4">
              {editingId === dhikr.id ? (
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="w-full bg-sand dark:bg-night-800 border-2 border-olive-200 p-3 rounded-xl focus:outline-none text-sm"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(dhikr.id)} className="text-[10px] font-bold text-olive-600 uppercase">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-[10px] font-bold text-neutral-400 uppercase">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="font-serif text-lg leading-tight text-night-800 dark:text-sand/90">{dhikr.label}</p>
                  {dhikr.arabic && (
                    <p className="text-2xl font-arabic text-olive-600 dark:text-gold-500 mt-2 text-right dir-rtl leading-relaxed">
                      {dhikr.arabic}
                    </p>
                  )}
                </div>
              )}

              {/* Interaction Target */}
              <div className="flex flex-col items-center gap-3">
                {mode === 'counter' ? (
                  <button
                    onClick={() => countUp(dhikr.id)}
                    className="w-16 h-16 rounded-full bg-sand dark:bg-night-800 flex flex-col items-center justify-center border-2 border-transparent active:border-olive active:scale-90 transition-all shadow-inner"
                  >
                    <span className="text-xl font-bold font-serif">{dhikr.count}</span>
                    {dhikr.defaultTarget && (
                      <span className="text-[9px] opacity-40 font-bold">/{dhikr.defaultTarget}</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => toggleDone(dhikr.id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      todayCounts[dhikr.id] ? 'bg-olive text-white shadow-lg rotate-12' : 'bg-sand dark:bg-night-800'
                    }`}
                  >
                    {todayCounts[dhikr.id] ? '✨' : '⚪'}
                  </button>
                )}
              </div>
            </div>

            {/* Custom Controls (Edit/Delete) */}
            {dhikr.isCustom && editingId !== dhikr.id && (
              <div className="flex gap-4 px-1">
                <button 
                  onClick={() => startEdit(dhikr)}
                  className="text-[10px] font-bold text-olive-600/50 hover:text-olive-600 uppercase tracking-widest transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(dhikr.id)}
                  className="text-[10px] font-bold text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ADD CUSTOM FOOTER */}
      <div className="mt-10 pt-8 border-t-2 border-dashed border-olive-50 dark:border-night-800">
        <label className="block text-[10px] font-bold text-olive-600 dark:text-gold-500 uppercase tracking-[0.2em] mb-4 ml-2">
          New Personal Dhikr
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="SubhanAllah, Alhamdulillah..."
            className="flex-1 bg-sand dark:bg-night-800 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-olive/20 dark:placeholder:text-night-700"
          />
          <button
            onClick={addCustom}
            disabled={!newLabel.trim()}
            className="bg-olive text-white w-14 h-14 rounded-2xl font-bold active:scale-95 disabled:opacity-30 flex items-center justify-center text-xl shadow-lg shadow-olive-500/20"
          >
            ＋
          </button>
        </div>
      </div>
    </div>
  );
}