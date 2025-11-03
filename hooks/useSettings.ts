import { useState, useEffect, useCallback } from 'react';
import { AppSettings, ApiProvider } from '../types';

const LOCAL_STORAGE_KEY = 'rag_settings_v2';

const defaultSettings: AppSettings = {
  apiProvider: 'gemini',
  apiKey: '',
  chunkSize: 800,
  chunkOverlap: 100,
  retrievalMode: 'tfidf',
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Merge with defaults to ensure all keys are present and handle legacy settings
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
      return updated;
    });
  }, []);

  return { settings, updateSettings };
};