"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Словарь интерфейса
const TRANSLATIONS = {
  ru: {
    title: "Конструктор документов",
    subtitle: "База из 100+ сценариев на основе ГК и ГПК РК",
    toProfile: "В профиль",
    searchPh: "Поиск по названию, категории или проблеме...",
    startBtn: "Начать заполнение",
    empty: "Ничего не найдено. Попробуйте другой запрос.",
    reset: "Сбросить поиск"
  },
  kk: {
    title: "Құжаттар конструкторы",
    subtitle: "ҚР ГК мен АІЖК негізіндегі 100+ сценарийлер базасы",
    toProfile: "Профильге",
    searchPh: "Атауы, санаты немесе мәселе бойынша іздеу...",
    startBtn: "Толтыруды бастау",
    empty: "Ештеңе табылмады. Басқа сұранысты байқап көріңіз.",
    reset: "Іздеуді тастау"
  },
  en: {
    title: "Document Builder",
    subtitle: "Database of 100+ scenarios based on CC and CPC of RK",
    toProfile: "To Profile",
    searchPh: "Search by title, category, or issue...",
    startBtn: "Start filling",
    empty: "Nothing found. Try another search query.",
    reset: "Reset search"
  }
};

// База шаблонов с переводами
const TEMPLATES = [
  {
    id: 1,
    icon: "💍",
    title: { ru: "Исковое заявление о расторжении брака", kk: "Некені бұзу туралы талап арыз", en: "Lawsuit for Divorce" },
    category: { ru: "Семейное право", kk: "Отбасылық құқық", en: "Family Law" },
    description: { 
      ru: "Расторжение брака через суд (при наличии детей или отсутствии согласия).", 
      kk: "Сот арқылы некені бұзу (балалар болған кезде немесе келісім болмаған жағдайда).", 
      en: "Divorce through the court (in the presence of children or lack of consent)." 
    },
    prompt: {
      ru: "Помоги составить иск о расторжении брака по законам РК. Спроси: данные супругов, дату брака, есть ли дети и спор об имуществе.",
      kk: "ҚР заңдары бойынша некені бұзу туралы талап арыз дайындауға көмектес. Сұрақтар қой: ерлі-зайыптылардың деректері, неке қиылған күн, балалар бар ма және мүлік туралы дау бар ма.",
      en: "Help me draft a divorce lawsuit under RK laws. Ask for: spouses' details, marriage date, children, and property disputes."
    }
  },
  {
    id: 2,
    icon: "👶",
    title: { ru: "Взыскание алиментов (судебный приказ)", kk: "Алимент өндіріп алу (сот бұйрығы)", en: "Child Support Claim" },
    category: { ru: "Семейное право", kk: "Отбасылық құқық", en: "Family Law" },
    description: { 
      ru: "Упрощенный порядок взыскания доли от дохода на содержание детей.", 
      kk: "Балаларды асырауға табыстың бір бөлігін өндіріп алудың оңайлатылған тәртібі.", 
      en: "Simplified procedure for collecting child support as a share of income." 
    },
    prompt: {
      ru: "Составь заявление на вынесение судебного приказа о взыскании алиментов. Спроси: данные родителей, детей и место работы должника.",
      kk: "Алимент өндіріп алу туралы сот бұйрығын шығаруға өтініш дайында. Сұра: ата-ананың, балалардың деректері және борышкердің жұмыс орны.",
      en: "Draft an application for a court order to collect alimony. Ask for: parents' and children's details, and debtor's workplace."
    }
  },
  {
    id: 6,
    icon: "💰",
    title: { ru: "Взыскание долга по расписке", kk: "Қолхат бойынша борышты өндіру", en: "Debt Collection by Receipt" },
    category: { ru: "Гражданское право", kk: "Азаматтық құқық", en: "Civil Law" },
    description: { 
      ru: "Требование возврата денег, переданных в долг физлицу.", 
      kk: "Жеке тұлғаға қарызға берілген ақшаны қайтаруды талап ету.", 
      en: "Demand for the return of money lent to an individual." 
    },
    prompt: {
      ru: "Составь иск о взыскании суммы долга по расписке. Спроси: сумму, дату займа, срок возврата и ФИО должника.",
      kk: "Қолхат бойынша қарыз сомасын өндіріп алу туралы талап арыз дайында. Сұра: сомасы, қарыз берілген күн, қайтару мерзімі және борышкердің аты-жөні.",
      en: "Draft a lawsuit to collect a debt amount based on a receipt. Ask for: amount, loan date, repayment period, and debtor's full name."
    }
  },
  {
    id: 11,
    icon: "💧",
    title: { ru: "Взыскание ущерба при заливе квартиры", kk: "Пәтерді су басқандағы залалды өндіру", en: "Damage Collection for Flooding" },
    category: { ru: "Недвижимость", kk: "Жылжымайтын мүлік", en: "Real Estate" },
    description: { 
      ru: "Требование компенсации за ремонт после затопления соседями сверху.", 
      kk: "Үстіңгі қабаттағы көршілер су жібергеннен кейін жөндеу жұмыстарына өтемақы талап ету.", 
      en: "Demand for compensation for repairs after flooding by neighbors from above." 
    },
    prompt: {
      ru: "Помоги составить иск к соседям за залив квартиры. Спроси: дату, наличие акта от КСК/ОСИ и сумму оценки ущерба.",
      kk: "Пәтерді су басқаны үшін көршілерге қарсы талап арыз дайындауға көмектес. Сұра: күні, ПИК/МСБ актісінің болуы және залалды бағалау сомасы.",
      en: "Help me draft a lawsuit against neighbors for flooding the flat. Ask for: date, act from the service provider (OSI/KSK), and damage assessment amount."
    }
  }
  // Остальные шаблоны добавляются по такому же принципу...
];

