import { API_ALADHAN, API_QURAN } from '../constants';
import { PrayerApiResponse, QuranApiResponse, SurahDetailResponse } from '../types';

export const fetchPrayerTimes = async (
  lat: number,
  lng: number,
  method: number = 2,
  school: 0 | 1 = 0
): Promise<PrayerApiResponse | null> => {
  try {
    // Current timestamp for today's date
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    
    const url = `${API_ALADHAN}/timings/${formattedDate}?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch prayer times');
    return await response.json();
  } catch (error) {
    console.error('API Error (Prayer):', error);
    return null;
  }
};

export const fetchSurahList = async (): Promise<QuranApiResponse | null> => {
  try {
    const response = await fetch(`${API_QURAN}/surah`);
    if (!response.ok) throw new Error('Failed to fetch surah list');
    return await response.json();
  } catch (error) {
    console.error('API Error (Quran List):', error);
    return null;
  }
};

export const fetchSurahDetails = async (surahNumber: number): Promise<{ arabic: SurahDetailResponse; translation: SurahDetailResponse } | null> => {
  try {
    // Fetch Arabic text
    const arabicRes = await fetch(`${API_QURAN}/surah/${surahNumber}`);
    // Fetch English Translation (Sahih International)
    const transRes = await fetch(`${API_QURAN}/surah/${surahNumber}/en.sahih`);

    if (!arabicRes.ok || !transRes.ok) throw new Error('Failed to fetch surah details');

    return {
      arabic: await arabicRes.json(),
      translation: await transRes.json(),
    };
  } catch (error) {
    console.error('API Error (Surah Detail):', error);
    return null;
  }
};
