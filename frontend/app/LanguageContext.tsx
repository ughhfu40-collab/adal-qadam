"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'ru' | 'kk' | 'en';

interface LanguageContextType {
  lang: Lang;
  cycleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ru',
  cycleLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('ru');

  useEffect(() => {
    // При загрузке сайта достаем язык из памяти браузера
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang && ['ru', 'kk', 'en'].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const cycleLanguage = () => {
    setLang((prev) => {
      const nextLang = prev === 'ru' ? 'kk' : prev === 'kk' ? 'en' : 'ru';
      localStorage.setItem('app_lang', nextLang); // Сохраняем новый выбор
      return nextLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, cycleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);