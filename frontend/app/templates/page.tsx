"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// База популярных шаблонов
const TEMPLATES = [
  {
    id: 1,
    title: "Исковое заявление о расторжении брака",
    category: "Семейное право",
    description: "Стандартная форма для развода при отсутствии споров о детях и имуществе.",
    icon: "💍",
    prompt: "Помоги мне составить исковое заявление о расторжении брака по законам РК. Задай мне по очереди вопросы: ФИО супругов, даты заключения брака, наличие несовершеннолетних детей."
  },
  {
    id: 2,
    title: "Претензия о возврате товара",
    category: "Защита прав потребителей",
    description: "Требование к продавцу вернуть деньги за некачественный товар (ст. 15 Закона РК о ЗПП).",
    icon: "🛒",
    prompt: "Помоги мне составить досудебную претензию в магазин о возврате денег за некачественный товар по законам РК. Спроси у меня: название магазина, дату покупки, что за товар и какая в нем поломка."
  },
  {
    id: 3,
    title: "Исковое заявление о взыскании долга",
    category: "Гражданское право",
    description: "Иск в суд по расписке или договору займа, если должник отказывается платить.",
    icon: "💰",
    prompt: "Помоги мне составить исковое заявление о взыскании долга по расписке (ГК РК). Задай вопросы: суммы долга, даты составления расписки, ФИО должника и даты, когда он должен был вернуть деньги."
  },
  {
    id: 4,
    title: "Жалоба на действия работодателя",
    category: "Трудовое право",
    description: "Жалоба в инспекцию труда при невыплате зарплаты или незаконном увольнении.",
    icon: "🏢",
    prompt: "Помоги мне написать жалобу в государственную инспекцию труда РК на работодателя. Спроси меня: название ТОО/ИП, мою должность, суть нарушения (не дали зарплату, незаконно уволили) и период работы."
  },
  {
    id: 5,
    title: "Заявление об отмене судебного приказа",
    category: "Гражданский процесс",
    description: "Форма для отмены приказа о взыскании долга (например, от коллекторов или банка).",
    icon: "⚖️",
    prompt: "Помоги мне составить заявление об отмене судебного приказа по законам РК. Спроси у меня: название суда, кто взыскатель, дату вынесения приказа и причину, почему я с ним не согласен."
  },
  {
    id: 6,
    title: "Договор аренды квартиры",
    category: "Недвижимость",
    description: "Типовой договор найма жилища между физическими лицами.",
    icon: "🏠",
    prompt: "Помоги составить надежный договор аренды квартиры по законам РК. Спроси: ФИО арендодателя и арендатора, адрес квартиры, сумму ежемесячной оплаты и срок аренды."
  }
];

export default function TemplatesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = TEMPLATES.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Функция: берет промпт шаблона и кидает юзера в чат с этим промптом
  const handleUseTemplate = (prompt: string) => {
    // Кодируем промпт в URL и отправляем на главную страницу (в чат)
    router.push(`/?template_prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-purple-500">📄</span> Конструктор документов
            </h1>
            <p className="text-gray-400 mt-2">Выберите нужный шаблон, и ИИ поможет вам его заполнить</p>
          </div>
          <button 
            onClick={() => router.push('/profile')} 
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all"
          >
            В профиль
          </button>
        </div>

        <div className="mb-8 relative">
          <input 
            type="text" 
            placeholder="Поиск документа (например, развод, долг, аренда)..." 
            className="w-full bg-[#0c1527] border border-blue-500/20 rounded-2xl p-4 pl-12 text-white outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-6 h-6 text-gray-500 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-[#0f192e] border border-blue-500/10 p-6 rounded-3xl hover:border-purple-500/40 hover:bg-[#131e36] transition-all flex flex-col h-full group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-900/30 rounded-2xl flex items-center justify-center text-2xl border border-purple-500/20">
                  {template.icon}
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-900/20 px-3 py-1 rounded-full">
                  {template.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">{template.title}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow">{template.description}</p>
              
              <button 
                onClick={() => handleUseTemplate(template.prompt)}
                className="w-full bg-blue-600/10 border border-blue-500/30 text-blue-400 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-medium flex items-center justify-center gap-2"
              >
                Создать с ИИ
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}