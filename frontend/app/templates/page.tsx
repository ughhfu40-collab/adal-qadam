"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../LanguageContext'; 

// --- СЛОВАРИ ДЛЯ ИНТЕРФЕЙСА ---
const uiTranslations = {
  ru: {
    title: "Конструктор документов",
    subtitle: "База из 100+ сценариев на основе ГК и ГПК РК",
    toProfile: "В профиль",
    searchPlaceholder: "Поиск по названию, категории или проблеме (например, залив, банк, увольнение)...",
    startFilling: "Начать заполнение",
    notFound: "Ничего не найдено. Попробуйте другой запрос.",
    resetSearch: "Сбросить поиск"
  },
  kk: {
    title: "Құжаттар конструкторы",
    subtitle: "ҚР АК және АІЖК негізіндегі 100+ сценарий базасы",
    toProfile: "Профильге",
    searchPlaceholder: "Атауы, санаты немесе мәселе бойынша іздеу (мысалы, су басу, банк, жұмыстан шығару)...",
    startFilling: "Толтыруды бастау",
    notFound: "Ештеңе табылмады. Басқа сұрауды байқап көріңіз.",
    resetSearch: "Іздеуді болдырмау"
  },
  en: {
    title: "Document Builder",
    subtitle: "Database of 100+ scenarios based on Civil Code and CPC of RK",
    toProfile: "To Profile",
    searchPlaceholder: "Search by title, category or issue (e.g., flood, bank, dismissal)...",
    startFilling: "Start filling",
    notFound: "Nothing found. Try another query.",
    resetSearch: "Reset search"
  }
};

