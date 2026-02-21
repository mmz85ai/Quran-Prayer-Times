import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Book, Search, PlayCircle } from 'lucide-react';
import { fetchSurahList, fetchSurahDetails } from '../services/api';
import { Surah, SurahDetail, SurahDetailResponse } from '../types';

interface QuranReaderProps {
  // empty for now, manages its own state
}

export const QuranReader: React.FC<QuranReaderProps> = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'reader'>('list');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Reader State
  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const [surahContent, setSurahContent] = useState<{ arabic: SurahDetail; translation: SurahDetail } | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    loadSurahs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredSurahs(surahs.filter(s =>
        s.englishName.toLowerCase().includes(lower) ||
        s.englishNameTranslation.toLowerCase().includes(lower) ||
        String(s.number).includes(lower)
      ));
    }
  }, [searchQuery, surahs]);

  const loadSurahs = async () => {
    setLoading(true);
    const res = await fetchSurahList();
    if (res && res.data) {
      setSurahs(res.data);
      setFilteredSurahs(res.data);
    }
    setLoading(false);
  };

  const openSurah = async (surah: Surah) => {
    setActiveSurah(surah);
    setView('reader');
    setLoadingContent(true);
    // Scroll to top
    window.scrollTo(0, 0);

    const details = await fetchSurahDetails(surah.number);
    if (details) {
      setSurahContent({
        arabic: details.arabic.data,
        translation: details.translation.data
      });
    }
    setLoadingContent(false);
  };

  const goBack = () => {
    setView('list');
    setSurahContent(null);
    setActiveSurah(null);
  };

  if (view === 'list') {
    return (
      <div className="p-4">
        <div className="mb-6 sticky top-0 bg-white dark:bg-slate-950 z-10 pb-4 pt-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={t('quran.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-3 pl-10 pr-4 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.number}
                onClick={() => openSurah(surah)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-full rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
                    <span className="relative font-bold text-emerald-700 dark:text-emerald-400 text-sm">{surah.number}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {surah.englishName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{surah.englishNameTranslation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-amiri text-xl text-slate-800 dark:text-slate-200">{surah.name}</span>
                  <p className="text-[10px] text-slate-400 mt-1">{t('quran.ayahs', { count: surah.numberOfAyahs })}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Reader View
  return (
    <div className="min-h-full bg-white dark:bg-slate-950">
      {/* Reader Header */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-4 z-20 flex items-center justify-between">
        <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900">
          <ArrowLeft size={24} className="text-slate-700 dark:text-slate-300" />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-slate-800 dark:text-white">{activeSurah?.englishName}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{activeSurah?.englishNameTranslation} • {activeSurah?.revelationType}</p>
        </div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Bismillah */}
      <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/50">
        <span className="font-amiri text-3xl text-slate-800 dark:text-slate-200">
          {t('quran.bismillah')}
        </span>
      </div>

      {loadingContent ? (
        <div className="p-8 space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-3/4 ml-auto"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 space-y-8 pb-12">
          {surahContent?.arabic.ayahs.map((ayah, index) => (
            <div key={ayah.number} className="scroll-mt-24 border-b border-slate-50 dark:border-slate-900 pb-8 last:border-0">
              {/* Toolbar/Number */}
              <div className="flex justify-between items-center mb-4 px-2">
                <span className="bg-slate-100 dark:bg-slate-900 text-slate-500 text-xs px-2 py-1 rounded-md font-mono" dir="ltr">
                  {activeSurah?.number}:{ayah.numberInSurah}
                </span>
                <div className="flex space-x-2">
                  <button className="text-slate-300 hover:text-emerald-600 transition-colors">
                    <PlayCircle size={18} />
                  </button>
                </div>
              </div>

              {/* Arabic */}
              <p className="font-amiri text-3xl leading-[2.5] text-slate-800 dark:text-slate-100 mb-6 px-2" dir="rtl">
                {ayah.text}
                <span className="mr-2 text-emerald-600 text-xl font-sans inline-block border border-emerald-600 rounded-full w-8 h-8 text-center leading-7">
                  {ayah.numberInSurah.toLocaleString('ar-EG')}
                </span>
              </p>

              {/* Translation */}
              <p className="text-left text-slate-600 dark:text-slate-400 leading-relaxed text-lg px-2 font-sans font-light" dir="ltr">
                {surahContent.translation.ayahs[index].text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
