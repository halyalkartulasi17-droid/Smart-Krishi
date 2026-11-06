import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { i18n } = useTranslation();
  const [user, setUser] = useState({
    name: 'Ramesh Gowda',
    mobile: '9876543210',
    village: 'Srinivaspur',
    district: 'Kolar',
    state: 'Karnataka',
    preferred_language: 'en',
    easy_mode: true
  });
  const [easyMode, setEasyMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Attempt fetching real profile from backend
    api.getProfile()
      .then(profile => {
        if (profile && profile.name) {
          setUser(profile);
          setEasyMode(profile.easy_mode ?? true);
          if (profile.preferred_language) {
            setLanguage(profile.preferred_language);
            i18n.changeLanguage(profile.preferred_language);
          }
        }
      })
      .catch(() => {});
  }, [i18n]);

  const changeAppLanguage = (langCode) => {
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
    if (user) {
      setUser(prev => ({ ...prev, preferred_language: langCode }));
    }
  };

  const toggleEasyMode = () => {
    setEasyMode(prev => !prev);
  };

  // Safe Text-To-Speech with browser capability detection
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Map speech voices
    const langVoiceMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN'
    };
    utterance.lang = langVoiceMap[language] || 'en-IN';
    utterance.rate = 0.92; // Slightly slower, highly clear for rural farmers

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        easyMode,
        toggleEasyMode,
        language,
        changeAppLanguage,
        notificationsCount,
        setNotificationsCount,
        speakText,
        stopSpeaking,
        isSpeaking
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