// --- МАССИВ ШАБЛОНОВ ---
const templatesData = {
  ru: [
    // --- СЕМЕЙНОЕ ПРАВО ---
    { id: 1, title: "Исковое заявление о расторжении брака", category: "Семейное право", description: "Расторжение брака через суд (при наличии детей или отсутствии согласия).", icon: "💍", prompt: "Помоги составить иск о расторжении брака по законам РК. Спроси: данные супругов, дату брака, есть ли дети и спор об имуществе." },
    { id: 2, title: "Взыскание алиментов (судебный приказ)", category: "Семейное право", description: "Упрощенный порядок взыскания доли от дохода на содержание детей.", icon: "👶", prompt: "Составь заявление на вынесение судебного приказа о взыскании алиментов. Спроси: данные родителей, детей и место работы должника." },
    { id: 3, title: "Определение места жительства ребенка", category: "Семейное право", description: "Спор о том, с кем из родителей будет проживать ребенок после развода.", icon: "🏠", prompt: "Помоги составить иск об определении места жительства ребенка. Спроси: возраст ребенка, условия проживания сторон и привязанность ребенка." },
    { id: 21, title: "Установление отцовства", category: "Семейное право", description: "Иск об установлении отцовства в судебном порядке (через ДНК или доказательства).", icon: "🧬", prompt: "Помоги составить иск об установлении отцовства. Спроси данные матери, предполагаемого отца и ребенка." },
    { id: 22, title: "Лишение родительских прав", category: "Семейное право", description: "Иск в случаях злостного уклонения от обязанностей или угрозы ребенку.", icon: "🚫", prompt: "Составь иск о лишении родительских прав. Спроси основания (неуплата алиментов, насилие и т.д.) и данные сторон." },
    { id: 23, title: "Раздел общего имущества супругов", category: "Семейное право", description: "Иск о разделе квартир, авто и счетов после развода (срок 3 года).", icon: "⚖️", prompt: "Составь иск о разделе имущества. Перечисли список имущества, дату развода и предложи варианты раздела." },
    
    // --- ЗАЩИТА ПРАВ ПОТРЕБИТЕЛЕЙ ---
    { id: 4, title: "Претензия: Возврат смартфона/техники", category: "Защита прав потребителей", description: "Возврат денег за бракованный гаджет или ремонт более 30 дней.", icon: "📱", prompt: "Напиши претензию в магазин электроники. Спроси: модель, дату покупки, дефект и сколько времени товар находится в сервисе." },
    { id: 5, title: "Иск к авиакомпании (задержка рейса)", category: "Защита прав потребителей", description: "Взыскание штрафа 3% за каждый час задержки и компенсации за еду/отель.", icon: "✈️", prompt: "Составь претензию к авиакомпании РК за задержку рейса. Спроси: номер рейса, время задержки и понесенные расходы." },
    { id: 24, title: "Возврат товара надлежащего качества", category: "Защита прав потребителей", description: "Если товар не подошел (14 дней), но магазин отказывается возвращать деньги.", icon: "🛍️", prompt: "Напиши претензию на возврат товара (не подошел цвет/размер). Спроси дату покупки и причину отказа магазина." },
    { id: 25, title: "Жалоба на онлайн-курс/образование", category: "Защита прав потребителей", description: "Возврат средств за некачественное обучение в интернете.", icon: "🎓", prompt: "Составь претензию на возврат денег за онлайн-курс. Спроси название платформы, сумму и почему обучение не устроило." },
    
    // --- ТРУДОВОЕ ПРАВО ---
    { id: 12, title: "Иск о восстановлении на работе", category: "Трудовое право", description: "При незаконном увольнении или сокращении без уведомления.", icon: "💼", prompt: "Составь иск о восстановлении на работе и выплате за вынужденный прогул. Спроси: должность, причину увольнения и дату приказа." },
    { id: 13, title: "Взыскание невыплаченной зарплаты", category: "Трудовое право", description: "Требование выплатить оклад и компенсацию за неиспользованный отпуск.", icon: "💵", prompt: "Помоги взыскать долг по зарплате. Спроси: название компании, период работы и сумму задолженности." },
    { id: 26, title: "Жалоба в Инспекцию труда", category: "Трудовое право", description: "Если работодатель нарушает график или не подписывает договор.", icon: "📝", prompt: "Напиши жалобу в инспекцию труда. Спроси суть нарушения: сверхурочные, отсутствие договора или штрафы." },
    { id: 27, title: "Взыскание выплат при сокращении", category: "Трудовое право", description: "Требование компенсации в размере средней зарплаты при ликвидации компании.", icon: "📉", prompt: "Составь заявление работодателю о выплате компенсации при сокращении штата." },

    // --- ФИНАНСЫ И ДОЛГИ ---
    { id: 6, title: "Взыскание долга по расписке", category: "Гражданское право", description: "Требование возврата денег, переданных в долг физлицу.", icon: "💰", prompt: "Составь иск о взыскании суммы долга по расписке. Спроси: сумму, дату займа, срок возврата и ФИО должника." },
    { id: 7, title: "Отмена судебного приказа (долг по Кредиту)", category: "Финансы", description: "Возражение против взыскания долга банком или микрофинансовой организацией (МФО).", icon: "💳", prompt: "Помоги составить возражение на судебный приказ по долгу перед банком/МФО. Спроси: номер приказа, дату получения и причину несогласия." },
    { id: 28, title: "Жалоба на действия коллекторов", category: "Финансы", description: "Защита от угроз, звонков в ночное время и психологического давления.", icon: "📵", prompt: "Напиши жалобу в Агентство по финрегулированию на коллекторов. Спроси: название агентства и суть нарушений." },
    { id: 29, title: "Заявление на банкротство физлица", category: "Финансы", description: "Подготовка пакета данных для признания финансовой несостоятельности.", icon: "🧨", prompt: "Помоги подготовить заявление на банкротство физлица по законам РК. Спроси сумму долга и срок просрочки." },

    // --- НЕДВИЖИМОСТЬ ---
    { id: 11, title: "Взыскание ущерба при заливе квартиры", category: "Недвижимость", description: "Требование компенсации за ремонт после затопления соседями сверху.", icon: "💧", prompt: "Помоги составить иск к соседям за залив квартиры. Спроси: дату, наличие акта от КСК/ОСИ и сумму оценки ущерба." },
    { id: 10, title: "Иск о выселении из квартиры", category: "Недвижимость", description: "Выселение лиц, проживающих без договора или нарушающих правила.", icon: "🔑", prompt: "Составь иск о выселении. Спроси: адрес, кто проживает и на каком основании (или его отсутствии)." },
    { id: 30, title: "Споры с застройщиком (просрочка сдачи)", category: "Недвижимость", description: "Взыскание неустойки за задержку передачи ключей в ЖК.", icon: "🏗️", prompt: "Составь претензию к застройщику за задержку сдачи дома. Спроси название ЖК, дату в договоре и текущую дату." },
    { id: 31, title: "Расторжение договора аренды", category: "Недвижимость", description: "Уведомление арендодателя о съезде или требование возврата депозита.", icon: "📦", prompt: "Напиши уведомление о расторжении договора аренды. Спроси причину и дату выезда." },

    // --- АДМИНИСТРАТИВНОЕ И ТРАНСПОРТ ---
    { id: 9, title: "Обжалование штрафа Сергек", category: "Административное право", description: "Оспаривание предписания о нарушении ПДД, если за рулем был не владелец.", icon: "📸", prompt: "Помоги обжаловать штраф видеофиксации. Спроси: номер предписания, суть нарушения и доказательства." },
    { id: 8, title: "Иск к виновнику ДТП (ущерб сверх страховки)", category: "Транспорт", description: "Если страховой выплаты не хватило на полное восстановление авто.", icon: "🚗", prompt: "Составь иск к виновнику ДТП. Спроси: сумму оценки ущерба, сумму выплаты страховки и данные протокола полиции." },
    { id: 32, title: "Жалоба на эвакуацию авто", category: "Транспорт", description: "Если машину забрали на штрафстоянку незаконно или с повреждениями.", icon: "🚧", prompt: "Составь жалобу на действия полиции при эвакуации автомобиля." },

    // --- ПРОЧЕЕ ---
    { id: 14, title: "Иск о защите чести и достоинства", category: "Гражданское право", description: "Опровержение клеветы в соцсетях и взыскание морального вреда.", icon: "🗣️", prompt: "Составь иск о защите чести и достоинства. Спроси: где опубликована ложь и какие факты искажены." },
    { id: 18, title: "Иск о снятии ареста с имущества", category: "Исполнительное производство", description: "Если ЧСИ наложил арест незаконно или долг уже погашен.", icon: "🔓", prompt: "Помоги составить иск о снятии ареста. Спроси: ФИО судебного исполнителя и номер производства." },
    { id: 33, title: "Жалоба на действия ЧСИ", category: "Исполнительное производство", description: "Оспаривание завышенных сумм оплаты или блокировки всех счетов сразу.", icon: "👮", prompt: "Напиши жалобу в Палату частных судебных исполнителей на действия ЧСИ." },
    { id: 34, title: "Заявление о наследстве", category: "Наследственное право", description: "Обращение к нотариусу для открытия наследственного дела.", icon: "📜", prompt: "Составь заявление нотариусу о принятии наследства. Спроси данные умершего и степень родства." },
    { id: 100, title: "Произвольный юридический вопрос", category: "Консультация", description: "Если вашей ситуации нет в списке — опишите ее своими словами.", icon: "❓", prompt: "Проанализируй мою ситуацию с точки зрения законов РК и подскажи, какой документ мне нужен." }
  ],
  kk: [
    { id: 1, title: "Некені бұзу туралы талап арыз", category: "Отбасы құқығы", description: "Сот арқылы некені бұзу (балалар болғанда немесе келісім болмағанда).", icon: "💍", prompt: "ҚР заңдары бойынша некені бұзу туралы талап арыз құрастыруға көмектес. Сұра: ерлі-зайыптылардың деректері, неке күні, балалардың болуы және мүлік дауы." },
    { id: 2, title: "Алимент өндіру (сот бұйрығы)", category: "Отбасы құқығы", description: "Балаларды асырауға кірістен үлес өндірудің оңайлатылған тәртібі.", icon: "👶", prompt: "Алимент өндіру туралы сот бұйрығын шығаруға арыз құрастыр. Сұра: ата-ана мен балалардың деректері, борышкердің жұмыс орны." },
    { id: 4, title: "Шағым: Смартфонды/техниканы қайтару", category: "Тұтынушылар құқығын қорғау", description: "Ақауы бар гаджет үшін ақшаны қайтару немесе жөндеу 30 күннен асса.", icon: "📱", prompt: "Электроника дүкеніне шағым жаз. Сұра: моделі, сатып алған күні, ақауы және сервисте қанша уақыт болғаны." },
    { id: 6, title: "Қолхат бойынша қарызды өндіру", category: "Азаматтық құқық", description: "Жеке тұлғаға қарызға берілген ақшаны қайтаруды талап ету.", icon: "💰", prompt: "Қолхат бойынша қарыз сомасын өндіру туралы талап арыз құрастыр. Сұра: сомасы, қарыз берілген күн, қайтару мерзімі және борышкердің аты-жөні." },
    { id: 9, title: "Сергек айыппұлын шағымдану", category: "Әкімшілік құқық", description: "Рөлде көлік иесі болмаған жағдайда ЖҚЕ бұзу туралы нұсқаманы даулау.", icon: "📸", prompt: "Бейнетіркеу айыппұлына шағымдануға көмектес. Сұра: нұсқама нөмірі, бұзушылықтың мәні және дәлелдемелер." },
    { id: 11, title: "Пәтерді су басқандағы залалды өндіру", category: "Жылжымайтын мүлік", description: "Жоғарғы көршілер су басқаннан кейін жөндеуге өтемақы талап ету.", icon: "💧", prompt: "Пәтерді су басқаны үшін көршілерге талап арыз құрастыруға көмектес. Сұра: күні, ПИК/МИБ актісінің болуы және залалды бағалау сомасы." },
    { id: 13, title: "Төленбеген жалақыны өндіру", category: "Еңбек құқығы", description: "Жалақыны және пайдаланылмаған демалыс үшін өтемақыны талап ету.", icon: "💵", prompt: "Жалақы қарызын өндіруге көмектес. Сұра: компания атауы, жұмыс кезеңі және қарыз сомасы." },
    { id: 33, title: "ЖСИ әрекетіне шағым", category: "Атқарушылық іс жүргізу", description: "Артық төлем сомаларын немесе шоттарды бұғаттауды даулау.", icon: "👮", prompt: "Жеке сот орындаушыларының палатасына шағым жаз." },
    { id: 100, title: "Кез келген заңгерлік сұрақ", category: "Кеңес", description: "Тізімде сіздің жағдайыңыз болмаса — өз сөзіңізбен сипаттаңыз.", icon: "❓", prompt: "Менің жағдайымды ҚР заңдары тұрғысынан талдап, маған қандай құжат керек екенін айт." }
  ],
  en: [
    { id: 1, title: "Statement of claim for divorce", category: "Family Law", description: "Divorce through court (if there are children or no consent).", icon: "💍", prompt: "Help draft a divorce claim under RK laws. Ask: spouses' details, marriage date, children, and property dispute." },
    { id: 2, title: "Alimony recovery (court order)", category: "Family Law", description: "Simplified procedure for collecting a share of income for child support.", icon: "👶", prompt: "Draft an application for a court order to collect alimony. Ask: parents' and children's data, debtor's workplace." },
    { id: 4, title: "Claim: Return of smartphone/electronics", category: "Consumer Rights", description: "Refund for a defective gadget or repair taking over 30 days.", icon: "📱", prompt: "Write a complaint to an electronics store. Ask: model, purchase date, defect, and repair time." },
    { id: 6, title: "Debt recovery by receipt", category: "Civil Law", description: "Demand for the return of money loaned to an individual.", icon: "💰", prompt: "Draft a claim for debt recovery by receipt. Ask: amount, loan date, return date, and debtor's full name." },
    { id: 7, title: "Cancel court order (Loan debt)", category: "Finance", description: "Objection to debt collection by a bank or microfinance organization (MFO).", icon: "💳", prompt: "Help draft an objection to a court order for a bank/MFO debt. Ask: order number, receipt date, and reason for disagreement." },
    { id: 11, title: "Damage recovery for apartment flooding", category: "Real Estate", description: "Demand for repair compensation after flooding by upstairs neighbors.", icon: "💧", prompt: "Help draft a claim against neighbors for apartment flooding. Ask: date, presence of a housing act, and damage assessment amount." },
    { id: 13, title: "Recovery of unpaid salary", category: "Labor Law", description: "Demand to pay salary and compensation for unused vacation.", icon: "💵", prompt: "Help recover salary debt. Ask: company name, period of work, and debt amount." },
    { id: 100, title: "Any legal question", category: "Consultation", description: "If your situation is not listed — describe it in your own words.", icon: "❓", prompt: "Analyze my situation from the point of view of RK laws and tell me what document I need." }
  ]
};

