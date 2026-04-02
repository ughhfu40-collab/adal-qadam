"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../LanguageContext';

const uiTranslations = {
  ru: {
    title: "Каталог адвокатов",
    subtitle: "Проверенные специалисты из Республиканской коллегии адвокатов",
    toProfile: "В профиль",
    searchPlaceholder: "Поиск по ФИО или специализации (например, уголовные дела, ДТП)...",
    experience: "Опыт:",
    phone: "Телефон:",
    consultBtn: "Позвонить",
    notFound: "Адвокаты по вашему запросу не найдены.",
    years: "лет"
  },
  kk: {
    title: "Адвокаттар каталогы",
    subtitle: "Республикалық адвокаттар алқасының тексерілген мамандары",
    toProfile: "Профильге",
    searchPlaceholder: "Аты-жөні немесе мамандануы бойынша іздеу (мысалы, қылмыстық істер, жол апаты)...",
    experience: "Тәжірибесі:",
    phone: "Телефон:",
    consultBtn: "Қоңырау шалу",
    notFound: "Сұрауыңыз бойынша адвокаттар табылмады.",
    years: "жыл"
  },
  en: {
    title: "Lawyers Directory",
    subtitle: "Verified specialists from the Republican Bar Association",
    toProfile: "To Profile",
    searchPlaceholder: "Search by name or specialization (e.g., criminal cases, accident)...",
    experience: "Experience:",
    phone: "Phone:",
    consultBtn: "Call",
    notFound: "No lawyers found for your query.",
    years: "years"
  }
};

// Реалистичные мок-данные для MVP (12 специалистов)
const lawyersList = [
  { id: 1, name: "Оспанов Данияр", spec: "Уголовное право, Экономические преступления", exp: 15, phone: "+7 (701) 123-45-67", desc: "Бывший следователь по особо важным делам. Специализируется на защите бизнеса от проверок и сложных уголовных процессах.", img: "Daniyar" },
  { id: 2, name: "Смирнова Елена", spec: "Семейное право, Раздел имущества", exp: 12, phone: "+7 (777) 987-65-43", desc: "Более 500 успешных бракоразводных процессов. Помогает с взысканием алиментов и определением места жительства детей.", img: "Elena" },
  { id: 3, name: "Болатов Аскар", spec: "ДТП, Страховые споры", exp: 8, phone: "+7 (705) 111-22-33", desc: "Взыскание максимального ущерба с виновников ДТП и страховых компаний. Оспаривание штрафов Сергек.", img: "Askar" },
  { id: 4, name: "Нурланова Айгерим", spec: "Трудовые споры", exp: 10, phone: "+7 (702) 444-55-66", desc: "Защита прав работников при незаконном увольнении, невыплате зарплаты и производственных травмах.", img: "Aigerim" },
  { id: 5, name: "Иванов Михаил", spec: "Гражданское право, Долги", exp: 20, phone: "+7 (701) 333-77-88", desc: "Взыскание долгов по распискам, отмена судебных приказов, работа с ЧСИ и коллекторами.", img: "Mikhail" },
  { id: 6, name: "Калиев Тимур", spec: "Недвижимость и Земля", exp: 14, phone: "+7 (778) 555-99-00", desc: "Сопровождение сделок купли-продажи, узаконивание перепланировок, споры с застройщиками (ЖК).", img: "Timur" },
  { id: 7, name: "Алиева Динара", spec: "Медицинское право", exp: 9, phone: "+7 (707) 222-11-44", desc: "Привлечение к ответственности за врачебные ошибки, взыскание морального и материального вреда с клиник.", img: "Dinara" },
  { id: 8, name: "Пак Александр", spec: "IT и Авторское право", exp: 7, phone: "+7 (700) 888-44-22", desc: "Регистрация товарных знаков, патенты, составление договоров для IT-стартапов и защита кода.", img: "Alex" },
  { id: 9, name: "Сатпаев Ерлан", spec: "Налоговое право, Таможня", exp: 18, phone: "+7 (701) 666-33-11", desc: "Оспаривание налоговых уведомлений, разблокировка счетов, защита ТОО и ИП при аудите.", img: "Erlan" },
  { id: 10, name: "Жакупова Асель", spec: "Защита прав потребителей", exp: 6, phone: "+7 (705) 777-88-99", desc: "Возврат бракованных товаров, суды с авиакомпаниями и турфирмами, компенсации за некачественные услуги.", img: "Asel" },
  { id: 11, name: "Цой Вячеслав", spec: "Банкротство физических лиц", exp: 11, phone: "+7 (777) 123-88-55", desc: "Полное списание кредитов и долгов по новому закону РК. Сопровождение процедуры от А до Я.", img: "Slava" },
  { id: 12, name: "Ким Наталья", spec: "Наследственные дела", exp: 16, phone: "+7 (702) 999-00-11", desc: "Восстановление сроков принятия наследства, оспаривание завещаний, споры между наследниками.", img: "Natalya" }
];

export default function LawyersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { lang } = useLanguage(); 
  const t = uiTranslations[lang as keyof typeof uiTranslations] || uiTranslations.ru;

  const filteredLawyers = lawyersList.filter(lawyer =>
    lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.spec.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-blue-500">⚖️</span> {t.title}
            </h1>
            <p className="text-gray-400 mt-2">{t.subtitle}</p>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all font-bold uppercase text-sm tracking-wider"
          >
            {t.toProfile}
          </button>
        </div>

        <div className="mb-8 relative max-w-2xl">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#0c1527] border border-blue-500/20 rounded-2xl p-4 pl-12 text-white outline-none focus:border-blue-500 transition-all shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-6 h-6 text-gray-500 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-[#0f192e] border border-blue-500/10 rounded-3xl p-6 hover:border-blue-500/40 transition-all flex flex-col h-full shadow-lg group">
              <div className="flex items-center gap-4 mb-5">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${lawyer.img}&backgroundColor=1e3a8a&textColor=ffffff`} 
                  alt={lawyer.name} 
                  className="w-16 h-16 rounded-full border-2 border-blue-500/30 shadow-md group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{lawyer.name}</h3>
                  <span className="inline-block mt-1 text-[10px] font-bold text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded-md uppercase tracking-wide">
                    {t.experience} {lawyer.exp} {t.years}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-blue-400 mb-2">{lawyer.spec}</p>
                <p className="text-gray-400 text-xs leading-relaxed flex-grow">{lawyer.desc}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {lawyer.phone}
                </div>
                
                <a 
                  href={`tel:${lawyer.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                >
                  {t.consultBtn}
                </a>
              </div>
            </div>
          ))}

          {filteredLawyers.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-xl">{t.notFound}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}