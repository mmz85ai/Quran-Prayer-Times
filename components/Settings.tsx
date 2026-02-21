import React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Bell, Globe, Calculator, Info, Languages } from 'lucide-react';
import { CALCULATION_METHODS } from '../constants';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, isDark, toggleTheme }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{t('settings.title')}</h2>

      {/* Language */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('settings.language')}</h3>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg text-teal-600 dark:text-teal-400">
                <Languages size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800 dark:text-white">{t('settings.language')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('settings.languageDesc')}</p>
              </div>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-950 rounded-lg p-1">
              <button
                onClick={() => changeLanguage('en')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${i18n.language === 'en' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600' : 'text-slate-500'}`}
              >
                {t('settings.english')}
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${i18n.language === 'ar' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600' : 'text-slate-500'}`}
              >
                {t('settings.arabic')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('settings.appearance')}</h3>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                <Moon size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800 dark:text-white">{t('settings.darkMode')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('settings.darkModeDesc')}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-emerald-500' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isDark ? 'left-7' : 'left-1'}`}></div>
            </div>
          </button>
        </div>
      </section>

      {/* Prayer Settings */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('settings.prayerCalculation')}</h3>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">

          {/* Method Selector */}
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                <Calculator size={20} />
              </div>
              <span className="font-medium text-slate-800 dark:text-white">{t('settings.calculationMethod')}</span>
            </div>
            <select
              value={settings.calculationMethod}
              onChange={(e) => updateSettings({ calculationMethod: Number(e.target.value) })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {CALCULATION_METHODS.map(method => (
                <option key={method.id} value={method.id}>
                  {t(`settings.calcMethods.${method.id}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Asr Juristic Method */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                <Globe size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800 dark:text-white">{t('settings.asrMethod')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('settings.asrMethodDesc')}</p>
              </div>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-950 rounded-lg p-1">
              <button
                onClick={() => updateSettings({ asrMethod: 0 })}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${settings.asrMethod === 0 ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600' : 'text-slate-500'}`}
              >
                {t('settings.standard')}
              </button>
              <button
                onClick={() => updateSettings({ asrMethod: 1 })}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${settings.asrMethod === 1 ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600' : 'text-slate-500'}`}
              >
                {t('settings.hanafi')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('settings.notifications')}</h3>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <button
            onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                <Bell size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800 dark:text-white">{t('settings.prayerAlerts')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('settings.prayerAlertsDesc')}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${settings.notificationsEnabled ? 'left-7' : 'left-1'}`}></div>
            </div>
          </button>
        </div>
        <p className="text-xs text-slate-400 px-2 text-center">
          {t('settings.webNotice')}
        </p>
      </section>

      {/* About */}
      <div className="pt-8 flex flex-col items-center justify-center text-slate-400 space-y-2">
        <Info size={24} className="mb-2 opacity-50" />
        <p className="text-sm font-medium">{t('settings.about')}</p>
        <p className="text-xs text-center max-w-xs">
          {t('settings.aboutDesc')}
        </p>
      </div>
    </div>
  );
};