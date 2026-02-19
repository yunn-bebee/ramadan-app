import { useState } from 'react';
import commonCities from '../../data/CommonCities.json';
import dayjs from 'dayjs';
import { useAppContext } from '../../contexts/AppContext'; // adjust path if needed

// Type the imported JSON safely
interface City {
  name: string;
  country: string;
}

const cities: City[] = commonCities;

export default function Settings() {
  const { appData, setAppData } = useAppContext();

  // Local form state synced with appData.settings
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
    alert('Settings saved beautifully! ♡ Go check Dashboard to see your changes.');
  };

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen  text-night">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Username */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">Your Name (for a personal touch ♡)</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. Yun"
          className="border border-neutral-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
        />
      </div>

      {/* City Select */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">City for Prayer Times</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-neutral-300 p-3 rounded-lg bg-white"
        >
          <option value="">Select a city</option>
          {cities.map((c) => (
            <option key={`${c.name}-${c.country}`} value={c.name}>
              {c.name}, {c.country}
            </option>
          ))}
        </select>
      </div>

      {/* Calculation Method */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">Prayer Calculation Method</label>
       <select
  value={calculationMethod}
  onChange={(e) => setCalculationMethod(e.target.value)}
  className="border border-neutral-300 p-3 rounded-lg bg-white"
>
  <option value="MuslimWorldLeague">Muslim World League (default, good for many)</option>
  <option value="Egyptian">Egyptian General Authority</option>
  <option value="ISNA">ISNA (North America)</option>
  <option value="UmmAlQura">Umm Al-Qura (Mecca, often early)</option>
  <option value="Karachi">Karachi University (popular in South Asia)</option>
  <option value="Singapore">Singapore (very close to Malaysia/SEA)</option>
  <option value="MoonsightingCommittee">Moonsighting Committee (local sighting-based)</option>
  <option value="Dubai">Dubai (UAE method)</option>
  <option value="Qatar">Qatar</option>
  <option value="Kuwait">Kuwait</option>
  <option value="Turkey">Turkey (Diyanet)</option>
</select>
      </div>

      {/* Theme */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'auto' | 'light' | 'dark')}
          className="border border-neutral-300 p-3 rounded-lg bg-white"
        >
          <option value="auto">Auto (system)</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Quran Goal */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">Quran Goal</label>
        <div className="flex gap-4 items-center">
          <select
            value={quranGoalType}
            onChange={(e) => setQuranGoalType(e.target.value as 'khatam' | 'pages')}
            className="border border-neutral-300 p-3 rounded-lg bg-white flex-1"
          >
            <option value="khatam">Full Khatam(s)</option>
            <option value="pages">Pages per day</option>
          </select>
          <input
            type="number"
            value={quranGoalCount}
            onChange={(e) => setQuranGoalCount(Number(e.target.value))}
            min="1"
            max="30"
            className="border border-neutral-300 p-3 rounded-lg w-24 text-center"
          />
        </div>
        <p className="text-sm text-neutral-600">
          {quranGoalType === 'khatam'
            ? `${quranGoalCount} full reading${quranGoalCount > 1 ? 's' : ''}`
            : `${quranGoalCount} pages daily`}
        </p>
      </div>

      {/* Taraweeh Rak'ah Goal */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">Taraweeh Rak'ah Goal</label>
        <div className="flex flex-wrap gap-6">
          {[4, 8, 12, 16, 20].map((rak) => (
            <label key={rak} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="taraweeh"
                value={rak}
                checked={taraweehRakahs === rak}
                onChange={() => setTaraweehRakahs(rak)}
                className="accent-olive w-5 h-5"
              />
              {rak} rak'ah
            </label>
          ))}
        </div>
      </div>

      {/* Hadith Arabic Toggle */}
      <div className="flex items-center justify-between">
        <label className="font-medium">Show Arabic in Hadith of the Day</label>
        <input
          type="checkbox"
          checked={showArabicHadith}
          onChange={(e) => setShowArabicHadith(e.target.checked)}
          className="w-5 h-5 accent-olive"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 bg-olive text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition"
      >
        Save Settings
      </button>

      {/* Quick status */}
      <p className="text-sm text-neutral-500 mt-4 text-center">
        Last saved: {dayjs().format('HH:mm')} • Changes apply immediately ♡
      </p>
    </div>
  );
}