import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { LanguageCode } from '../../types/learning';

export const LANGUAGE_STORAGE_KEY = 'vocabai-language-store';

interface LanguageStore {
  selectedLanguage: LanguageCode | null;
  isHydrated: boolean;
  hydrateSelectedLanguage: () => Promise<void>;
  setSelectedLanguage: (languageCode: LanguageCode) => Promise<void>;
  clearSelectedLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  selectedLanguage: null,
  isHydrated: false,
  hydrateSelectedLanguage: async () => {
    try {
      const storedValue = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      const parsedValue = storedValue ? (JSON.parse(storedValue) as LanguageCode | null) : null;
      set({ selectedLanguage: parsedValue, isHydrated: true });
    } catch (error) {
      console.warn('Failed to hydrate selected language:', error);
      set({ selectedLanguage: null, isHydrated: true });
    }
  },
  setSelectedLanguage: async (languageCode) => {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(languageCode));
    set({ selectedLanguage: languageCode });
  },
  clearSelectedLanguage: async () => {
    await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
    set({ selectedLanguage: null });
  },
}));
