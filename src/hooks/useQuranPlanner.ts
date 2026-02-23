// src/hooks/useQuranTracker.ts
import { useAppContext } from '../contexts/AppContext';
import { FALLBACK_RAMADAN_START_2026 } from '../constants/defaults';
import dayjs from 'dayjs';
import juzRanges from '../data/pageToSurah.json';

interface JuzRange {
  juz: number;
  startPage: number;
  endPage: number;
}

const juzMap = juzRanges as JuzRange[];

export function useQuranTracker() {
  const { appData, updateDailyLog, today } = useAppContext();

  const goal = appData.settings.quranGoal;
  const totalMushafPages = 604;

  const targetTotal = goal.type === 'khatam' ? goal.count * totalMushafPages : goal.count * 30;

  const totalRead = Object.values(appData.dailyLogs).reduce((sum, l) => sum + (l?.quranPages ?? 0), 0);
  const remainingPages = Math.max(0, targetTotal - totalRead);

  const daysPassed = dayjs(today).diff(dayjs(appData.settings.ramadanStartDate || FALLBACK_RAMADAN_START_2026), 'day') + 1;
  const daysRemaining = Math.max(0, 30 - daysPassed);
  const suggestedDaily = daysRemaining > 0 ? Math.ceil(remainingPages / daysRemaining) : 0;

  // Get Juz for a given page
  const getJuzForPage = (page: number): number => {
    const entry = juzMap.find(range => page >= range.startPage && page <= range.endPage);
    return entry ? entry.juz : 30;
  };

  const currentPage = totalRead + (appData.dailyLogs[today]?.quranPages ?? 0);
  const currentJuz = getJuzForPage(currentPage);

  const goalPage = currentPage + suggestedDaily;
  const goalJuz = getJuzForPage(goalPage);

  const incrementPages = (delta: number) => {
    const current = appData.dailyLogs[today]?.quranPages ?? 0;
    const newPages = Math.max(0, current + delta);
    updateDailyLog({ quranPages: newPages });
  };

  return {
    suggestedDaily,
    remainingPages,
    totalRead,
    targetTotal,
    currentJuz,
    goalJuz,
    incrementPages,
  };
}