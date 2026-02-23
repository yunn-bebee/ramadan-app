import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { useAppContext } from '../../contexts/AppContext';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import hadithList from '../../data/hadith.json';
import { RAMADAN_START_2026 } from '../../constants/defaults';

dayjs.extend(dayOfYear);

const getHadithOfTheDay = () => {
  const dayOfYear = dayjs().dayOfYear();
  const index = dayOfYear % hadithList.length;
  return hadithList[index];
};

const formatCountdown = (ms: number): string => {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function Dashboard() {
  const { appData, today } = useAppContext();
  const { times } = usePrayerTimes();

  const hadith = getHadithOfTheDay();

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
        if (diff <= 0 && diff > -1800000) activePrayer = p.name;
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [times]);

  const ramadanDay = dayjs(today).diff(dayjs(RAMADAN_START_2026), 'day') + 1;

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-night-950 pb-28 px-4 pt-4 space-y-4 max-w-md mx-auto transition-colors duration-300">
      
      {/* HEADER: GREETING & CLOCK */}
      <header className="flex justify-between items-end px-1 pt-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-olive-600 dark:text-gold-500">Ramadan Day {ramadanDay}</p>
          <h1 className="text-xl font-serif font-bold text-night-900 dark:text-sand">
            Salaam, {appData.settings.username || 'Friend'}
          </h1>
        </div>
        <div className="bg-white/80 dark:bg-night-900 px-3 py-1.5 rounded-xl border border-olive-100 dark:border-night-800 shadow-sm">
          <p className="text-sm font-mono font-bold text-night-800 dark:text-sand">{currentTime.split(':').slice(0, 2).join(':')}</p>
        </div>
      </header>

      {/* HERO: NEXT PRAYER & COUNTDOWN */}
      <section className="bg-night-900 dark:bg-night-900 rounded-[2rem] p-5 text-white shadow-xl relative overflow-hidden active:scale-[0.99] transition-transform">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-olive-500/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-olive-400">
              {currentPrayer ? 'Currently In' : 'Coming Up'}
            </span>
            <span className="text-[10px] font-mono opacity-50">{dayjs().format('MMM DD')}</span>
          </div>

          <div className="flex flex-col items-center py-2">
            <h2 className="text-4xl font-serif font-bold text-white tracking-tight">
              {currentPrayer || nextPrayerInfo?.name}
            </h2>
            <div className="mt-2 text-3xl font-mono font-bold text-gold-400 tabular-nums">
              {nextPrayerInfo ? formatCountdown(nextPrayerInfo.remainingMs) : '00:00:00'}
            </div>
            <p className="text-[10px] opacity-40 uppercase tracking-tighter mt-1 font-bold">Time remaining until next Adhan</p>
          </div>

          <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
             <div className="text-center flex-1 border-r border-white/10">
                <p className="text-[9px] opacity-50 uppercase">Start Time</p>
                <p className="text-xs font-bold">{nextPrayerInfo?.timeStr}</p>
             </div>
             <div className="text-center flex-1">
                <p className="text-[9px] opacity-50 uppercase">Status</p>
                <p className="text-xs font-bold text-olive-400">{currentPrayer ? 'Active' : 'Awaiting'}</p>
             </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: '📿', label: 'Dhikr', to: '/ibadah' },
          { icon: '📖', label: 'Quran', to: '/quran' },
          { icon: '✍️', label: 'Journal', to: '/journal' },
          { icon: '⚙️', label: 'Set', to: '/settings' },
        ].map(btn => (
          <Link key={btn.label} to={btn.to} className="bg-white dark:bg-night-900 p-3 rounded-2xl border border-olive-50 dark:border-night-800 flex flex-col items-center gap-1 active:scale-90 transition-transform shadow-sm">
            <span className="text-xl">{btn.icon}</span>
            <span className="text-[9px] font-bold uppercase dark:text-sand/60">{btn.label}</span>
          </Link>
        ))}
      </div>

      {/* DAILY FOCUS / SUNNAH SECTION */}
      <section className="bg-white dark:bg-night-900 rounded-[1.5rem] p-4 border border-olive-100 dark:border-night-800 shadow-sm">
        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Today's Focus</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-sand/20 dark:bg-night-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-sm">🌙</span>
              <span className="text-xs font-medium dark:text-sand">Tahajjud Prayer</span>
            </div>
            <span className="text-[10px] font-bold text-olive-600">Complete</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-sand/20 dark:bg-night-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-sm">🚰</span>
              <span className="text-xs font-medium dark:text-sand">Hydrate well after Iftar</span>
            </div>
            <input type="checkbox" className="rounded-full border-olive-200" />
          </div>
        </div>
      </section>

      {/* HADITHS SECTION */}
      <section className="bg-olive-900 text-white rounded-[1.5rem] p-5 shadow-lg relative overflow-hidden">
        <div className="absolute bottom-0 right-0 opacity-10 text-6xl rotate-12 -mb-4 -mr-2">✨</div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-olive-400 mb-3">Daily Hadith</h3>
        <p className="text-sm leading-relaxed font-serif italic opacity-90">"{hadith.text}"</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-[9px] font-bold opacity-40">— {hadith.source}</span>
          <button className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-lg">Share</button>
        </div>
      </section>

      {/* PRAYER TIMELINE */}
      <section className="bg-white dark:bg-night-900 rounded-[1.5rem] p-4 shadow-sm border border-olive-100 dark:border-night-800">
        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Timeline</h3>
        <div className="grid gap-1.5">
          {times && ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => {
            const isActive = currentPrayer === p;
            return (
              <div key={p} className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive ? 'bg-olive-600 text-white shadow-md' : 'bg-neutral-50 dark:bg-night-800/50 text-night-800 dark:text-sand'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-gold-400 animate-pulse' : 'bg-neutral-200 dark:bg-night-700'}`} />
                  <span className={`text-xs font-bold ${isActive ? '' : 'opacity-70'}`}>{p}</span>
                </div>
                <span className="text-xs font-mono font-bold opacity-80">{times[p as keyof typeof times]}</span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}