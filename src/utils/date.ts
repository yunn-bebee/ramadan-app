import dayjs from 'dayjs';

// Example: Myanmar 2026 Ramadan start - adjust this date every year
// For 2026, let's assume local sighting starts Feb 20 (you said 20th)
// So Ramadan 1 = Feb 20, 2026
const LOCAL_RAMADAN_START_2026 = dayjs('2026-02-20');

export function getLocalRamadanDay(today: string): number | null {
  const todayDate = dayjs(today);
  const diff = todayDate.diff(LOCAL_RAMADAN_START_2026, 'day');

  if (diff < 0) return null; // before Ramadan
  if (diff >= 30) return null; // after

  return diff + 1; // Ramadan 1, 2, ..., 30
}