export default function TemplatesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { lang } = useLanguage(); 
  const t = uiTranslations[lang];
  const templates = templatesData[lang] || templatesData.ru; 

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseTemplate = (prompt: string) => {
    router.push(`/?template_prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
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
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all font-bold uppercase text-sm tracking-wider"
          >
            {t.toProfile}
          </button>
        </div>

        <div className="mb-8 relative">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-[#0f192e] border border-blue-500/10 p-6 rounded-3xl hover:border-purple-500/40 hover:bg-[#131e36] transition-all flex flex-col h-full group shadow-md hover:shadow-purple-500/10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-900/30 rounded-2xl flex items-center justify-center text-2xl border border-purple-500/20 group-hover:scale-110 transition-transform">
                  {template.icon}
                </div>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-900/20 px-3 py-1 rounded-full uppercase tracking-wider text-right max-w-[60%] leading-tight">
                  {template.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors">{template.title}</h3>
              <p className="text-gray-400 text-xs mb-6 flex-grow leading-relaxed">{template.description}</p>

              <button
                onClick={() => handleUseTemplate(template.prompt)}
                className="w-full bg-blue-600/10 border border-blue-500/30 text-blue-400 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold flex items-center justify-center gap-2 uppercase text-xs tracking-wider"
              >
                {t.startFilling}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-xl">{t.notFound}</p>
              <button onClick={() => setSearchTerm("")} className="mt-4 text-blue-400 underline">{t.resetSearch}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}