"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GUIDES = [
  {
    id: 1,
    title: "Как подать иск в суд: Пошаговый план",
    category: "Судебный процесс",
    readTime: "5 мин",
    content: "1. Соберите доказательства (договоры, чеки, переписки).\n2. Соблюдите досудебный порядок (отправьте претензию должнику/магазину).\n3. Оплатите госпошлину (1% для физлиц, 3% для юрлиц от суммы иска).\n4. Составьте иск (через наш Конструктор) и подайте его через Судебный кабинет (office.sud.kz)."
  },
  {
    id: 2,
    title: "Что делать, если звонят коллекторы?",
    category: "Кредиты и долги",
    readTime: "3 мин",
    content: "По закону РК коллекторы имеют право звонить не более 3 раз в день с 8:00 до 21:00. Они не имеют права угрожать, звонить вашим родственникам (если те не выступали гарантами) или описывать имущество (это делают только судебные исполнители после суда). Записывайте звонки и жалуйтесь в АРРФР."
  },
  {
    id: 3,
    title: "Права потребителя: 14 дней на возврат",
    category: "Покупки",
    readTime: "4 мин",
    content: "Согласно ст. 14 Закона РК «О защите прав потребителей», вы можете вернуть товар надлежащего качества в течение 14 дней, если сохранен товарный вид, пломбы и чек. Исключения: лекарства, нижнее белье, животные, метражные ткани и сотовые телефоны."
  },
  {
    id: 4,
    title: "Как проверить застройщика перед покупкой?",
    category: "Недвижимость",
    readTime: "6 мин",
    content: "1. Проверьте наличие лицензии на привлечение денег дольщиков (на сайте КЖК).\n2. Убедитесь, что вам предлагают подписать именно Договор долевого участия (ДДУ), а не договор бронирования или инвестирования (они незаконны).\n3. Проверьте историю судов застройщика через сервис Судебный кабинет."
  }
];

const DICTIONARY = [
  { term: "Истец", definition: "Человек или компания, чьи права нарушены и кто подает заявление в суд." },
  { term: "Ответчик", definition: "Тот, к кому предъявляют требования в суде (нарушитель)." },
  { term: "Госпошлина", definition: "Обязательный платеж государству за то, что суд рассматривает ваше дело." },
  { term: "Неустойка (Пеня)", definition: "Штраф за каждый день просрочки долга или невыполнения обязательств." },
  { term: "Моральный вред", definition: "Нравственные или физические страдания (стресс, ухудшение здоровья), причиненные незаконными действиями." },
  { term: "Досудебная претензия", definition: "Официальное письмо нарушителю с требованием решить проблему мирно до обращения в суд (обязательный этап во многих делах)." },
];

export default function EducationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'guides' | 'dictionary'>('guides');
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);

  const filteredGuides = GUIDES.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredDictionary = DICTIONARY.filter(d => d.term.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-emerald-500">🎓</span> База знаний
            </h1>
            <p className="text-gray-400 mt-2">Повышаем правовую грамотность: законы простым языком</p>
          </div>
          <button 
            onClick={() => router.push('/profile')} 
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all"
          >
            В профиль
          </button>
        </div>

        {/* Поиск и Табы */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex bg-[#0c1527] p-1 rounded-2xl border border-blue-500/20 shrink-0">
            <button 
              onClick={() => setActiveTab('guides')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'guides' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              📚 Гайды и статьи
            </button>
            <button 
              onClick={() => setActiveTab('dictionary')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'dictionary' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              📖 Словарь терминов
            </button>
          </div>

          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Что вы хотите узнать?..." 
              className="w-full bg-[#0c1527] border border-blue-500/20 rounded-2xl p-3.5 pl-12 text-white outline-none focus:border-emerald-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-500 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Контент: Гайды */}
        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map(guide => (
              <div key={guide.id} className="bg-[#0f192e] border border-emerald-500/20 p-6 rounded-3xl hover:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full">{guide.category}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {guide.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{guide.title}</h3>
                
                {expandedGuide === guide.id ? (
                  <div className="mt-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line border-t border-emerald-500/10 pt-4">
                    {guide.content}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm line-clamp-2">{guide.content}</p>
                )}

                <button 
                  onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                  className="mt-6 text-emerald-400 text-sm font-bold hover:text-emerald-300 transition-all"
                >
                  {expandedGuide === guide.id ? "Скрыть" : "Читать полностью →"}
                </button>
              </div>
            ))}
            {filteredGuides.length === 0 && <div className="col-span-2 text-center py-10 text-gray-500">Ничего не найдено.</div>}
          </div>
        )}

        {/* Контент: Словарь */}
        {activeTab === 'dictionary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDictionary.map((item, idx) => (
              <div key={idx} className="bg-[#0c1527] border border-blue-500/10 p-5 rounded-2xl flex items-start gap-4 hover:bg-[#131e36] transition-all">
                <div className="w-10 h-10 shrink-0 bg-blue-900/30 text-blue-400 rounded-xl flex items-center justify-center font-bold text-lg">
                  {item.term.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{item.term}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.definition}</p>
                </div>
              </div>
            ))}
            {filteredDictionary.length === 0 && <div className="col-span-2 text-center py-10 text-gray-500">Термин не найден.</div>}
          </div>
        )}
      </div>
    </div>
  );
}