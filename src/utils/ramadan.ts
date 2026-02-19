import dayjs from 'dayjs';
import { RAMADAN_START_2026 } from '../constants/defaults';

export function getRamadanCalendarDays(startDate: string = RAMADAN_START_2026) {
  const days = [];
  let current = dayjs(startDate);

  for (let i = 0; i < 30; i++) {
    days.push({
      date: current.format('YYYY-MM-DD'),
      dayNumber: i + 1,
    });
    current = current.add(1, 'day');
  }

  return days;
}