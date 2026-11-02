import { SurahListItem, SurahDetail } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchSurahList = async (): Promise<SurahListItem[]> => {
  const response = await fetch(`${BASE_URL}/surah`);
  const data = await response.json();
  return data.data;
};

export const fetchSurahDetail = async (surahNumber: number): Promise<{ arabic: SurahDetail, english: SurahDetail }> => {
  // Fetch both Arabic (Uthmani) and English (Sahih International) translations
  const response = await fetch(`${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,en.sahih`);
  const data = await response.json();
  return {
    arabic: data.data[0],
    english: data.data[1]
  };
};

export const getAudioUrl = (surahNumber: number): string => {
  // Using Mishary Rashid Alafasy as default
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
};
