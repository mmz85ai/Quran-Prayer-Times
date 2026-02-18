import React from 'react';
import { BookOpen, Clock, Settings, Heart, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'prayer' | 'quran' | 'adhkar' | 'settings';
  setActiveTab: (tab: 'prayer' | 'quran' | 'adhkar' | 'settings') => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme
}) => {
  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Top Bar - Simplified for Web App */}
      <header className="flex-none bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-amiri text-xl pb-1">☪</span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Quran & Prayer</h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md mx-auto min-h-full pb-20 shadow-xl dark:shadow-none dark:bg-slate-950 bg-white border-x border-slate-100 dark:border-slate-900">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-none bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-2 pb-safe z-20">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={() => setActiveTab('prayer')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${activeTab === 'prayer'
              ? 'text-emerald-600 dark:text-emerald-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
          >
            <Clock size={24} strokeWidth={activeTab === 'prayer' ? 2.5 : 2} />
            <span className="text-xs font-medium">Prayer</span>
          </button>

          <button
            onClick={() => setActiveTab('quran')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${activeTab === 'quran'
              ? 'text-emerald-600 dark:text-emerald-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
          >
            <BookOpen size={24} strokeWidth={activeTab === 'quran' ? 2.5 : 2} />
            <span className="text-xs font-medium">Quran</span>
          </button>

          <button
            onClick={() => setActiveTab('adhkar')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${activeTab === 'adhkar'
              ? 'text-emerald-600 dark:text-emerald-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
          >
            <Heart size={24} strokeWidth={activeTab === 'adhkar' ? 2.5 : 2} />
            <span className="text-xs font-medium">Adhkar</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${activeTab === 'settings'
              ? 'text-emerald-600 dark:text-emerald-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
          >
            <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
