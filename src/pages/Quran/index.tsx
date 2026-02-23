import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useAppContext } from '../../contexts/AppContext';
import { useQuranMetadata } from '../../hooks/useQuranMetadata';
import { RAMADAN_START_2026 } from '../../constants/defaults';
import juzRanges from '../../data/pageToSurah.json';
import { HiBookmark, HiChevronRight, HiPlus } from 'react-icons/hi';

interface JuzRange {
  juz: number;
  startPage: number;
  endPage: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const juzMap = juzRanges as JuzRange[];

export default function Quran() {
  const { appData, updateDailyLog, today } = useAppContext();
  const { metadata } = useQuranMetadata();

  const log = appData.dailyLogs[today] ?? { quranPages: 0 };
  const [pagesToday, setPagesToday] = useState(log.quranPages);

  const [bookmarkSurahId, setBookmarkSurahId] = useState<number | null>(
    log.quranLastLocation?.surahId ?? null
  );
  const [bookmarkAyah, setBookmarkAyah] = useState<number>(
    log.quranLastLocation?.ayah ?? 1
  );

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
  const progressPercent = Math.min(100, (totalRead / targetTotal) * 100);

  const daysPassed = dayjs(today).diff(dayjs(RAMADAN_START_2026), 'day') + 1;
  const daysRemaining = Math.max(0, 30 - daysPassed);
  const suggestedDaily = daysRemaining > 0 ? Math.ceil(remainingPages / daysRemaining) : 0;

  const incrementPages = (delta: number) => {
    const newPages = Math.max(0, pagesToday + delta);
    setPagesToday(newPages);
    updateDailyLog({ quranPages: newPages });
  };

  const saveBookmark = () => {
    if (bookmarkSurahId === null) return;
    updateDailyLog({
      quranLastLocation: { surahId: bookmarkSurahId, ayah: bookmarkAyah },
    });
  };

  return (
    <div className="min-h-screen bg-sand dark:bg-night-950 pb-28 px-4 pt-6 space-y-6 max-w-md mx-auto transition-colors duration-500">
      
      {/* HEADER */}
      <header className="px-2">
        <h1 className="text-2xl font-serif font-bold text-night-900 dark:text-sand">Quran Companion</h1>
        <p className="text-xs font-bold text-olive-600 dark:text-gold-500 uppercase tracking-widest">Ramadan Progress</p>
      </header>

      {/* 1. PROGRESS CARD */}
      <section className="bg-white dark:bg-night-900 rounded-[2rem] p-6 shadow-sm border border-olive-100 dark:border-night-800">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-black uppercase text-neutral-400 dark:text-night-400 tracking-tighter">Total Read</p>
            <p className="text-3xl font-mono font-bold text-night-900 dark:text-gold-400">
              {totalRead}<span className="text-sm text-neutral-400 dark:text-night-500 font-sans ml-1">/ {targetTotal} pgs</span>
            </p>
          </div>
          <div className="text-right">
             <span className="text-xs font-bold text-olive-600 dark:text-olive-400 bg-olive-50 dark:bg-olive-900/30 px-3 py-1 rounded-full">
                {Math.round(progressPercent)}%
             </span>
          </div>
        </div>
        
        {/* Custom Progress Bar */}
        <div className="w-full h-3 bg-neutral-100 dark:bg-night-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-olive-500 dark:bg-gold-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-50 dark:border-night-800">
           <div>
              <p className="text-[9px] font-bold text-neutral-400 uppercase">Remaining</p>
              <p className="text-sm font-bold dark:text-sand">{remainingPages} pages</p>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-bold text-neutral-400 uppercase">Days Left</p>
              <p className="text-sm font-bold dark:text-sand">{daysRemaining} days</p>
           </div>
        </div>
      </section>

      {/* 2. SUGGESTION & TRACKER (Combined for Mobile) */}
      <div className="grid gap-4">
        <section className="bg-olive-600 dark:bg-olive-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80">Daily Target</h3>
             <div className="flex items-center gap-3 mt-1">
                <span className="text-4xl font-mono font-bold">{suggestedDaily}</span>
                <span className="text-sm opacity-90 leading-tight">pages to stay<br/>on track</span>
             </div>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-20">
              <HiChevronRight size={40} />
           </div>
        </section>

        <section className="bg-white dark:bg-night-900 rounded-3xl p-6 border border-olive-100 dark:border-night-800 shadow-sm">
          <h3 className="text-center text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Read Today</h3>
          <p className="text-5xl font-mono font-bold text-center text-night-900 dark:text-sand mb-6">{pagesToday}</p>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-center gap-2">
              {[1, 5, 10].map(val => (
                <button 
                  key={val} 
                  onClick={() => incrementPages(val)}
                  className="flex-1 bg-olive-50 dark:bg-olive-900/20 text-olive-700 dark:text-olive-400 py-3 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-1"
                >
                  <HiPlus size={14} /> {val}
                </button>
              ))}
            </div>
            <button 
              onClick={() => incrementPages(-1)}
              className="text-neutral-400 dark:text-night-500 text-xs font-bold uppercase tracking-widest py-2 active:opacity-50"
            >
              Reset / Decrease
            </button>
          </div>
        </section>
      </div>

      {/* 3. BOOKMARK SECTION */}
      <section className="bg-night-200 dark:bg-night-900 rounded-[2rem] p-6 border border-gold-200/30 dark:border-night-800">
        <div className="flex items-center gap-2 mb-5">
          <HiBookmark className="text-gold-500" size={20} />
          <h3 className="text-sm font-black text-night-900 dark:text-sand uppercase tracking-widest">Last Read</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Surah</label>
              <select
                value={bookmarkSurahId ?? ''}
                onChange={(e) => setBookmarkSurahId(Number(e.target.value) || null)}
                className="w-full bg-white dark:bg-night-950  border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-olive-500 dark:text-sand shadow-inner"
              >
                <option value="">Where are you at?</option>
                {metadata.surahs.map(s => (
                  <option key={s.id} value={s.id}>{s.id}. {s.name} ({s.english})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Ayah</label>
              <input
                type="number"
                value={bookmarkAyah}
                onChange={(e) => setBookmarkAyah(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white dark:bg-night-950 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-olive-500 dark:text-sand shadow-inner"
              />
            </div>
          </div>

          <button
            onClick={saveBookmark}
            className="w-full bg-night-900 dark:bg-gold-500 text-white dark:text-night-950 py-4 rounded-2xl font-bold shadow-lg shadow-night-900/10 dark:shadow-gold-500/10 active:scale-[0.98] transition-all mt-2"
          >
            Save My Place
          </button>
        </div>
      </section>
    </div>
  );
}