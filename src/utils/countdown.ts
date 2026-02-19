// src/utils/countdown.ts
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNextPrayer(times: any) {
  if (!times) return null;

  const now = dayjs();
  const prayers = [
    { name: 'Fajr', time: times.Fajr },
    { name: 'Dhuhr', time: times.Dhuhr },
    { name: 'Asr', time: times.Asr },
    { name: 'Maghrib', time: times.Maghrib },
    { name: 'Isha', time: times.Isha },
  ];

  let next = null;
  let minDiff = Infinity;

  for (const p of prayers) {
    const prayerTime = dayjs(`${now.format('YYYY-MM-DD')} ${p.time}`, 'YYYY-MM-DD HH:mm');
    let diff = prayerTime.diff(now);

    // If already passed today, add 1 day
    if (diff < 0) {
      prayerTime.add(1, 'day');
      diff = prayerTime.diff(now);
    }

    if (diff < minDiff) {
      minDiff = diff;
      next = { ...p, timeObj: prayerTime, diff };
    }
  }

  return next;
}

export function formatCountdown(diffMs: number): string {
  const duration = dayjs.duration(diffMs);
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}