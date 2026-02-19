// src/components/DuaVault.tsx
import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { Dua } from '../types/types';
import dayjs from 'dayjs';

export default function DuaVault() {
  const { appData, addDua, editDua, deleteDua } = useAppContext();

  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const duas: Dua[] = appData.duaList ?? [];

  const handleAdd = () => {
    addDua(newText);
    setNewText('');
  };

  const startEdit = (dua: Dua) => {
    setEditingId(dua.id);
    setEditText(dua.text);
  };

  const saveEdit = (id: string) => {
    editDua(id, editText);
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this dua forever?')) {
      deleteDua(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-olive/10">
      <h2 className="text-xl font-bold text-night mb-6">My Dua Vault</h2>

      {/* Add New Dua */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Add a new dua
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="e.g. Rabbana atina fiddunya hasanatan wa fil akhirati hasanatan wa qina 'adhaban-nar..."
            className="flex-1 border border-neutral-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/50 resize-none h-24"
          />
          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            className="bg-olive text-white px-6 py-3 rounded-lg font-medium hover:bg-olive/90 transition disabled:opacity-50 disabled:cursor-not-allowed sm:self-end"
          >
            Add
          </button>
        </div>
      </div>

      {/* List of Duas */}
      <div className="space-y-4">
        {duas.length === 0 ? (
          <p className="text-center text-neutral-500 italic">
            Your duas will appear here ♡ Start whispering to Him...
          </p>
        ) : (
          duas.map((dua) => (
            <div
              key={dua.id}
              className="p-4 border border-neutral-200 rounded-lg hover:border-olive/30 transition"
            >
              {editingId === dua.id ? (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border border-neutral-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/50 resize-none h-24"
                  />
                  <div className="flex gap-3 self-end">
                    <button
                      onClick={() => saveEdit(dua.id)}
                      className="bg-olive text-white px-4 py-2 rounded-lg text-sm hover:bg-olive/90"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-neutral-300 text-neutral-800 px-4 py-2 rounded-lg text-sm hover:bg-neutral-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-night leading-relaxed">{dua.text}</p>
                  <p className="text-xs text-neutral-500">
                    Added {dayjs(dua.createdAt).format('MMM D, YYYY')}
                  </p>
                  <div className="flex gap-3 self-end">
                    <button
                      onClick={() => startEdit(dua)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dua.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}   