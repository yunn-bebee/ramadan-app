import type { Settings } from "../types/types";


export const DEFAULT_SETTINGS: Settings = {
  city: 'Saitama',               // Nice touch for you, ne? ♡
  calculationMethod: 'MuslimWorldLeague', // Most common for many places
  theme: 'auto' as const,
  lastTenDaysMode: false,
  quranGoal: {
    type: 'khatam',
    count: 1,
    dailyTarget: 20,             // ~604 pages / 30 days
  },
  taraweehGoal: 8,                 // or 20 — user can change in settings
  showArabicHadith: true,
  notificationsEnabled: false,     // future-proof
  username: undefined,
};
export const RAMADAN_START_2026 = '2026-02-20'; // Your local start date
export const RAMADAN_DAYS = 30;