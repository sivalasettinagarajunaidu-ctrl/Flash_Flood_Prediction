import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LanguageInfo,
  getLanguageForState,
  TRANSLATIONS,
  Translations,
} from '../i18n/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage, isManual?: boolean) => void;
  isAutoState: boolean;
  setIsAutoState: (val: boolean) => void;
  activeStateName: string;
  detectedStateLanguage: SupportedLanguage;
  updateActiveRegionState: (stateName: string) => void;
  t: (key: keyof Translations) => string;
  supportedLanguages: LanguageInfo[];
  notificationMessage: string | null;
  clearNotification: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'flashflood_app_lang';
const AUTO_STATE_KEY = 'flashflood_app_lang_auto';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'ta' || saved === 'te')) {
      return saved;
    }
    return 'en';
  });

  const [isAutoState, setIsAutoStateState] = useState<boolean>(() => {
    const savedAuto = localStorage.getItem(AUTO_STATE_KEY);
    // Default to true so language automatically matches state!
    return savedAuto !== null ? savedAuto === 'true' : true;
  });

  const [activeStateName, setActiveStateName] = useState<string>('Uttarakhand');
  const [detectedStateLanguage, setDetectedStateLanguage] = useState<SupportedLanguage>('hi');
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const clearNotification = useCallback(() => {
    setNotificationMessage(null);
  }, []);

  // Update language manually
  const setLanguage = useCallback((newLang: SupportedLanguage, isManual: boolean = true) => {
    setLanguageState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    if (isManual) {
      setIsAutoStateState(false);
      localStorage.setItem(AUTO_STATE_KEY, 'false');
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === newLang);
      setNotificationMessage(`Switched language to ${langObj?.nativeName || newLang}`);
      setTimeout(() => {
        setNotificationMessage((prev) => (prev ? null : prev));
      }, 4000);
    }
  }, []);

  const setIsAutoState = useCallback((val: boolean) => {
    setIsAutoStateState(val);
    localStorage.setItem(AUTO_STATE_KEY, String(val));
    if (val && activeStateName) {
      const detected = getLanguageForState(activeStateName);
      setLanguageState(detected);
      localStorage.setItem(STORAGE_KEY, detected);
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === detected);
      setNotificationMessage(
        `State Auto-Detection enabled: ${activeStateName} → ${langObj?.nativeName} (${langObj?.name})`
      );
      setTimeout(() => {
        setNotificationMessage((prev) => (prev ? null : prev));
      }, 4500);
    }
  }, [activeStateName]);

  // When active region or place changes state
  const updateActiveRegionState = useCallback(
    (stateName: string) => {
      if (!stateName) return;
      setActiveStateName(stateName);
      const detected = getLanguageForState(stateName);
      setDetectedStateLanguage(detected);

      // If auto state tracking is on, adjust language according to the state
      if (isAutoState) {
        setLanguageState(detected);
        localStorage.setItem(STORAGE_KEY, detected);
        const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === detected);
        setNotificationMessage(
          `Language adapted for ${stateName}: ${langObj?.nativeName} (${langObj?.name})`
        );
        setTimeout(() => {
          setNotificationMessage((prev) => (prev ? null : prev));
        }, 4500);
      }
    },
    [isAutoState]
  );

  const t = useCallback(
    (key: keyof Translations): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isAutoState,
        setIsAutoState,
        activeStateName,
        detectedStateLanguage,
        updateActiveRegionState,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        notificationMessage,
        clearNotification,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
