import { useAppContext } from '../../contexts/AppContext';
import DhikrSection from '../../components/DhikrCounter';
import DuaVault from '../../components/DuaVault';
import { Heart } from 'lucide-react';

export default function Ibadah() {
  const { appData, today, updateDailyLog } = useAppContext();

  const log = appData.dailyLogs[today] || {
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    taraweeh: 0,
    fasted: false,
    charity: 0,
    discipline: { noGossip: false, noComplaining: false, loweredGaze: false, controlledAnger: false, guardedTongue: false },
  };

  const togglePrayer = (prayer: keyof typeof log.prayers) => {
    updateDailyLog({
      prayers: { ...log.prayers, [prayer]: !log.prayers[prayer] },
    });
  };

  const adjustTaraweeh = (delta: number) => {
    const newValue = Math.max(0, (log.taraweeh || 0) + delta);
    updateDailyLog({ taraweeh: newValue });
  };

  const goal = appData.settings.taraweehGoal;

  return (
    <div className="min-h-screen bg-sand dark:bg-night-950 text-night-900 dark:text-sand transition-colors duration-300 pb-24 px-5 ">
        {/* --- HEADER --- */}
      <header className="py-6 pt-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-serif font-bold text-olive-600 dark:text-olive-400 flex items-center gap-2">
            My Ibadah 
          </h1>
          <p className="text-sm font-medium opacity-60 mt-1 uppercase tracking-widest">Building my Jannah</p>
        </div>
        <div className="bg-white/80 dark:bg-night-900/80 backdrop-blur-md p-3 rounded-2xl border border-olive-100 dark:border-night-800 shadow-sm">
          <Heart className="w-6 h-6 text-olive-600" />
        </div>
      </header>

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        
        {/* Fasting Card */}
        <div className="bg-white dark:bg-night-900 p-6 rounded-[2.5rem] shadow-sm border border-olive-100 dark:border-night-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold">Fasting Today</h2>
            <p className="text-xs text-olive-600/70 dark:text-gold-500/70 italic">
              {log.fasted ? "May Allah accept your fast ♡" : "Intention for Allah"}
            </p>
          </div>
          <button 
            onClick={() => updateDailyLog({ fasted: !log.fasted })}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
              log.fasted ? 'bg-olive text-white shadow-lg' : 'bg-sand dark:bg-night-800'
            }`}
          >
            {log.fasted ? "⭐" : "🌙"}
          </button>
        </div>

        {/* Fard Prayers Card */}
        <div className="bg-white dark:bg-night-900 p-6 rounded-[2.5rem] shadow-sm border border-olive-100 dark:border-night-800">
          <h2 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Fard Prayers</h2>
          <div className="flex justify-between gap-2">
            {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => (
              <button
                key={p}
                onClick={() => togglePrayer(p as keyof typeof log.prayers)}
                className={`flex-1 flex flex-col items-center py-4 rounded-2xl transition-all ${
                  log.prayers[p as keyof typeof log.prayers]
                    ? 'bg-olive text-white shadow-md'
                    : 'bg-sand dark:bg-night-800 text-night-400'
                }`}
              >
                <span className="text-[10px] font-bold uppercase mb-1">{p.slice(0, 3)}</span>
                <span className="text-lg">{log.prayers[p as keyof typeof log.prayers] ? '✓' : '•'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Taraweeh & Charity Row */}
        <div className="grid grid-cols-2 gap-4">
           {/* Taraweeh */}
           <div className="bg-white dark:bg-night-900 p-5 rounded-[2.5rem] shadow-sm border border-olive-100 dark:border-night-800 flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3">Taraweeh</span>
              <div className="flex items-center gap-4">
                <button onClick={() => adjustTaraweeh(-1)} className="w-8 h-8 rounded-full bg-sand dark:bg-night-800 text-lg font-bold">-</button>
                <span className="text-xl font-serif font-bold text-olive">{log.taraweeh}</span>
                <button onClick={() => adjustTaraweeh(1)} className="w-8 h-8 rounded-full bg-olive text-white text-lg font-bold shadow-sm">+</button>
              </div>
              <span className="text-[10px] mt-2 opacity-40">Goal: {goal}</span>
           </div>

           {/* Charity */}
           <div className="bg-white dark:bg-night-900 p-5 rounded-[2.5rem] shadow-sm border border-olive-100 dark:border-night-800 flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Charity</span>
              <input 
                type="number" 
                value={log.charity || ''} 
                onChange={(e) => updateDailyLog({ charity: Number(e.target.value) })}
                placeholder="0"
                className="w-full bg-transparent text-center text-xl font-serif font-bold text-olive border-none focus:ring-0"
              />
              <span className="text-[10px] opacity-40 uppercase">Acts of Sadaqah</span>
           </div>
        </div>

        {/* Discipline Section */}
        <div className="bg-olive-900 dark:bg-night-900 p-8 rounded-[2.5rem] text-sand shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-60">Heart's Discipline</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { key: 'noGossip', label: 'No Gossip', emoji: '🙊' },
              { key: 'noComplaining', label: 'No Complaining', emoji: '🤫' },
              { key: 'loweredGaze', label: 'Lowered Gaze', emoji: '😌' },
              { key: 'controlledAnger', label: 'Controlled Anger', emoji: '🧊' },
              { key: 'guardedTongue', label: 'Guarded Tongue', emoji: '✨' },
            ].map(({ key, label, emoji }) => (
              <button 
                key={key}
                onClick={() => updateDailyLog({
                  discipline: { ...log.discipline, [key]: !log.discipline[key as keyof typeof log.discipline] },
                })}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  log.discipline[key as keyof typeof log.discipline]
                    ? 'bg-olive text-white border-gold-500 shadow-lg'
                    : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <span className="font-medium">{label}</span>
                <span className="text-xl">{log.discipline[key as keyof typeof log.discipline] ? '✓' : emoji}</span>
              </button>
            ))}
          </div>
        </div>

        <DhikrSection />
        <DuaVault />
      </div>
    </div>
  );
}