"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Словарь интерфейса
const TRANSLATIONS = {
  ru: {
    title: "База знаний",
    subtitle: "Повышаем правовую грамотность: законы РК простым языком",
    profile: "В профиль",
    search: "Поиск (налоги, алименты, штрафы)...",
    tabs: { guides: "📚 Статьи", dict: "📖 Словарь" },
    readTime: "мин",
    full: "Развернуть полностью ↓",
    hide: "Свернуть",
    stats: "статей и терминов"
  },
  kk: {
    title: "Білім базасы",
    subtitle: "Құқықтық сауаттылықты арттыру: ҚР заңдары қарапайым тілде",
    profile: "Профильге",
    search: "Іздеу (салық, алимент, айыппұл)...",
    tabs: { guides: "📚 Мақалалар", dict: "📖 Сөздік" },
    readTime: "мин",
    full: "Толығырақ оқу ↓",
    hide: "Жасыру",
    stats: "мақала мен термин"
  },
  en: {
    title: "Knowledge Base",
    subtitle: "Improving legal literacy: Kazakhstan laws in simple terms",
    profile: "To Profile",
    search: "Search (taxes, alimony, fines)...",
    tabs: { guides: "📚 Articles", dict: "📖 Dictionary" },
    readTime: "min",
    full: "Read more ↓",
    hide: "Hide",
    stats: "articles and terms"
  }
};

const GUIDES = {
  ru: [
    { id: 1, category: "Суд", title: "Как подать иск в суд", readTime: "5", content: "1. Соберите доказательства.\n2. Оплатите госпошлину.\n3. Подайте через office.sud.kz." },
    { id: 2, category: "Семья", title: "Алименты 2026", readTime: "4", content: "На 1 ребенка — 25%, на 2 — 33%, на 3 и более — 50% от дохода." }
  ],
  kk: [
    { id: 1, category: "Сот", title: "Сотқа қалай талап арыз беруге болады", readTime: "5", content: "1. Дәлелдемелерді жинаңыз.\n2. Мемлекеттік баж салығын төлеңіз.\n3. office.sud.kz арқылы тапсырыңыз." },
    { id: 2, category: "Отбасы", title: "Алимент 2026", readTime: "4", content: "1 балаға — 25%, 2 балаға — 33%, 3 және одан көп балаға — табыстың 50%." }
  ],
  en: [
    { id: 1, category: "Court", title: "How to file a lawsuit", readTime: "5", content: "1. Collect evidence.\n2. Pay the state fee.\n3. Submit via office.sud.kz." },
    { id: 2, category: "Family", title: "Alimony 2026", readTime: "4", content: "For 1 child — 25%, for 2 children — 33%, for 3 or more — 50% of income." }
  ]
};

const DICTIONARY = {
  ru: [
    { term: "Истец", definition: "Лицо, подавшее иск в суд." },
    { term: "Ответчик", definition: "Лицо, к которому предъявлен иск." }
  ],
  kk: [
    { term: "Талапкер", definition: "Сотқа талап арыз берген тұлға." },
    { term: "Жауапкер", definition: "Талап қойылған тұлға." }
  ],
  en: [
    { term: "Plaintiff", definition: "The person who files a lawsuit." },
    { term: "Defendant", definition: "The person being sued." }
  ]
};

export default function EducationPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const [activeTab, setActiveTab] = useState<'guides' | 'dict'>('guides');
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);

  const t = TRANSLATIONS[lang];
  const currentGuides = GUIDES[lang].filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentDict = DICTIONARY[lang].filter(d => d.term.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Переключатель языков */}
        <div className="flex justify-end gap-2 mb-4">
          {['ru', 'kk', 'en'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as any)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${lang === l ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-[#0c1527] border-blue-500/20 text-gray-400'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Шапка */}
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white">{t.title}</h1>
            <p className="text-gray-400 mt-2">{t.subtitle}</p>
          </div>
          <button onClick={() => router.push('/profile')} className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all">
            {t.profile}
          </button>
        </div>

        {/* Поиск и Табы */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex bg-[#0c1527] p-1 rounded-2xl border border-blue-500/20 shrink-0">
            <button onClick={() => setActiveTab('guides')} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'guides' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>
              {t.tabs.guides}
            </button>
            <button onClick={() => setActiveTab('dict')} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'dict' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>
              {t.tabs.dict}
            </button>
          </div>
          <input 
            type="text" 
            placeholder={t.search} 
            className="flex-1 bg-[#0c1527] border border-blue-500/20 rounded-2xl p-3.5 px-6 text-white outline-none focus:border-emerald-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Контент */}
        {activeTab === 'guides' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentGuides.map(guide => (
              <div key={guide.id} className="bg-[#0f192e] border border-emerald-500/10 p-6 rounded-3xl hover:border-emerald-500/40 transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full uppercase">{guide.category}</span>
                  <span className="text-[10px] text-gray-500">{guide.readTime} {t.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300">{guide.title}</h3>
                <div className={`text-sm text-gray-400 leading-relaxed ${expandedGuide === guide.id ? '' : 'line-clamp-2'}`}>
                  {guide.content}
                </div>
                <button onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)} className="mt-4 text-emerald-500 text-xs font-bold hover:underline text-left">
                  {expandedGuide === guide.id ? t.hide : t.full}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDict.map((item, idx) => (
              <div key={idx} className="bg-[#0c1527] border border-blue-500/10 p-5 rounded-2xl">
                <h4 className="text-blue-400 font-bold mb-1">{item.term}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}