import { createContext,  useCallback,  type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_SETTINGS } from '../constants/defaults';
import type { RamadanAppData, DailyLog, Dhikr, Dua } from '../types/types';
interface AppContextType {
  appData: RamadanAppData;
  setAppData: (value: RamadanAppData | ((prev: RamadanAppData) => RamadanAppData)) => void;
  today: string;
  updateDailyLog: (updates: Partial<DailyLog>) => void;
   addCustomDhikr: (label: string) => void;
   editCustomDhikr: (id: string, newLabel: string) => void;
  deleteCustomDhikr: (id: string) => void;
  addDua: (text: string) => void;
  editDua: (id: string, newText: string) => void;
  deleteDua: (id: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined);


export function AppProvider({ children }: { children: ReactNode }) {
  const initialData: RamadanAppData = {
    settings: DEFAULT_SETTINGS,
    dailyLogs: {},
    duaList: [],
    customDhikr: [],
    streaks: {
      fullSalah: { current: 0, longest: 0, lastDate: '' },
    },
  };

  const [appData, setAppData] = useLocalStorage<RamadanAppData>('ramadanAppData', initialData);
  const today = new Date().toLocaleDateString('en-CA'); // en-CA format is YYYY-MM-DD in local timezone
  
  const updateDailyLog = useCallback((updates: Partial<DailyLog>) => {
    setAppData((prev) => {
      const currentLog = prev.dailyLogs[today] || {
        date: today,
        prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
        taraweeh: 0,
        quranPages: 0,
        dhikrCounts: {},
        charity: 0,
        discipline: { noGossip: false, noComplaining: false },
        mood: 3,
        journal: '',
        fasted: false,
      };

      return {
        ...prev,
        dailyLogs: {
          ...prev.dailyLogs,
          [today]: { ...currentLog, ...updates },
        },
      };
    });
  }, [setAppData, today]);

  // In AppProvider (inside the component)
const addCustomDhikr = useCallback((label: string) => {
  if (!label.trim()) return;

  const trimmed = label.trim();
  const newId =  trimmed; // safe unique ID

  const newDhikr: Dhikr = {
    id: newId,
    label: trimmed,
    defaultTarget: 33, // or make this configurable later
    isCustom: true,
  };

  setAppData((prev) => {
    const currentLog = prev.dailyLogs[today] || {
      date: today,
      prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      taraweeh: 0,
      quranPages: 0,
      dhikrCounts: {},
      charity: 0,
      discipline: { noGossip: false, noComplaining: false },
      mood: 3,
      journal: '',
    };

    return {
      ...prev,
      customDhikr: [...(prev.customDhikr ?? []), newDhikr],
      dailyLogs: {
        ...prev.dailyLogs,
        [today]: {
          ...currentLog,
          dhikrCounts: {
            ...currentLog.dhikrCounts,
            [newId]: 0,
          },
        },
      },
    };
  });
}, [setAppData, today]);
// In AppProvider, inside the component
const editCustomDhikr = useCallback((id: string, newLabel: string) => {
  if (!newLabel.trim()) return;

  setAppData((prev) => {
    const updatedCustom = (prev.customDhikr ?? []).map(d =>
      d.id === id ? { ...d, label: newLabel.trim() } : d
    );

    return {
      ...prev,
      customDhikr: updatedCustom,
    };
  });
}, [setAppData]);
const addDua = useCallback((text: string) => {
  if (!text.trim()) return;

  const newId = `dua-${Date.now()}`;
  const newDua: Dua = {
    id: newId,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    answered: false,
  };

  setAppData((prev) => ({
    ...prev,
    duaList: [...(prev.duaList ?? []), newDua],
  }));
}, [setAppData]);

const editDua = useCallback((id: string, newText: string) => {
  if (!newText.trim()) return;

  setAppData((prev) => ({
    ...prev,
    duaList: (prev.duaList ?? []).map(dua =>
      dua.id === id ? { ...dua, text: newText.trim() } : dua
    ),
  }));
}, [setAppData]);

const deleteDua = useCallback((id: string) => {
  setAppData((prev) => ({
    ...prev,
    duaList: (prev.duaList ?? []).filter(dua => dua.id !== id),
  }));
}, [setAppData]);

const deleteCustomDhikr = useCallback((id: string) => {
  setAppData((prev) => {
    const updatedCustom = (prev.customDhikr ?? []).filter(d => d.id !== id);

    // Also clean up today's count if exists
    const currentLog = prev.dailyLogs[today];
    if (currentLog && currentLog.dhikrCounts?.[id] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...newCounts } = currentLog.dhikrCounts;
      return {
        ...prev,
        customDhikr: updatedCustom,
        dailyLogs: {
          ...prev.dailyLogs,
          [today]: {
            ...currentLog,
            dhikrCounts: newCounts,
          },
        },
      };
    }

    return {
      ...prev,
      customDhikr: updatedCustom,
    };
  });
}, [setAppData, today]);
  return (
    <AppContext.Provider value={{ appData, setAppData, today, updateDailyLog, addCustomDhikr  , editCustomDhikr, deleteCustomDhikr , addDua, editDua, deleteDua }}>
      {children}
    </AppContext.Provider>
  );
}