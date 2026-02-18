export const API_ALADHAN = 'https://api.aladhan.com/v1';
export const API_QURAN = 'https://api.alquran.cloud/v1';

export const CALCULATION_METHODS = [
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Muslim World League (MWL)' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 12, name: 'Union Organization islamic de France' },
  { id: 13, name: 'Diyanet Isleri Baskanligi, Turkey' },
];

export const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Default location (Mecca) if GPS fails/denied
export const DEFAULT_LOCATION = {
  latitude: 21.4225,
  longitude: 39.8262,
  city: 'Makkah',
  country: 'Saudi Arabia'
};
