// src/pages/Journal/index.tsx
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { 
  Heart, 
  Calendar, 
  ChevronRight, 
  Save, 
  BookOpen, 
  Moon, 
  Sun, 
  Zap,
  CheckCircle2 
} from 'lucide-react'; 
import { useAppContext } from '../../contexts/AppContext';
import { RAMADAN_START_2026 } from '../../constants/defaults';

export default function Journal() {
  const { appData, today, updateDailyLog } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [mood, setMood] = useState(3);
  const [journalText, setJournalText] = useState('');

  const selectedLog = appData.dailyLogs[selectedDate] ?? null;
  const isToday = selectedDate === today;

  useEffect(() => {
    const log = appData.dailyLogs[selectedDate];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMood(log?.mood ?? 3);
    setJournalText(log?.journal ?? '');
  }, [selectedDate, appData.dailyLogs]);

  const ramadanStart = dayjs(RAMADAN_START_2026);
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const dayDate = ramadanStart.add(i, 'day').format('YYYY-MM-DD');
    const dayLog = appData.dailyLogs[dayDate];
    return {
      date: dayDate,
      dayNumber: i + 1,
      hasEntry: !!dayLog?.journal,
    };
  });

  const saveJournal = () => {
    updateDailyLog({ mood, journal: journalText });
    alert("Reflection saved to your heart ♡");
  };

  return (
    <div className="min-h-screen bg-sand dark:bg-night-950 text-night-900 dark:text-sand transition-colors duration-300 pb-24">
      
      {/* --- HEADER --- */}
      <header className="p-6 pt-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-serif font-bold text-olive-600 dark:text-olive-400 flex items-center gap-2">
            Journal <BookOpen className="w-8 h-8 opacity-40" />
          </h1>
          <p className="text-sm font-medium opacity-60 mt-1 uppercase tracking-widest">Ramadan 2026</p>
        </div>
        <div className="bg-white/80 dark:bg-night-900/80 backdrop-blur-md p-3 rounded-2xl border border-olive-100 dark:border-night-800 shadow-sm">
          <Calendar className="w-6 h-6 text-olive-600" />
        </div>
      </header>

      {/* --- HORIZONTAL CALENDAR --- */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-olive-700 dark:text-gold-400">
            Timeline
          </h2>
          <div className="flex items-center gap-1 text-[10px] opacity-40 italic">
            Swipe <ChevronRight className="w-3 h-3" />
          </div>
        </div>
        
        {/* Mobile Swipe Strip */}
        <div className="flex gap-3 overflow-x-auto pb-4 scroll-smooth snap-x overflow-y-hidden" style={{ scrollbarWidth: 'none' }}>
          {calendarDays.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              className={`flex-shrink-0 w-16 h-20 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 transition-all snap-start border-2 ${
                day.date === selectedDate
                  ? 'bg-olive text-white border-olive-400 shadow-lg scale-105'
                  : day.hasEntry
                  ? 'bg-white dark:bg-night-900 border-olive-200 dark:border-olive-800'
                  : 'bg-white/20 dark:bg-night-900/20 border-transparent opacity-60'
              }`}
            >
              <span className="text-[9px] font-bold opacity-60 uppercase">Day</span>
              <span className="text-xl font-bold font-serif">{day.dayNumber}</span>
              {day.hasEntry && <div className="w-1 h-1 rounded-full bg-gold-400" />}
            </button>
          ))}
        </div>
      </section>

      <main className="px-5 space-y-6">
        
        {/* --- MOOD SECTION --- */}
        <div className="bg-white dark:bg-night-900 p-6 rounded-[2.5rem] shadow-sm border border-olive-100 dark:border-night-800">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className={`w-4 h-4 text-olive-500 ${mood >= 4 ? 'fill-current' : ''}`} />
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Heart State</span>
          </div>
          
          <div className="flex justify-around items-center max-w-sm mx-auto">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                disabled={!isToday}
                onClick={() => setMood(level)}
                className={`text-2xl w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                  mood === level 
                  ? 'bg-gold-100 dark:bg-gold-900/30 scale-125 rotate-3 shadow-inner' 
                  : 'grayscale opacity-40 hover:grayscale-0'
                } disabled:cursor-default`}
              >
                {level === 1 && '☁️'}
                {level === 2 && '🍃'}
                {level === 3 && '🌙'}
                {level === 4 && '✨'}
                {level === 5 && '🌟'}
              </button>
            ))}
          </div>
        </div>

        {/* --- JOURNAL TEXTAREA --- */}
        <div className="bg-white dark:bg-night-900 p-8 rounded-[2.5rem] shadow-sm border border-olive-100 dark:border-night-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-2xl text-olive-800 dark:text-sand">
              {isToday ? "Reflections" : `Day ${calendarDays.find(d => d.date === selectedDate)?.dayNumber}`}
            </h3>
            <span className="text-[10px] font-bold text-night-400 bg-night-50 dark:bg-night-800 px-3 py-1 rounded-full uppercase tracking-tighter">
              {isToday ? "Today" : dayjs(selectedDate).format('MMM D')}
            </span>
          </div>
          
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            disabled={!isToday}
            placeholder="Write something for your future self..."
            className="w-full bg-transparent border-none focus:ring-0 text-night-800 dark:text-night-100 placeholder:text-neutral-200 dark:placeholder:text-night-800 resize-none text-lg leading-relaxed min-h-[180px]"
          />

          {isToday && (
            <button
              onClick={saveJournal}
              className="mt-6 w-full bg-olive text-white py-4 rounded-[1.5rem] font-bold shadow-lg shadow-olive-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save to Journal
            </button>
          )}
        </div>

        {/* --- IBADAH RECAP --- */}
        {selectedLog && (
          <div className="bg-night-900 dark:bg-night-900 p-8 rounded-[2.5rem] text-sand shadow-xl">
            <div className="flex items-center gap-2 mb-6 opacity-60">
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Ibadah Summary</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <StatRow icon={<Sun className="w-4 h-4 text-gold-500"/>} label="Prayers" val={`${Object.values(selectedLog.prayers).filter(Boolean).length}/5`} />
              <StatRow icon={<Moon className="w-4 h-4 text-gold-500"/>} label="Taraweeh" val={`${selectedLog.taraweeh} R`} />
              <StatRow icon={<BookOpen className="w-4 h-4 text-gold-500"/>} label="Quran" val={`${selectedLog.quranPages} Pgs`} />
              <StatRow icon={<Zap className="w-4 h-4 text-gold-500"/>} label="Charity" val={selectedLog.charity > 0 ? "Yes" : "—"} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatRow({ icon, label, val }: { icon: React.ReactNode; label: string; val: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-[10px] uppercase font-medium opacity-40 mb-1">
        {icon} {label}
      </div>
      <div className="text-lg font-serif">{val}</div>
    </div>
  );
}