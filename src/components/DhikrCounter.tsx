// src/components/DhikrSection.tsx
import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import defaultDhikrRaw from '../data/dhikr.json';
import type { Dhikr } from '../types/types';

const defaultDhikr = defaultDhikrRaw as Dhikr[];

interface DhikrDisplay extends Dhikr {
  count: number;
}

export default function DhikrSection() {
  const { appData, addCustomDhikr, editCustomDhikr, deleteCustomDhikr, today, updateDailyLog } = useAppContext();

  const [mode, setMode] = useState<'counter' | 'checklist'>('counter');
  const [newLabel, setNewLabel] = useState('');

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
 const addCustom = () => {
    if (!newLabel.trim()) return;
addCustomDhikr(newLabel);
   setNewLabel('');
  };
  const startEdit = (dhikr: Dhikr) => {
    if (!dhikr.isCustom) return; // only custom can be edited
    setEditingId(dhikr.id);
    setEditValue(dhikr.label);
  };

  const saveEdit = (id: string) => {
    if (!editValue.trim()) return;
    editCustomDhikr(id, editValue.trim());
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this custom dhikr forever?')) {
      deleteCustomDhikr(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-olive/10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-night">Dhikr Today</h2>
        <div className="flex gap-2 bg-sand p-1 rounded-xl">
          <button
            onClick={() => setMode('counter')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'counter' ? 'bg-olive text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Counter
          </button>
          <button
            onClick={() => setMode('checklist')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'checklist' ? 'bg-olive text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Checklist
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {allDhikr.map((dhikr) => (
          <div
            key={dhikr.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3 border-b border-neutral-100 last:border-0"
          >
            {editingId === dhikr.id && dhikr.isCustom ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="flex-1 border border-neutral-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/50"
                />
                <button
                  onClick={() => saveEdit(dhikr.id)}
                  className="bg-olive text-white px-3 py-2 rounded-lg text-sm hover:bg-olive/90"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-neutral-300 text-neutral-800 px-3 py-2 rounded-lg text-sm hover:bg-neutral-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex-1">
                <p className="font-medium text-night">{dhikr.label}</p>
                {dhikr.arabic && (
                  <p className="text-sm text-neutral-600 font-arabic mt-1">{dhikr.arabic}</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              {mode === 'counter' ? (
                <button
                  onClick={() => countUp(dhikr.id)}
                  className="min-w-[70px] h-11 bg-olive/10 text-olive font-bold rounded-full hover:bg-olive/20 transition flex items-center justify-center text-lg"
                >
                  {dhikr.count}
                  {dhikr.defaultTarget !== undefined && (
                    <span className="text-xs ml-1 opacity-70">/{dhikr.defaultTarget}</span>
                  )}
                </button>
              ) : (
                <input
                  type="checkbox"
                  checked={!!todayCounts[dhikr.id]}
                  onChange={() => toggleDone(dhikr.id)}
                  className="w-6 h-6 accent-olive rounded border-neutral-300"
                />
              )}

              {dhikr.isCustom && (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(dhikr)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    aria-label="Edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dhikr.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                    aria-label="Delete"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom */}
      <div className="mt-8 pt-5 border-t border-neutral-200">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Add your own dhikr
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. La ilaha illallah..."
            className="flex-1 border border-neutral-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/50 transition"
          />
          <button
            onClick={addCustom}
            disabled={!newLabel.trim()}
            className="bg-olive text-white px-6 py-3 rounded-lg font-medium hover:bg-olive/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}