// src/pages/Journal/index.tsx
import { useState } from 'react';
import dayjs from 'dayjs';
import { useAppContext } from '../../contexts/AppContext';
import { RAMADAN_START_2026 } from '../../constants/defaults';

export default function Journal() {
  const { appData, today, updateDailyLog } = useAppContext();

  const currentLog = appData.dailyLogs[today] ?? {
    mood: 3,
    journal: '',
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    taraweeh: 0,
    quranPages: 0,
    dhikrCounts: {},
    charity: 0,
    discipline: { noGossip: false, noComplaining: false },
  };

  const [mood, setMood] = useState(currentLog.mood);
  const [journalText, setJournalText] = useState(currentLog.journal);

  // Selected day for viewing past entries
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const selectedLog = appData.dailyLogs[selectedDate] ?? null;

  // Generate 30 days starting from Ramadan start
  const ramadanStart = dayjs(RAMADAN_START_2026);
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const dayDate = ramadanStart.add(i, 'day').format('YYYY-MM-DD');
    const dayLog = appData.dailyLogs[dayDate];
    return {
      date: dayDate,
      dayNumber: i + 1,
      hasEntry: !!dayLog,
      mood: dayLog?.mood ?? null,
    };
  });

  const saveJournal = () => {
    updateDailyLog({
      mood,
      journal: journalText,
    });
  };

  const isToday = selectedDate === today;

  // Helper to show prayer icons
  const prayerIcons = (prayers: typeof currentLog.prayers) => (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(prayers).map(([key, done]) => (
        <span key={key} className={`text-sm ${done ? 'text-olive' : 'text-neutral-400'}`}>
          {key.toUpperCase().slice(0, 3)} {done ? '✓' : '✗'}
        </span>
      ))}
    </div>
  );

  // Helper to show dhikr summary
  const dhikrSummary = (counts: Record<string, number>) => {
    if (Object.keys(counts).length === 0) return 'No dhikr recorded';
    return Object.entries(counts)
      .map(([name, count]) => `${name}: ${count}`)
      .join(', ');
  };

  return (
    <div className="p-6 flex flex-col gap-6 min-h-screen  text-night">
      <h1 className="text-2xl font-bold">Journal</h1>

      {/* 30-Day Calendar Grid */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Your 30 Days</h2>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {calendarDays.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              className={`p-3 rounded-lg text-center transition-all text-sm font-medium ${
                day.date === selectedDate
                  ? 'bg-olive text-white shadow-md'
                  : day.hasEntry
                  ? 'bg-olive/20 hover:bg-olive/40 border border-olive/30'
                  : 'bg-neutral-100 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              Day {day.dayNumber}
              {day.mood && (
                <div className="mt-1 text-xs opacity-80">
                  {day.mood === 5 ? '🌟' : day.mood === 1 ? '💔' : '🩷'}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day View / Editor */}
      <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-6">
        <h2 className="text-xl font-semibold">
          {isToday ? 'Today’s Reflection' : `Day ${calendarDays.find(d => d.date === selectedDate)?.dayNumber} • ${dayjs(selectedDate).format('MMM D')}`}
        </h2>

        {/* Mood (editable only today) */}
        <div>
          <label className="block text-sm font-medium mb-3">Heart’s Mood</label>
          <div className="flex gap-4 justify-center flex-wrap">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setMood(level)}
                disabled={!isToday}
                className={`w-12 h-12 rounded-full text-xl font-bold transition ${
                  mood === level
                    ? 'bg-olive text-white shadow-md'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-neutral-600 mt-3">
            {mood === 1 ? 'A little heavy today...' : ''}
            {mood === 2 ? 'Could be better...' : ''}
            {mood === 3 ? 'Steady, alhamdulillah ♡' : ''}
            {mood === 4 ? 'Feeling lighter!' : ''}
            {mood === 5 ? 'So grateful, ya Allah!' : ''}
          </p>
        </div>

        {/* Journal Entry */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium mb-3">
            {isToday ? 'What’s on your heart tonight?' : 'Reflection from that day'}
          </label>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            disabled={!isToday}
            placeholder="What touched you today? A verse, a moment, a feeling... write it here ♡"
            className="flex-1 border border-neutral-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive resize-none disabled:bg-neutral-100 disabled:text-neutral-500"
          />
        </div>

        {/* Full Daily Log View */}
        {selectedLog && (
          <div className="border-t border-neutral-200 pt-6 mt-4">
            <h3 className="text-md font-semibold mb-3">That Day’s Ibadah</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Prayers:</strong> {prayerIcons(selectedLog.prayers)}</p>
                <p><strong>Taraweeh:</strong> {selectedLog.taraweeh} rak'ah</p>
                <p><strong>Quran Pages:</strong> {selectedLog.quranPages}</p>
              </div>
              <div>
                <p><strong>Dhikr:</strong> {dhikrSummary(selectedLog.dhikrCounts)}</p>
                <p><strong>Charity:</strong> {selectedLog.charity}</p>
                <p><strong>Discipline:</strong> {Object.entries(selectedLog.discipline).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None marked'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Save (only for today) */}
        {isToday && (
          <button
            onClick={saveJournal}
            className="bg-olive text-white py-3 px-6 rounded-lg font-medium hover:bg-olive/90 transition mt-4"
          >
            Save Reflection
          </button>
        )}

        {!isToday && journalText && (
          <p className="text-sm text-neutral-500 italic mt-4">
            Saved on {dayjs(selectedDate).format('MMM D, YYYY')}
          </p>
        )}
      </div>
    </div>
  );
}