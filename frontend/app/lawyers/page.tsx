"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Словарь интерфейса
const TRANSLATIONS = {
  ru: {
    title: "Каталог адвокатов",
    subtitle: "Найдите проверенного специалиста для вашего дела",
    back: "Вернуться в чат",
    searchPh: "Поиск по имени или специализации...",
    experience: "Опыт работы",
    success: "Успешные дела",
    priceFrom: "от",
    contact: "Связаться",
    notFound: "По вашему запросу адвокаты не найдены."
  },
  kk: {
    title: "Адвокаттар каталогы",
    subtitle: "Ісіңіз үшін тексерілген маманды табыңыз",
    back: "Чатқа оралу",
    searchPh: "Есімі немесе мамандандыруы бойынша іздеу...",
    experience: "Жұмыс тәжірибесі",
    success: "Сәтті істер",
    priceFrom: "бастап",
    contact: "Байланысу",
    notFound: "Сіздің сұранысыңыз бойынша адвокаттар табылмады."
  },
  en: {
    title: "Lawyers Catalog",
    subtitle: "Find a verified specialist for your case",
    back: "Back to Chat",
    searchPh: "Search by name or specialization...",
    experience: "Experience",
    success: "Success rate",
    priceFrom: "from",
    contact: "Contact",
    notFound: "No lawyers found for your request."
  }
};

// База адвокатов с переводами
const LAWYERS = [
  {
    id: 1,
    name: { ru: "Аскар Болатов", kk: "Асқар Болатов", en: "Askar Bolatov" },
    spec: { ru: "Семейное право", kk: "Отбасылық құқық", en: "Family Law" },
    exp: { ru: "12 лет", kk: "12 жыл", en: "12 years" },
    winRate: "89%",
    rating: 4.9,
    price: "15 000 ₸",
    initials: "АБ"
  },
  {
    id: 2,
    name: { ru: "Динара Сатпаева", kk: "Динара Сәтпаева", en: "Dinara Satpayeva" },
    spec: { ru: "Гражданские споры", kk: "Азаматтық даулар", en: "Civil Disputes" },
    exp: { ru: "8 лет", kk: "8 жыл", en: "8 years" },
    winRate: "92%",
    rating: 5.0,
    price: "20 000 ₸",
    initials: "ДС"
  },
  {
    id: 3,
    name: { ru: "Тимур Оспанов", kk: "Тимур Оспанов", en: "Timur Ospanov" },
    spec: { ru: "Бизнес и налоги", kk: "Бизнес және салықтар", en: "Business & Taxes" },
    exp: { ru: "15 лет", kk: "15 жыл", en: "15 years" },
    winRate: "85%",
    rating: 4.8,
    price: "50 000 ₸",
    initials: "ТО"
  },
  {
    id: 4,
    name: { ru: "Елена Смирнова", kk: "Елена Смирнова", en: "Yelena Smirnova" },
    spec: { ru: "Трудовые споры", kk: "Еңбек даулары", en: "Labor Disputes" },
    exp: { ru: "6 лет", kk: "6 жыл", en: "6 years" },
    winRate: "95%",
    rating: 4.7,
    price: "10 000 ₸",
    initials: "ЕС"
  }
];

export default function LawyersPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const [searchTerm, setSearchTerm] = useState("");

  const t = TRANSLATIONS[lang];

  // Фильтрация с учетом текущего языка
  const filteredLawyers = LAWYERS.filter(lawyer => 
    lawyer.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) || 
    lawyer.spec[lang].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Переключатель языков */}
        <div className="flex justify-end gap-2 mb-4">
          {['ru', 'kk', 'en'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as any)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${lang === l ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0c1527] border-blue-500/20 text-gray-400'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Шапка */}
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-blue-500">⚖️</span> {t.title}
            </h1>
            <p className="text-gray-400 mt-2">{t.subtitle}</p>
          </div>
          <button 
            onClick={() => router.push('/')} 
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all font-medium"
          >
            {t.back}
          </button>
        </div>

        {/* Поиск */}
        <div className="mb-8 relative">
          <input 
            type="text" 
            placeholder={t.searchPh} 
            className="w-full bg-[#0c1527] border border-blue-500/20 rounded-2xl p-4 pl-12 text-white outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-6 h-6 text-gray-500 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-[#0f192e] border border-blue-500/10 p-6 rounded-3xl hover:border-blue-500/40 transition-all flex flex-col md:flex-row gap-6 items-center md:items-start group">
              <div className="w-20 h-20 shrink-0 bg-blue-900/50 rounded-full flex items-center justify-center text-2xl font-bold text-blue-300 border border-blue-500/20 group-hover:scale-105 transition-transform">
                {lawyer.initials}
              </div>
              
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex justify-between items-start mb-2 flex-col md:flex-row">
                  <h3 className="text-xl font-bold text-white">{lawyer.name[lang]}</h3>
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg text-sm font-bold mt-2 md:mt-0">
                    ⭐ {lawyer.rating}
                  </div>
                </div>
                
                <p className="text-blue-400 text-sm mb-4 font-medium">{lawyer.spec[lang]}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-6 bg-[#0c1527] p-4 rounded-xl">
                  <div>
                    <span className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">{t.experience}</span>
                    <strong className="text-white">{lawyer.exp[lang]}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">{t.success}</span>
                    <strong className="text-green-400">{lawyer.winRate}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gray-300 font-bold">{t.priceFrom} {lawyer.price}</span>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-500 transition-all text-sm font-bold active:scale-95 shadow-lg shadow-blue-900/20">
                    {t.contact}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLawyers.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500 italic">
              {t.notFound}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}