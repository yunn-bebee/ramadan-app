// src/pages/Quran/index.tsx
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useAppContext } from '../../contexts/AppContext';
import { useQuranMetadata } from '../../hooks/useQuranMetadata';
import { RAMADAN_START_2026 } from '../../constants/defaults';
import juzRanges from '../../data/pageToSurah.json'; // your accurate Juz ranges

interface JuzRange {
  juz: number;
  startPage: number;
  endPage: number;
}

const juzMap = juzRanges as JuzRange[];

export default function Quran() {
  const { appData, updateDailyLog, today } = useAppContext();
  const { metadata } = useQuranMetadata();

  const log = appData.dailyLogs[today] ?? { quranPages: 0 };
  const [pagesToday, setPagesToday] = useState(log.quranPages);

  // Bookmark state — load from saved log on mount
  const [bookmarkSurahId, setBookmarkSurahId] = useState<number | null>(
    log.quranLastLocation?.surahId ?? null
  );
  const [bookmarkAyah, setBookmarkAyah] = useState<number>(
    log.quranLastLocation?.ayah ?? 1
  );

  // Sync state when log changes (e.g. after save or new day)
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookmarkSurahId(log.quranLastLocation?.surahId ?? null);
    setBookmarkAyah(log.quranLastLocation?.ayah ?? 1);
  }, [log.quranLastLocation]);

  const goal = appData.settings.quranGoal;
  const totalMushafPages = metadata.totalPages || 604;
  const targetTotal = goal.type === 'khatam' ? goal.count * totalMushafPages : goal.count * 30;

  const totalRead = Object.values(appData.dailyLogs).reduce((sum, l) => sum + (l?.quranPages ?? 0), 0);
  const remainingPages = Math.max(0, targetTotal - totalRead);

  const daysPassed = dayjs(today).diff(dayjs(RAMADAN_START_2026), 'day') + 1;
  const daysRemaining = Math.max(0, 30 - daysPassed);
  const suggestedDaily = daysRemaining > 0 ? Math.ceil(remainingPages / daysRemaining) : 0;

  // Current Juz (based on total read + today's pages)
  const currentPage = totalRead + pagesToday;
  let currentJuz = 1;
  if (currentPage > 0) {
    const entry = juzMap.find(range => currentPage >= range.startPage && currentPage <= range.endPage);
    currentJuz = entry ? entry.juz : 30;
  }

  // Goal Juz (where today's suggested pace would land)
  const goalPage = currentPage + suggestedDaily;
  let goalJuz = currentJuz;
  if (goalPage > 0) {
    const entry = juzMap.find(range => goalPage >= range.startPage && goalPage <= range.endPage);
    goalJuz = entry ? entry.juz : 30;
  }

  const incrementPages = (delta: number) => {
    const current = pagesToday;
    const newPages = Math.max(0, current + delta);
    setPagesToday(newPages);
    updateDailyLog({ quranPages: newPages });
  };

  const saveBookmark = () => {
    if (bookmarkSurahId === null) return;
    updateDailyLog({
      quranLastLocation: {
        surahId: bookmarkSurahId,
        ayah: bookmarkAyah,
      },
    });
  };

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen ">
      <h1 className="text-2xl font-bold">Quran Companion</h1>

      {/* Goal Overview */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Your Journey</h2>
        <p className="text-2xl font-bold text-olive">
          {totalRead} / {targetTotal} pages
        </p>
        <progress value={totalRead} max={targetTotal} className="w-full h-2 rounded-full bg-neutral-200 mt-2" />
        <p className="text-sm text-neutral-600 mt-2">
          Remaining: {remainingPages} pages • {daysRemaining} days left
        </p>
        <p className="text-sm text-neutral-600 mt-2">
          Current Juz: {currentJuz} • Goal Juz (today's pace): {goalJuz}
        </p>
      </div>

      {/* Today's Suggestion */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Today's Gentle Goal</h2>
        <p className="text-3xl font-bold text-olive">{suggestedDaily} pages</p>
        <p className="text-sm text-neutral-600 mt-2">
          {suggestedDaily > 0 ? 'To reach your intention with ease ♡' : 'Alhamdulillah — goal complete!'}
        </p>
      </div>

      {/* Pages Today Increment */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Pages Read Today</h2>
        <p className="text-3xl font-bold text-olive text-center mb-4">{pagesToday}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => incrementPages(-10)} className="bg-neutral-200 px-5 py-3 rounded-lg text-neutral-800 hover:bg-neutral-300 min-w-[80px]">-10</button>
          <button onClick={() => incrementPages(-5)} className="bg-neutral-200 px-5 py-3 rounded-lg text-neutral-800 hover:bg-neutral-300 min-w-[80px]">-5</button>
          <button onClick={() => incrementPages(-1)} className="bg-neutral-200 px-5 py-3 rounded-lg text-neutral-800 hover:bg-neutral-300 min-w-[80px]">-1</button>
          <button onClick={() => incrementPages(1)} className="bg-olive text-white px-5 py-3 rounded-lg hover:bg-olive/90 min-w-[80px]">+1</button>
          <button onClick={() => incrementPages(5)} className="bg-olive text-white px-5 py-3 rounded-lg hover:bg-olive/90 min-w-[80px]">+5</button>
          <button onClick={() => incrementPages(10)} className="bg-olive text-white px-5 py-3 rounded-lg hover:bg-olive/90 min-w-[80px]">+10</button>
        </div>
      </div>

      {/* User Bookmark */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Your Bookmark</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Surah</label>
            <select
              value={bookmarkSurahId ?? ''}
              onChange={(e) => setBookmarkSurahId(Number(e.target.value) || null)}
              className="border border-neutral-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
            >
              <option value="">Select surah</option>
              {metadata.surahs.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id}. {s.name} ({s.english})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Ayah</label>
            <input
              type="number"
              value={bookmarkAyah}
              onChange={(e) => setBookmarkAyah(Math.max(1, Number(e.target.value)))}
              min="1"
              className="border border-neutral-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive w-32"
            />
          </div>

          <button
            onClick={saveBookmark}
            className="bg-olive text-white py-3 px-6 rounded-lg font-medium hover:bg-olive/90 transition"
          >
            Save Bookmark
          </button>

          {log.quranLastLocation && (
            <p className="text-sm text-neutral-600 mt-2">
              Saved bookmark: Surah {log.quranLastLocation.surahId}, Ayah {log.quranLastLocation.ayah}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}