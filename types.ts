// Prayer Types
export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  [key: string]: string;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

export interface PrayerResponseData {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    hijri: HijriDate;
    gregorian: {
      date: string;
      weekday: { en: string };
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export interface PrayerApiResponse {
  code: number;
  status: string;
  data: PrayerResponseData;
}

// Quran Types
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
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
  };
}

export interface QuranApiResponse {
  code: number;
  status: string;
  data: Surah[];
}

export interface SurahDetailResponse {
  code: number;
  status: string;
  data: SurahDetail;
}

// App State
export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface AppSettings {
  calculationMethod: number; // ISNA, MWL, etc.
  asrMethod: 0 | 1; // 0 = Shafi, 1 = Hanafi
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
}
