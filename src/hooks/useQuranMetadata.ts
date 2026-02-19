import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { SurahInfo } from '../types/types';


interface QuranMetadata {
  surahs: SurahInfo[];
  totalPages: number; // Standard mushaf ~604
  // Add juz mappings if needed later
}

const DEFAULT_METADATA: QuranMetadata = {
  surahs: [], // Fallback empty
  totalPages: 604,
};

export function useQuranMetadata() {
  const [metadata, setMetadata] = useLocalStorage<QuranMetadata>('quranMetadata', DEFAULT_METADATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (metadata.surahs.length > 0) return; // Already cached

    async function fetchMetadata() {
      setLoading(true);
      try {
        // Fetch surah list with ayah counts (no text!)
        const res = await fetch('https://api.quran.com/api/v4/chapters?language=en');
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const surahs: SurahInfo[] = data.chapters.map((ch: any) => ({
          id: ch.id,
          name: ch.name_arabic,
          english: ch.translated_name.name,
          revelationType: ch.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
          ayahCount: ch.verses_count, // For progress calc
        }));
        setMetadata({ ...metadata, surahs });
      } catch (err) {
        setError('Failed to fetch Quran metadata. Using defaults.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, [metadata, setMetadata]);

  // Helper to calculate pages left (estimate: ~15 lines/page, but use totalPages for goals)
  function calculatePagesLeft(currentPages: number, goalKhatams: number) {
    const target = metadata.totalPages * goalKhatams;
    return Math.max(0, target - currentPages);
  }

  // Bookmark helper (store in dailyLog.quranLastLocation)
  // Usage: In UI, dropdown surahs from metadata.surahs, then ayah 1 to surah.ayahCount

  return { metadata, loading, error, calculatePagesLeft };
}