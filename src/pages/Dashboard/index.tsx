// src/pages/Dashboard/index.tsx
import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { useAppContext } from '../../contexts/AppContext';

dayjs.extend(dayOfYear);
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import hadithList from '../../data/hadith.json';

import { RAMADAN_START_2026 } from '../../constants/defaults';

const getHadithOfTheDay = () => {
  const dayOfYear = dayjs().dayOfYear();
  const index = dayOfYear % hadithList.length;
  return hadithList[index];
};

const formatCountdown = (ms: number): string => {
  if (ms <= 0) return "Now ♡";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`;
};

export default function Dashboard() {
  const { appData, today } = useAppContext();
  const { times, loading, error } = usePrayerTimes();

  const hadith = getHadithOfTheDay();

  // Live states
  const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm:ss'));
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; remainingMs: number; timeStr: string } | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!times) return;

    const update = () => {
      const now = dayjs();
      setCurrentTime(now.format('HH:mm:ss'));

      const todayStr = now.format('YYYY-MM-DD');
      const prayerList = [
        { name: 'Fajr', timeStr: times.Fajr },
        { name: 'Dhuhr', timeStr: times.Dhuhr },
        { name: 'Asr', timeStr: times.Asr },
        { name: 'Maghrib', timeStr: times.Maghrib },
        { name: 'Isha', timeStr: times.Isha },
      ].filter(p => p.timeStr);

      let next = null;
      let smallestDiff = Infinity;
      let activePrayer = null;

      prayerList.forEach(p => {
        let prayerTime = dayjs(`${todayStr} ${p.timeStr}`, 'YYYY-MM-DD HH:mm');
        let diff = prayerTime.diff(now);

        // Check if this prayer is current (within ~5 min window after time)
        const fiveMinutesMs = 120 * 60 * 1000;
        if (diff <= 0 && diff > -fiveMinutesMs) { // -5 minutes
          activePrayer = p.name;
        }

        if (diff < 0) {
          prayerTime = prayerTime.add(1, 'day');
          diff = prayerTime.diff(now);
        }

        if (diff < smallestDiff) {
          smallestDiff = diff;
          next = { name: p.name, remainingMs: diff, timeStr: prayerTime.format('HH:mm') };
        }
      });

      setNextPrayerInfo(next);
      setCurrentPrayer(activePrayer);
    };

    update();
    timerRef.current = window.setInterval(update, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [times]);

  return (
    <div className="p-6 flex flex-col gap-8">
      {/* Greeting */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-night">
          Welcome back, {appData.settings.username || 'yun-chan'} ♡
        </h1>
        <p className="text-lg text-olive mt-2">
          Ramadan Day {dayjs(today).diff(dayjs(RAMADAN_START_2026), 'day') + 1 || '?'}
        </p>
      </div>

      {/* Prayer Times Card - Big & Beautiful */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-olive/20">
        <h3 className="text-xl font-semibold text-olive mb-4 text-center">
          Prayer Times – {appData.settings.city}
        </h3>

        {loading && <p className="text-center text-neutral-600">Loading prayer times...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {times && (
          <>
            {/* Current Time & Active/Next Prayer */}
            <div className="text-center mb-6">
              <p className="text-sm text-neutral-600 mb-1">Right now</p>
              <p className="text-5xl font-extrabold text-night">{currentTime}</p>

              {currentPrayer ? (
                <div className="mt-4">
                  <p className="text-2xl font-bold text-olive">Current: {currentPrayer}</p>
                  <p className="text-sm text-neutral-600 mt-1">Time to pray ♡</p>
                </div>
              ) : nextPrayerInfo && (
                <div className="mt-4">
                  <p className="text-xl font-medium text-olive">Next: {nextPrayerInfo.name}</p>
                  <p className="text-3xl font-bold text-olive mt-2">
                    {formatCountdown(nextPrayerInfo.remainingMs)}
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">at {nextPrayerInfo.timeStr}</p>
                </div>
              )}
            </div>

            {/* All Prayer Times Grid */}
            <div className="grid grid-cols-5 gap-3 text-center">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                <div
                  key={p}
                  className={`p-4 rounded-lg transition-all ${
                    currentPrayer === p
                      ? 'bg-olive text-white shadow-md ring-2 ring-olive/50'
                      : 'bg-neutral-50 hover:bg-neutral-100'
                  }`}
                >
                  <p className="text-sm font-medium">{p}</p>
                  <p className="text-xl font-bold">{times[p as keyof typeof times]}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Hadith of the Day */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-olive/20">
        <h3 className="text-xl font-semibold text-olive mb-4 text-center">Hadith of the Day</h3>
        <p className="text-night leading-relaxed text-lg text-center">{hadith.text}</p>
        {appData.settings.showArabicHadith && hadith.arabic && (
          <p className="mt-4 text-right font-arabic text-2xl text-night/80">{hadith.arabic}</p>
        )}
        <p className="mt-3 text-sm text-neutral-600 italic text-center">— {hadith.source}</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <a href="/ibadah" className="bg-olive text-white p-5 rounded-xl text-center font-medium hover:bg-olive/90 transition shadow">
          Ibadah Tracker
        </a>
        <a href="/quran" className="bg-olive text-white p-5 rounded-xl text-center font-medium hover:bg-olive/90 transition shadow">
          Quran Companion
        </a>
        <a href="/journal" className="bg-olive text-white p-5 rounded-xl text-center font-medium hover:bg-olive/90 transition shadow">
          Journal
        </a>
        <a href="/settings" className="bg-olive text-white p-5 rounded-xl text-center font-medium hover:bg-olive/90 transition shadow">
          Settings
        </a>
      </div>
    </div>
  );
}