// src/pages/Ibadah/index.tsx
import { useAppContext } from '../../contexts/AppContext';
import DhikrSection from '../../components/DhikrCounter';
import DuaVault from '../../components/DuaVault';

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
      prayers: {
        ...log.prayers,
        [prayer]: !log.prayers[prayer],
      },
    });
  };

  const adjustTaraweeh = (delta: number) => {
    const newValue = Math.max(0, (log.taraweeh || 0) + delta);
    updateDailyLog({ taraweeh: newValue });
  };


  const goal = appData.settings.taraweehGoal;

  return (
    <div className="p-6 flex flex-col gap-6  min-h-screen">
      <h1 className="text-2xl font-bold text-night">Ibadah Tracker</h1>

      {/* Fasting */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Fasting Today</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={log.fasted ?? false}
            onChange={(e) => updateDailyLog({ fasted: e.target.checked })}
            className="w-6 h-6 accent-olive rounded border-neutral-300"
          />
          <span className="text-night font-medium">I fasted today ♡</span>
        </label>
        <p className="text-sm text-neutral-600 mt-2">
          {log.fasted ? "Alhamdulillah — may Allah accept it" : "Don’t forget your intention for tomorrow"}
        </p>
      </div>

      {/* Prayers */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Fard Prayers</h2>
        <div className="grid grid-cols-5 gap-3">
          {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => (
            <button
              key={p}
              onClick={() => togglePrayer(p as keyof typeof log.prayers)}
              className={`p-4 rounded-lg text-center font-medium transition ${
                log.prayers[p as keyof typeof log.prayers]
                  ? 'bg-olive text-white'
                  : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
            >
              {p.toUpperCase().slice(0, 3)}
              {log.prayers[p as keyof typeof log.prayers] && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Taraweeh */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Taraweeh</h2>
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => adjustTaraweeh(-1)}
            className="w-12 h-12 bg-neutral-200 rounded-full text-2xl font-bold hover:bg-neutral-300"
          >
            -
          </button>
          <span className="text-3xl font-bold text-olive">
            {log.taraweeh || 0} / {goal}
          </span>
          <button
            onClick={() => adjustTaraweeh(1)}
            className="w-12 h-12 bg-olive text-white rounded-full text-2xl font-bold hover:bg-olive/90"
          >
            +
          </button>
        </div>
      </div>

      {/* Charity */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Charity Today</h2>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={log.charity ?? 0}
            onChange={(e) => updateDailyLog({ charity: Number(e.target.value) })}
            min="0"
            className="border border-neutral-300 p-3 rounded-lg w-32 text-center focus:outline-none focus:ring-2 focus:ring-olive"
          />
          <span className="text-sm text-neutral-600">acts / amount given ♡</span>
        </div>
        <p className="text-sm text-neutral-600 mt-2">
          {log.charity > 0 ? "May Allah multiply it for you" : "Every small act counts..."}
        </p>
      </div>

      {/* Discipline */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Discipline Today</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'noGossip', label: 'No Gossip' },
            { key: 'noComplaining', label: 'No Complaining' },
            { key: 'loweredGaze', label: 'Lowered Gaze' },
            { key: 'controlledAnger', label: 'Controlled Anger' },
            { key: 'guardedTongue', label: 'Guarded Tongue' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={log.discipline[key as keyof typeof log.discipline] ?? false}
                onChange={(e) => updateDailyLog({
                  discipline: {
                    ...log.discipline,
                    [key]: e.target.checked,
                  },
                })}
                className="w-6 h-6 accent-olive rounded border-neutral-300"
              />
              <span className="text-night font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dhikr & Dua */}
      <DhikrSection />
      <DuaVault />
    </div>
  );
}