export default function TemplatesPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const [searchTerm, setSearchTerm] = useState("");

  const t = TRANSLATIONS[lang];

  const filteredTemplates = TEMPLATES.filter(template => 
    template.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) || 
    template.category[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description[lang].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseTemplate = (prompt: string) => {
    router.push(`/?template_prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 flex gap-2 z-20">
        {['ru', 'kk', 'en'].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l as any)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${lang === l ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20' : 'bg-[#0c1527] border-blue-500/20 text-gray-400'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-purple-500">📄</span> {t.title}
            </h1>
            <p className="text-gray-400 mt-2">{t.subtitle}</p>
          </div>
          <button 
            onClick={() => router.push('/profile')} 
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all font-bold"
          >
            {t.toProfile}
          </button>
        </div>

        <div className="mb-8 relative">
          <input 
            type="text" 
            placeholder={t.searchPh} 
            className="w-full bg-[#0c1527] border border-blue-500/20 rounded-2xl p-4 pl-12 text-white outline-none focus:border-purple-500 transition-all shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-6 h-6 text-gray-500 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-[#0f192e] border border-blue-500/10 p-6 rounded-3xl hover:border-purple-500/40 hover:bg-[#131e36] transition-all flex flex-col h-full group shadow-md hover:shadow-purple-500/10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-900/30 rounded-2xl flex items-center justify-center text-2xl border border-purple-500/20 group-hover:scale-110 transition-transform">
                  {template.icon}
                </div>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-900/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  {template.category[lang]}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors">{template.title[lang]}</h3>
              <p className="text-gray-400 text-xs mb-6 flex-grow leading-relaxed">{template.description[lang]}</p>
              
              <button 
                onClick={() => handleUseTemplate(template.prompt[lang])}
                className="w-full bg-blue-600/10 border border-blue-500/30 text-blue-400 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold flex items-center justify-center gap-2 active:scale-95"
              >
                {t.startBtn}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-20">
               <p className="text-gray-500 text-xl italic">{t.empty}</p>
               <button onClick={() => setSearchTerm("")} className="mt-4 text-blue-400 underline font-bold uppercase text-xs tracking-widest">
                {t.reset}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}