"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Типы
export type Lang = 'ru' | 'kk' | 'en';

export interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

// Создаем контекст (сразу даем понять TS, что тут может быть undefined)
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru');

  // Читаем из памяти только на клиенте
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_lang') as Lang;
      if (saved && ['ru', 'kk', 'en'].includes(saved)) {
        setLang(saved);
      }
    }
  }, []);

  // Создаем объект значения
  const contextValue: LanguageContextType = useMemo(() => ({
    lang,
    setLang: (nextLang: Lang) => {
      setLang(nextLang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_lang', nextLang);
      }
    }
  }), [lang]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Хук для использования
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Если вызвали вне провайдера, возвращаем дефолт, чтобы приложение не упало
    return { 
      lang: 'ru' as Lang, 
      setLang: (l: Lang) => console.warn("LanguageProvider missing") 
    };
  }
  return context;
}