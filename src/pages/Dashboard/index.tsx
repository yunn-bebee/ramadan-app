// src/pages/Dashboard/index.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(dayOfYear);
import {
  Clock,
  BookOpen,
  PenLine,
  Settings,
  Zap,
  Droplets,
  CheckCircle2,
  Coins,
  Heart,
  Moon,
  ShieldCheck,
  Smile,
  Sun,
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import hadithList from '../../data/hadith.json';

const formatCountdown = (ms: number): string => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function Dashboard() {
  const { appData, today } = useAppContext();
  const { times } = usePrayerTimes();
  const hadith = hadithList[dayjs().dayOfYear() % hadithList.length];

  const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'));
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{
    name: string;
    remainingMs: number;
    timeStr: string;
  } | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!times) return;
    const update = () => {
      const now = dayjs();
      setCurrentTime(now.format('HH:mm'));
      const todayStr = now.format('YYYY-MM-DD');
      const prayerList = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
        .map((name) => ({
          name,
          timeStr: times[name as keyof typeof times],
        }))
        .filter((p) => p.timeStr);

      let next = null;
      let smallestDiff = Infinity;
      let active = null;

      for (let i = 0; i < prayerList.length; i++) {
        const p = prayerList[i];
        const prayerTime = dayjs(`${todayStr} ${p.timeStr}`, 'YYYY-MM-DD HH:mm');
        const nextP = prayerList[i + 1];
        const nextPrayerTime = nextP
          ? dayjs(`${todayStr} ${nextP.timeStr}`, 'YYYY-MM-DD HH:mm')
          : dayjs(`${todayStr} ${prayerList[0].timeStr}`, 'YYYY-MM-DD HH:mm').add(1, 'day');

        if (now.isAfter(prayerTime) && now.isBefore(nextPrayerTime)) active = p.name;

        let diff = prayerTime.diff(now);
        if (diff < 0) diff = prayerTime.add(1, 'day').diff(now);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          next = { name: p.name, remainingMs: diff, timeStr: prayerTime.format('HH:mm') };
        }
      }
      setNextPrayerInfo(next);
      setCurrentPrayer(active);
    };
    update();
    timerRef.current = window.setInterval(update, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [times]);

  const todayLog = appData.dailyLogs[today] ?? {};
  const prayersDone = Object.values(todayLog.prayers || {}).filter(Boolean).length;
  const dhikrTotal = Object.values(todayLog.dhikrCounts || {}).reduce((sum, c) => sum + (c || 0), 0);
  const disciplineDone = Object.values(todayLog.discipline || {}).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FDFCF9] dark:bg-[#08090A] text-slate-900 dark:text-slate-100 transition-colors pb-24">
      {/* --- HEADER (like Journal) --- */}
      <header className="p-6 pt-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold text-olive-600 dark:text-olive-400">
            Salaam, {appData.settings.username || 'User'}
          </h1>
          <p className="text-sm font-medium opacity-60 mt-1 uppercase tracking-widest">
            Ramadan Day {dayjs().diff(appData.settings.ramadanStartDate, 'day') + 1}
          </p>
        </div>
        <div className="bg-white/80 dark:bg-night-900/80 backdrop-blur-md p-3 rounded-2xl border border-olive-100 dark:border-night-800 shadow-sm text-right">
          <p className="text-lg font-mono font-black tracking-tighter">{currentTime}</p>
          <p className="text-[9px] opacity-40 font-bold uppercase">Local</p>
        </div>
      </header>

      {/* --- HERO COUNTDOWN CARD (spacious like Journal cards) --- */}
      <section className="px-5 mb-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-slate-900 p-8 text-white shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-olive-400 mb-1">
                {currentPrayer ? `Active • ${currentPrayer}` : 'Upcoming'}
              </p>
              <h2 className="text-4xl font-bold tracking-tighter">
                {nextPrayerInfo?.name || '---'}
              </h2>
            </div>
            <div className="text-left md:text-right">
              <p className="text-3xl font-mono font-bold text-gold-400">
                {nextPrayerInfo ? formatCountdown(nextPrayerInfo.remainingMs) : '00:00'}
              </p>
              <p className="text-[9px] opacity-40 font-bold uppercase">Until Adhan</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK NAVIGATION (icon grid, but with more breathing room) --- */}
      <section className="px-5 mb-8">
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: <Clock size={22} />, label: 'Dhikr', to: '/ibadah' },
            { icon: <BookOpen size={22} />, label: 'Quran', to: '/quran' },
            { icon: <PenLine size={22} />, label: 'Journal', to: '/journal' },
            { icon: <Settings size={22} />, label: 'Set', to: '/settings' },
          ].map((btn, i) => (
            <Link
              key={i}
              to={btn.to}
              className="bg-white dark:bg-slate-900 aspect-square rounded-3xl flex flex-col items-center justify-center gap-2 shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95 transition-transform p-4"
            >
              <span className="text-olive-600 dark:text-olive-400">{btn.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">
                {btn.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- FULL IBADAH RECAP (styled exactly like Journal's summary card) --- */}
      <section className="px-5 mb-8">
        <div className="bg-white dark:bg-night-900 p-8 rounded-[2.5rem] shadow-sm border border-olive-100 dark:border-night-800">
          <div className="flex items-center gap-2 mb-8 opacity-60">
            <CheckCircle2 className="w-4 h-4 text-olive-500" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-olive-900 dark:text-sand">
              Full Day Snapshot
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-y-8 gap-x-6">
            <StatRow
              icon={<Droplets className="w-4 h-4 text-olive-500" />}
              label="Fasting"
              val={todayLog.fasted ? 'Yes ✓' : 'No'}
            />
            <StatRow
              icon={<Clock className="w-4 h-4 text-gold-500" />}
              label="Prayers"
              val={`${prayersDone}/5`}
            />
            <StatRow
              icon={<BookOpen className="w-4 h-4 text-blue-500" />}
              label="Quran Pages"
              val={`${todayLog.quranPages || 0}`}
            />
            <StatRow
              icon={<Moon className="w-4 h-4 text-purple-500" />}
              label="Taraweeh"
              val={`${todayLog.taraweeh || 0} R`}
            />
            <StatRow
              icon={<Heart className="w-4 h-4 text-red-500" />}
              label="Dhikr Total"
              val={dhikrTotal.toLocaleString()}
            />
            <StatRow
              icon={<Coins className="w-4 h-4 text-emerald-500" />}
              label="Charity"
              val={todayLog.charity ? `£${todayLog.charity}` : '£0'}
            />
            <StatRow
              icon={<ShieldCheck className="w-4 h-4 text-orange-500" />}
              label="Discipline"
              val={`${disciplineDone}/5`}
            />
            <StatRow
              icon={<Smile className="w-4 h-4 text-yellow-500" />}
              label="Mood"
              val={`${todayLog.mood || '-'}/5`}
            />
          </div>
        </div>
      </section>

      {/* --- HADITH CARD (spacious, with Arabic focus) --- */}
      <section className="px-5 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4 opacity-40">
            <Zap size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Daily Hadith</span>
          </div>
          <p className="text-2xl font-serif text-right leading-relaxed mb-3" dir="rtl">
            {hadith.arabic}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 italic line-clamp-3">
            "{hadith.text}"
          </p>
        </div>
      </section>

      {/* --- PRAYER TIMELINE (as a clean list card) --- */}
      <section className="px-5 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 opacity-40">
            <Sun className="w-4 h-4 text-gold-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">Today's Schedule</span>
          </div>
          <div className="space-y-3">
            {times &&
              ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => {
                const isActive = currentPrayer === p;
                return (
                  <div
                    key={p}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-olive-600 text-white shadow-md scale-[1.02]'
                        : 'bg-slate-50 dark:bg-night-800 border border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-gold-400 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                      <span className="text-sm font-bold">{p}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold opacity-60">
                        {times[p as keyof typeof times]}
                      </span>
                      {isActive && (
                        <span className="text-[8px] font-black uppercase bg-black/20 px-2 py-1 rounded">
                          Now
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}

// Reusable stat row (identical to Journal's version)
function StatRow({
  icon,
  label,
  val,
}: {
  icon: React.ReactNode;
  label: string;
  val: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-[10px] uppercase font-bold opacity-40 mb-2 tracking-widest">
        {icon} {label}
      </div>
      <div className="text-2xl font-serif font-bold leading-none">{val}</div>
    </div>
  );
}