import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Sun, Moon, RotateCcw, Check, BookOpen } from 'lucide-react';
import { MORNING_ADHKAR, EVENING_ADHKAR, Dhikr, AdhkarCategory } from '../data/adhkarData';

interface AdhkarProgress {
    [dhikrId: string]: number; // remaining count
}

interface SavedProgress {
    date: string;
    morning: AdhkarProgress;
    evening: AdhkarProgress;
}

const getTodayKey = () => new Date().toISOString().split('T')[0];

const loadProgress = (): SavedProgress => {
    try {
        const saved = localStorage.getItem('adhkarProgress');
        if (saved) {
            const parsed: SavedProgress = JSON.parse(saved);
            if (parsed.date === getTodayKey()) {
                return parsed;
            }
        }
    } catch { }
    // Fresh day or no data
    return { date: getTodayKey(), morning: {}, evening: {} };
};

const saveProgress = (progress: SavedProgress) => {
    localStorage.setItem('adhkarProgress', JSON.stringify(progress));
};

export const Adhkar: React.FC = () => {
    const [view, setView] = useState<'picker' | 'list'>('picker');
    const [category, setCategory] = useState<AdhkarCategory>('morning');
    const [progress, setProgress] = useState<SavedProgress>(loadProgress);

    // Determine smart default based on time of day
    const isMorningTime = new Date().getHours() < 15;

    useEffect(() => {
        saveProgress(progress);
    }, [progress]);

    const getAdhkarList = useCallback((): Dhikr[] => {
        return category === 'morning' ? MORNING_ADHKAR : EVENING_ADHKAR;
    }, [category]);

    const getRemaining = useCallback((dhikr: Dhikr): number => {
        const catProgress = progress[category];
        if (catProgress[dhikr.id] !== undefined) {
            return catProgress[dhikr.id];
        }
        return dhikr.repeatCount;
    }, [progress, category]);

    const handleTap = useCallback((dhikr: Dhikr) => {
        setProgress(prev => {
            const catProgress = { ...prev[category] };
            const current = catProgress[dhikr.id] !== undefined ? catProgress[dhikr.id] : dhikr.repeatCount;
            if (current > 0) {
                catProgress[dhikr.id] = current - 1;
            }
            return { ...prev, [category]: catProgress };
        });
    }, [category]);

    const resetCategory = useCallback(() => {
        setProgress(prev => ({
            ...prev,
            [category]: {},
        }));
    }, [category]);

    const openCategory = (cat: AdhkarCategory) => {
        setCategory(cat);
        setView('list');
    };

    const goBack = () => {
        setView('picker');
    };

    // Calculate overall progress
    const getCompletionStats = useCallback(() => {
        const list = getAdhkarList();
        let completed = 0;
        for (const dhikr of list) {
            if (getRemaining(dhikr) === 0) completed++;
        }
        return { completed, total: list.length, percentage: Math.round((completed / list.length) * 100) };
    }, [getAdhkarList, getRemaining]);

    const getMorningStats = useCallback(() => {
        let completed = 0;
        for (const dhikr of MORNING_ADHKAR) {
            const remaining = progress.morning[dhikr.id] !== undefined ? progress.morning[dhikr.id] : dhikr.repeatCount;
            if (remaining === 0) completed++;
        }
        return { completed, total: MORNING_ADHKAR.length, percentage: Math.round((completed / MORNING_ADHKAR.length) * 100) };
    }, [progress.morning]);

    const getEveningStats = useCallback(() => {
        let completed = 0;
        for (const dhikr of EVENING_ADHKAR) {
            const remaining = progress.evening[dhikr.id] !== undefined ? progress.evening[dhikr.id] : dhikr.repeatCount;
            if (remaining === 0) completed++;
        }
        return { completed, total: EVENING_ADHKAR.length, percentage: Math.round((completed / EVENING_ADHKAR.length) * 100) };
    }, [progress.evening]);

    // ─── Category Picker View ───
    if (view === 'picker') {
        const morningStats = getMorningStats();
        const eveningStats = getEveningStats();

        return (
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2 pt-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-2">
                        <BookOpen className="text-emerald-600 dark:text-emerald-400" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Daily Adhkar</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Morning & Evening Supplications
                    </p>
                </div>

                {/* Morning Card */}
                <button
                    onClick={() => openCategory('morning')}
                    className="w-full group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 opacity-90"></div>
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/15 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Sun className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Morning</h3>
                                    <p className="text-white/70 text-sm font-amiri text-lg">أذكار الصباح</p>
                                </div>
                            </div>
                            {isMorningTime && (
                                <span className="bg-white/25 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    Recommended
                                </span>
                            )}
                        </div>

                        {/* Progress */}
                        <div className="mt-4">
                            <div className="flex justify-between text-white/80 text-xs mb-2">
                                <span>{morningStats.completed} of {morningStats.total} completed</span>
                                <span>{morningStats.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white/80 rounded-full transition-all duration-500"
                                    style={{ width: `${morningStats.percentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </button>

                {/* Evening Card */}
                <button
                    onClick={() => openCategory('evening')}
                    className="w-full group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 opacity-90"></div>
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Moon className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Evening</h3>
                                    <p className="text-white/70 text-sm font-amiri text-lg">أذكار المساء</p>
                                </div>
                            </div>
                            {!isMorningTime && (
                                <span className="bg-white/25 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    Recommended
                                </span>
                            )}
                        </div>

                        {/* Progress */}
                        <div className="mt-4">
                            <div className="flex justify-between text-white/80 text-xs mb-2">
                                <span>{eveningStats.completed} of {eveningStats.total} completed</span>
                                <span>{eveningStats.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white/80 rounded-full transition-all duration-500"
                                    style={{ width: `${eveningStats.percentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </button>

                {/* Info */}
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
                    Progress resets daily. Tap each supplication to count.
                </p>
            </div>
        );
    }

    // ─── Supplication List View ───
    const adhkarList = getAdhkarList();
    const stats = getCompletionStats();
    const isMorning = category === 'morning';

    return (
        <div className="min-h-full bg-white dark:bg-slate-950">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-4">
                    <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                        <ArrowLeft size={24} className="text-slate-700 dark:text-slate-300" />
                    </button>
                    <div className="text-center">
                        <h2 className="font-bold text-slate-800 dark:text-white">
                            {isMorning ? 'Morning Adhkar' : 'Evening Adhkar'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-amiri">
                            {isMorning ? 'أذكار الصباح' : 'أذكار المساء'}
                        </p>
                    </div>
                    <button
                        onClick={resetCategory}
                        className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-500 dark:text-slate-400"
                        title="Reset progress"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-4 pb-3">
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>{stats.completed} of {stats.total} completed</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${stats.percentage === 100
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                    : isMorning
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                }`}
                            style={{ width: `${stats.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Completion Banner */}
            {stats.percentage === 100 && (
                <div className="mx-4 mt-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-full mb-2">
                        <Check className="text-emerald-600 dark:text-emerald-400" size={24} />
                    </div>
                    <p className="text-emerald-800 dark:text-emerald-300 font-semibold">
                        Masha'Allah! All completed ✨
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-1">
                        May Allah accept your supplications
                    </p>
                </div>
            )}

            {/* Supplication Cards */}
            <div className="p-4 space-y-4 pb-8">
                {adhkarList.map((dhikr, index) => {
                    const remaining = getRemaining(dhikr);
                    const isComplete = remaining === 0;
                    const originalCount = dhikr.repeatCount;

                    return (
                        <div
                            key={dhikr.id}
                            className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${isComplete
                                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50 opacity-70'
                                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            {/* Card Content */}
                            <div className="p-5 space-y-4">
                                {/* Index & Reference */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${isComplete
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        }`}>
                                        {index + 1}/{adhkarList.length}
                                    </span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                                        {dhikr.reference}
                                    </span>
                                </div>

                                {/* Arabic Text */}
                                <p className="text-right font-amiri text-2xl leading-[2.2] text-slate-800 dark:text-slate-100" dir="rtl">
                                    {dhikr.arabic}
                                </p>

                                {/* Translation */}
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-light">
                                    {dhikr.translation}
                                </p>

                                {/* Counter Section */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                                    {/* Small progress for this dhikr */}
                                    {originalCount > 1 && (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-emerald-500' : isMorning ? 'bg-amber-500' : 'bg-indigo-500'
                                                        }`}
                                                    style={{ width: `${((originalCount - remaining) / originalCount) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                {originalCount - remaining}/{originalCount}
                                            </span>
                                        </div>
                                    )}
                                    {originalCount === 1 && <div />}

                                    {/* Tap Button */}
                                    <button
                                        onClick={() => handleTap(dhikr)}
                                        disabled={isComplete}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${isComplete
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 cursor-default'
                                                : isMorning
                                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                                                    : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                                            }`}
                                    >
                                        {isComplete ? (
                                            <>
                                                <Check size={16} />
                                                <span>Done</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-lg font-bold">{remaining}</span>
                                                <span>×</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
