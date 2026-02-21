import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation } from 'lucide-react';
import { PrayerResponseData, PrayerTimings } from '../types';
import { PRAYER_NAMES } from '../constants';

interface PrayerDashboardProps {
  data: PrayerResponseData | null;
  loading: boolean;
  error: string | null;
  locationName: string;
}

const PRAYER_KEYS: Record<string, string> = {
  Fajr: 'prayer.fajr',
  Sunrise: 'prayer.sunrise',
  Dhuhr: 'prayer.dhuhr',
  Asr: 'prayer.asr',
  Maghrib: 'prayer.maghrib',
  Isha: 'prayer.isha',
};

export const PrayerDashboard: React.FC<PrayerDashboardProps> = ({ data, loading, error, locationName }) => {
  const { t, i18n } = useTranslation();
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; timeLeft: string } | null>(null);

  useEffect(() => {
    if (!data) return;

    const timer = setInterval(() => {
      calculateNextPrayer(data.timings);
    }, 1000);

    calculateNextPrayer(data.timings); // Initial call

    return () => clearInterval(timer);
  }, [data]);

  const calculateNextPrayer = (timings: PrayerTimings) => {
    const now = new Date();
    const timeToMinutes = (timeStr: string) => {
      const cleanTime = timeStr.split(' ')[0];
      const [hours, minutes] = cleanTime.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let upcoming = null;
    let minDiff = Infinity;

    const prayers = PRAYER_NAMES;

    for (const name of prayers) {
      const timeStr = timings[name];
      if (!timeStr) continue;
      const prayerMinutes = timeToMinutes(timeStr);
      let diff = prayerMinutes - currentMinutes;

      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        upcoming = { name, time: timeStr, diff };
      }
    }

    if (!upcoming) {
      const fajrMinutes = timeToMinutes(timings.Fajr);
      const diff = (24 * 60 - currentMinutes) + fajrMinutes;
      upcoming = { name: 'Fajr', time: timings.Fajr, diff };
    }

    const secondsNow = now.getSeconds();
    const secsRemaining = (60 - secondsNow) % 60;
    const totalMinutesLeft = secsRemaining > 0 ? upcoming.diff - 1 : upcoming.diff;
    const hoursLeft = Math.max(0, Math.floor(totalMinutesLeft / 60));
    const minsLeft = Math.max(0, totalMinutesLeft % 60);

    const timeLeft = `-${hoursLeft.toString().padStart(2, '0')}:${minsLeft.toString().padStart(2, '0')}:${secsRemaining.toString().padStart(2, '0')}`;

    setNextPrayer({
      name: upcoming.name,
      time: upcoming.time.split(' ')[0],
      timeLeft
    });
  };

  const formatTime = (time: string) => {
    if (i18n.language === 'ar') {
      return time.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    }
    return time;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 animate-pulse">{t('prayer.calculatingTimes')}</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
          <Navigation className="text-red-500" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{t('prayer.locationError')}</h3>
        <p className="text-slate-500 dark:text-slate-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          {t('prayer.retry')}
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header Location */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-amiri">
            {i18n.language === 'ar' ? data.date.hijri.weekday.ar : data.date.hijri.weekday.en}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{data.date.readable}</p>
          <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-1 font-amiri">
            {i18n.language === 'ar'
              ? `${data.date.hijri.day} ${data.date.hijri.month.ar} ${data.date.hijri.year}`
              : `${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year}`
            }
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end space-x-1 text-slate-600 dark:text-slate-300">
            <MapPin size={14} />
            <span className="text-sm font-medium">{locationName}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {data.meta.timezone}
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

        <div className="relative z-10 text-center space-y-2">
          <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">{t('prayer.nextPrayer')}</p>
          <h1 className="text-4xl font-bold">{nextPrayer ? t(PRAYER_KEYS[nextPrayer.name] || nextPrayer.name) : '...'}</h1>
          <div className="font-mono text-5xl font-light tracking-tight my-4" dir="ltr">
            {nextPrayer?.timeLeft || '00:00:00'}
          </div>
          <div className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
            <span className="mr-2">{t('prayer.startsAt')}</span>
            <span className="font-semibold" dir="ltr">{nextPrayer?.time}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-3">
        {PRAYER_NAMES.map((name) => {
          const time = data.timings[name].split(' ')[0];
          const isNext = nextPrayer?.name === name;

          return (
            <div
              key={name}
              className={`flex items-center justify-between p-4 rounded-xl transition-all border ${isNext
                  ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                  : 'bg-white border-slate-100 hover:border-emerald-100 dark:bg-slate-900 dark:border-slate-800'
                }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-10 rounded-full ${isNext ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                <div>
                  <h3 className={`font-semibold ${isNext ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {t(PRAYER_KEYS[name] || name)}
                  </h3>
                  {isNext && <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wide">{t('prayer.upcoming')}</span>}
                </div>
              </div>
              <span className={`text-xl font-mono ${isNext ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`} dir="ltr">
                {time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
