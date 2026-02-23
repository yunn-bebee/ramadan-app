// src/types/appTypes.ts
// Central place for all data shapes in the Ramadan Companion app
// Keeps everything type-safe, consistent, and easy to evolve

export interface RamadanAppData {
  settings: Settings;
  dailyLogs: Record<string, DailyLog>; // key = ISO date string like "2026-03-02"
  duaList: Dua[];
  customDhikr: Dhikr[];
  streaks: Record<string, Streak>; // e.g. { fullSalah: {...}, quran: {...} }
}

export interface Settings {
  city: string;
  calculationMethod: string; // e.g. "MuslimWorldLeague", "Egyptian", "ISNA", etc.
  theme: 'auto' | 'light' | 'dark';
  lastTenDaysMode: boolean;
  quranGoal: QuranGoal;
  taraweehGoal: number; // 8 or 20 rak'ah preference
  showArabicHadith: boolean;
  notificationsEnabled?: boolean
  username?: string;
  ramadanStartDate?: string;
  // Add more toggles later as needed
}

export interface QuranGoal {
  type: 'khatam' | 'juz' | 'pages' | 'custom';
  count: number;          // e.g. 1 for one full khatam, 2 for two, etc.
  dailyTarget?: number;   // auto-calculated or user-set (pages per day)
}

export interface DailyLog {
  date: string;                   // redundant but useful for queries: "2026-03-02"
  prayers: Record<PrayerName, boolean>; // { fajr: true, dhuhr: false, ... }
  taraweeh: number;               // rak'ah count
  quranPages: number;
  quranLastLocation?: QuranLocation; // optional bookmark
  dhikrCounts: Record<string, number>; // key = dhikr id or custom label
  charity: number;                // amount in local currency or just count
  discipline: Record<DisciplineKey, boolean>;
  mood: number;                   // 1-5 scale
  journal: string;                // free text reflection
  fasted?: boolean;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface QuranLocation {
  surahId: number;     // 1-114
  ayah: number;        // ayah within surah
  page?: number;       // optional mushaf page reference
}

export type DisciplineKey = 
  | 'noGossip' 
  | 'noComplaining' 
  | 'loweredGaze' 
  | 'controlledAnger' 
  | 'guardedTongue';

export interface Dua {
  id: string;           // uuid or timestamp-based
  text: string;
  arabic?: string;      // optional user-added
  category?: string;    // e.g. "family", "health", "ummah"
  createdAt: string;    // ISO date
  answered: boolean;
  answeredAt?: string;
}

export interface Dhikr {
  id: string;           // "subhanallah" or custom uuid
  label: string;
  arabic?: string;
  defaultTarget: number;
  isCustom: boolean;    // true if user-added
}

export interface Streak {
  current: number;
  longest: number;
  lastDate: string;     // ISO date of last update
  brokenMessageShown?: boolean; // optional flag for gentle UI
}

// Seed data types (for JSON files)
export interface Hadith {
  id: number;
  text: string;
  arabic?: string;
  source: string;
}

export interface QuranPlanDay {
  day: number;          // 1-30
  juz: number;          // 1-30
  surahs: string;       // e.g. "Al-Fatihah → Al-Baqarah:141"
}

export interface SurahInfo {
  id: number;
  name: string;         // Arabic name
  english: string;
  revelationType?: 'Meccan' | 'Medinan';
}