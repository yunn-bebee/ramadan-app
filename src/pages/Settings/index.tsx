import { useState } from 'react';
import commonCities from '../../data/CommonCities.json';
import dayjs from 'dayjs';
import { useAppContext } from '../../contexts/AppContext';

interface City {
  name: string;
  country: string;
}

const cities: City[] = commonCities;

export default function Settings() {
  const { appData, setAppData } = useAppContext();

  const [username, setUsername] = useState(appData.settings.username ?? '');
  const [city, setCity] = useState(appData.settings.city);
  const [calculationMethod, setCalculationMethod] = useState(appData.settings.calculationMethod);
  const [theme, setTheme] = useState(appData.settings.theme);
  const [quranGoalType, setQuranGoalType] = useState(appData.settings.quranGoal.type);
  const [quranGoalCount, setQuranGoalCount] = useState(appData.settings.quranGoal.count);
  const [taraweehRakahs, setTaraweehRakahs] = useState(appData.settings.taraweehGoal);
  const [showArabicHadith, setShowArabicHadith] = useState(appData.settings.showArabicHadith);

  const handleSave = () => {
    setAppData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        username,
        city,
        calculationMethod,
        theme,
        quranGoal: {
          type: quranGoalType,
          count: quranGoalCount,
          dailyTarget: quranGoalType === 'pages' ? quranGoalCount : 20,
        },
        taraweehGoal: taraweehRakahs,
        showArabicHadith,
      },
    }));
    alert('Settings saved beautifully! ♡');
  };

  return (
    <div className="min-h-screen bg-sand dark:bg-night-950 text-night-900 dark:text-sand transition-colors duration-300 ">
      
      {/* Header */}
      <header className="p-8 pt-12 text-center">
        <h1 className="text-4xl font-serif font-bold text-olive-600 dark:text-olive-400">Settings</h1>
        <p className="text-sm opacity-60 mt-2 italic">Tailor your Ramadan experience</p>
      </header>

      <main className="px-5 flex flex-col gap-6 max-w-2xl mx-auto">
        
        {/* Profile Section */}
        <section className="bg-white dark:bg-night-900 p-6 rounded-[2rem] shadow-sm border border-olive-100 dark:border-night-800">
          <div className="flex items-center gap-2 mb-6 opacity-70">
            <span className="text-lg">👤</span>
            <h2 className="text-xs font-bold uppercase tracking-widest">Personal</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium px-1">Your Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="How shall we greet you?"
                className="w-full bg-sand dark:bg-night-800 border-none p-4 rounded-2xl focus:ring-2 focus:ring-olive transition-all"
              />
            </div>
          </div>
        </section>

        {/* Prayer Section */}
        <section className="bg-white dark:bg-night-900 p-6 rounded-[2rem] shadow-sm border border-olive-100 dark:border-night-800">
          <div className="flex items-center gap-2 mb-6 opacity-70">
            <span className="text-lg">🕌</span>
            <h2 className="text-xs font-bold uppercase tracking-widest">Prayer & Location</h2>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium px-1">Location</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-sand dark:bg-night-800 border-none p-4 rounded-2xl focus:ring-2 focus:ring-olive appearance-none"
              >
                <option value="">Select a city</option>
                {cities.map((c) => (
                  <option key={`${c.name}-${c.country}`} value={c.name}>
                    {c.name}, {c.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium px-1">Calculation Method</label>
              <select
                value={calculationMethod}
                onChange={(e) => setCalculationMethod(e.target.value)}
                className="w-full bg-sand dark:bg-night-800 border-none p-4 rounded-2xl focus:ring-2 focus:ring-olive text-sm"
              >
                <option value="MuslimWorldLeague">Muslim World League</option>
                <option value="Egyptian">Egyptian General Authority</option>
                <option value="ISNA">ISNA (North America)</option>
                <option value="UmmAlQura">Umm Al-Qura (Mecca)</option>
                <option value="Karachi">University of Karachi</option>
                <option value="Singapore">Singapore / SEA</option>
                <option value="Turkey">Turkey (Diyanet)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="bg-white dark:bg-night-900 p-6 rounded-[2rem] shadow-sm border border-olive-100 dark:border-night-800">
          <div className="flex items-center gap-2 mb-6 opacity-70">
            <span className="text-lg">📖</span>
            <h2 className="text-xs font-bold uppercase tracking-widest">Ibadah Goals</h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium px-1">Quran Target</label>
              <div className="flex gap-2">
                <select
                  value={quranGoalType}
                  onChange={(e) => setQuranGoalType(e.target.value as 'khatam' | 'pages')}
                  className="flex-1 bg-sand dark:bg-night-800 border-none p-4 rounded-2xl text-sm"
                >
                  <option value="khatam">Total Khatam</option>
                  <option value="pages">Pages / Day</option>
                </select>
                <input
                  type="number"
                  value={quranGoalCount}
                  onChange={(e) => setQuranGoalCount(Number(e.target.value))}
                  min="1"
                  className="w-20 bg-sand dark:bg-night-800 border-none p-4 rounded-2xl text-center font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium px-1">Taraweeh Goal (Rak'ah)</label>
              <div className="flex flex-wrap gap-2">
                {[4, 8, 12, 16, 20].map((rak) => (
                  <button
                    key={rak}
                    onClick={() => setTaraweehRakahs(rak)}
                    className={`flex-1 min-w-[60px] py-3 rounded-xl text-sm font-bold transition-all ${
                      taraweehRakahs === rak
                        ? 'bg-olive text-white scale-105'
                        : 'bg-sand dark:bg-night-800 text-night-400'
                    }`}
                  >
                    {rak}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="bg-white dark:bg-night-900 p-6 rounded-[2rem] shadow-sm border border-olive-100 dark:border-night-800">
          <div className="flex items-center gap-2 mb-6 opacity-70">
            <span className="text-lg">✨</span>
            <h2 className="text-xs font-bold uppercase tracking-widest">Appearance</h2>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center bg-sand dark:bg-night-800 p-4 rounded-2xl">
              <span className="text-sm font-medium">Dark Mode</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'auto' | 'light' | 'dark')}
                className="bg-transparent border-none text-sm font-bold text-olive-600"
              >
                <option value="auto">System</option>
                <option value="light">Off</option>
                <option value="dark">On</option>
              </select>
            </div>

            <div className="flex justify-between items-center bg-sand dark:bg-night-800 p-4 rounded-2xl">
              <span className="text-sm font-medium">Show Arabic Hadith</span>
              <button 
                onClick={() => setShowArabicHadith(!showArabicHadith)}
                className={`w-12 h-6 rounded-full transition-colors relative ${showArabicHadith ? 'bg-olive' : 'bg-neutral-300 dark:bg-neutral-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showArabicHadith ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 bg-olive text-white font-bold py-5 px-6 rounded-[2rem] shadow-xl shadow-olive-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
        >
          <span>💾</span> Save All Changes
        </button>

        <p className="text-[10px] text-center opacity-40 uppercase tracking-[0.2em] mb-10">
          Last Synced: {dayjs().format('HH:mm')}
        </p>

      </main>
    </div>
  );
}