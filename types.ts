
export interface SurahListItem {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  audio?: string;
  audioSecondary?: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | any;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
  edition?: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
    direction: string | null;
  };
}

export interface Theme {
  id: string;
  name: string;
  bg: string;
  card: string;
  text: string;
  accent: string;
  border: string;
  primary: string;
  isDark: boolean;
}

export enum FontOption {
  Amiri = 'Amiri',
  Lateef = 'Lateef',
  Scheherazade = 'Scheherazade New',
}

export interface TafseerResponse {
  verse: string;
  tafseer: string;
  reflection: string;
}
