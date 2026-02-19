import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import commonCities from '../data/CommonCities.json'; // adjust path if needed

// Type the JSON
interface CityEntry {
  name: string;
  country: string;
}

const cities: CityEntry[] = commonCities;

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export function usePrayerTimes() {
  const { appData } = useAppContext();
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);

      const selectedCity = appData.settings.city?.trim();

      if (!selectedCity) {
        setError('Please set your city in Settings first ♡');
        setLoading(false);
        return;
      }

      // Step 1: Try to find matching country from commonCities.json
      const matched = cities.find(
        (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
      );

      const country = matched ? matched.country : 'Myanmar'; // fallback to Myanmar if no match

      try {
        const today = new Date().toISOString().split('T')[0];

 const methodMap: Record<string, number> = {
  MuslimWorldLeague: 2,
  Egyptian: 5,
  ISNA: 1,
  UmmAlQura: 4,
  Karachi: 7,
  Singapore: 8,
  MoonsightingCommittee: 15,
  Dubai: 16,
  Qatar: 17,
  Kuwait: 18,
  Turkey: 13,
  // Add more if you want
};

const method = methodMap[appData.settings.calculationMethod] || 2; // fallback to MWL

        // Build URL with both city and country
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(selectedCity)}&country=${encodeURIComponent(country)}&method=${method}&date=${today}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        if (data.code !== 200) {
          throw new Error(data.status || 'API returned an error');
        }

        setTimes(data.data.timings);
      } catch (err) {
        console.error('Prayer times fetch failed:', err);
        setError(
       
            `Could not load times for ${selectedCity}, ${country}. Check spelling?`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [
    appData.settings.city,
    appData.settings.calculationMethod,
    // No need to depend on commonCities since it's static import
  ]);

  return { times, loading, error };
}