import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PrayerDashboard } from './components/PrayerDashboard';
import { QuranReader } from './components/QuranReader';
import { Settings } from './components/Settings';
import { fetchPrayerTimes } from './services/api';
import { AppSettings, PrayerResponseData, UserLocation } from './types';
import { DEFAULT_LOCATION } from './constants';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'prayer' | 'quran' | 'settings'>('prayer');

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      calculationMethod: 2, // ISNA
      asrMethod: 0, // Standard
      theme: 'light',
      notificationsEnabled: true
    };
  });

  // Location State
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationName, setLocationName] = useState<string>('Detecting Location...');

  // Data State
  const [prayerData, setPrayerData] = useState<PrayerResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Theme Management
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  // Initial Location & Data Load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      let lat = DEFAULT_LOCATION.latitude;
      let lng = DEFAULT_LOCATION.longitude;
      let locName = DEFAULT_LOCATION.city;

      // Try Geolocation
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
          });
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          locName = 'Current Location';
        } catch (e) {
          console.warn('Geolocation denied or failed, using default.');
          setError('Location access denied. Using default (Makkah).');
        }
      }

      setLocation({ latitude: lat, longitude: lng });
      setLocationName(locName || 'Unknown');

      // Fetch Prayer Times
      const data = await fetchPrayerTimes(lat, lng, settings.calculationMethod, settings.asrMethod);
      
      if (data && data.data) {
        setPrayerData(data.data);
      } else {
        setError('Failed to load prayer times. Please check your connection.');
      }
      setLoading(false);
    };

    loadData();
  }, [settings.calculationMethod, settings.asrMethod]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      isDark={settings.theme === 'dark'}
      toggleTheme={toggleTheme}
    >
      {activeTab === 'prayer' && (
        <PrayerDashboard 
          data={prayerData} 
          loading={loading} 
          error={error}
          locationName={locationName}
        />
      )}
      {activeTab === 'quran' && (
        <QuranReader />
      )}
      {activeTab === 'settings' && (
        <Settings 
          settings={settings}
          updateSettings={updateSettings}
          isDark={settings.theme === 'dark'}
          toggleTheme={toggleTheme}
        />
      )}
    </Layout>
  );
};

export default App;
