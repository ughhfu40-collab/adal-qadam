"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../LanguageContext'; // ИМПОРТ КОНТЕКСТА

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

// --- МАССИВ ШАБЛОНОВ НА 3 ЯЗЫКАХ ---
const templatesData = {
  ru: [
    { id: 1, title: "Исковое заявление о расторжении брака", category: "Семейное право", description: "Расторжение брака через суд (при наличии детей или отсутствии согласия).", icon: "💍", prompt: "Помоги составить иск о расторжении брака по законам РК. Спроси: данные супругов, дату брака, есть ли дети и спор об имуществе." },
    { id: 2, title: "Взыскание алиментов (судебный приказ)", category: "Семейное право", description: "Упрощенный порядок взыскания доли от дохода на содержание детей.", icon: "👶", prompt: "Составь заявление на вынесение судебного приказа о взыскании алиментов. Спроси: данные родителей, детей и место работы должника." },
    { id: 3, title: "Определение места жительства ребенка", category: "Семейное право", description: "Спор о том, с кем из родителей будет проживать ребенок после развода.", icon: "🏠", prompt: "Помоги составить иск об определении места жительства ребенка. Спроси: возраст ребенка, условия проживания сторон и привязанность ребенка." },
    { id: 4, title: "Претензия: Возврат смартфона/техники", category: "Защита прав потребителей", description: "Возврат денег за бракованный гаджет или ремонт более 30 дней.", icon: "📱", prompt: "Напиши претензию в магазин электроники. Спроси: модель, дату покупки, дефект и сколько времени товар находится в сервисе." },
    { id: 5, title: "Иск к авиакомпании (задержка рейса)", category: "Защита прав потребителей", description: "Взыскание штрафа 3% за каждый час задержки и компенсации за еду/отель.", icon: "✈️", prompt: "Составь претензию к авиакомпании РК за задержку рейса. Спроси: номер рейса, время задержки и понесенные расходы." },
    { id: 6, title: "Взыскание долга по расписке", category: "Гражданское право", description: "Требование возврата денег, переданных в долг физлицу.", icon: "💰", prompt: "Составь иск о взыскании суммы долга по расписке. Спроси: сумму, дату займа, срок возврата и ФИО должника." },
    { id: 7, title: "Отмена судебного приказа (долг по Кредиту)", category: "Финансы", description: "Возражение против взыскания долга банком или микрофинансовой организацией (МФО).", icon: "💳", prompt: "Помоги составить возражение на судебный приказ по долгу перед банком/МФО. Спроси: номер приказа, дату получения и причину несогласия." },
    { id: 8, title: "Иск к виновнику ДТП (ущерб сверх страховки)", category: "Транспорт", description: "Если страховой выплаты не хватило на полное восстановление авто.", icon: "🚗", prompt: "Составь иск к виновнику ДТП. Спроси: сумму оценки ущерба, сумму выплаты страховки и данные протокола полиции." },
    { id: 9, title: "Обжалование штрафа Сергек", category: "Административное право", description: "Оспаривание предписания о нарушении ПДД, если за рулем был не владелец.", icon: "📸", prompt: "Помоги обжаловать штраф видеофиксации. Спроси: номер предписания, суть нарушения и доказательства (договор аренды, страховка на другого человека)." },
    { id: 10, title: "Иск о выселении из квартиры", category: "Недвижимость", description: "Выселение лиц, проживающих без договора или нарушающих правила.", icon: "🔑", prompt: "Составь иск о выселении. Спроси: адрес, кто проживает и на каком основании (или его отсутствии)." },
    { id: 11, title: "Взыскание ущерба при заливе квартиры", category: "Недвижимость", description: "Требование компенсации за ремонт после затопления соседями сверху.", icon: "💧", prompt: "Помоги составить иск к соседям за залив квартиры. Спроси: дату, наличие акта от КСК/ОСИ и сумму оценки ущерба." },
    { id: 12, title: "Иск о восстановлении на работе", category: "Трудовое право", description: "При незаконном увольнении или сокращении без уведомления.", icon: "💼", prompt: "Составь иск о восстановлении на работе и выплате за вынужденный прогул. Спроси: должность, причину увольнения и дату приказа." },
    { id: 13, title: "Взыскание невыплаченной зарплаты", category: "Трудовое право", description: "Требование выплатить оклад и компенсацию за неиспользованный отпуск.", icon: "💵", prompt: "Помоги взыскать долг по зарплате. Спроси: название компании, период работы и сумму задолженности." },
    { id: 14, title: "Иск о защите чести и достоинства", category: "Гражданское право", description: "Опровержение клеветы в соцсетях или СМИ и взыскание морального вреда.", icon: "🗣️", prompt: "Составь иск о защите чести и достоинства. Спроси: где опубликована ложь, какие факты искажены и сумму морального вреда." },
    { id: 15, title: "Жалоба на врача (медицинская халатность)", category: "Здравоохранение", description: "Жалоба в Комитет медицинского контроля на некачественное лечение.", icon: "🏥", prompt: "Помоги написать жалобу на действия врача. Спроси: клинику, дату приема и в чем заключалась ошибка или вред здоровью." },
    { id: 16, title: "Иск о признании сделки недействительной", category: "Недвижимость", description: "Оспаривание купли-продажи, совершенной под давлением или в обман.", icon: "📑", prompt: "Помоги оспорить сделку. Спроси: суть договора, дату и причины, почему сделка считается незаконной (обман, недееспособность)." },
    { id: 17, title: "Узаконивание перепланировки", category: "Недвижимость", description: "Иск о признании права собственности на реконструированный объект.", icon: "🏗️", prompt: "Составь иск об узаконивании перепланировки. Спроси: адрес, что было изменено и есть ли техзаключение эксперта." },
    { id: 18, title: "Иск о снятии ареста с имущества", category: "Исполнительное производство", description: "Если ЧСИ наложил арест незаконно или долг уже погашен.", icon: "🔓", prompt: "Помоги составить иск о снятии ареста. Спроси: ФИО судебного исполнителя, номер производства и основание для снятия ареста." },
    { id: 19, title: "Заявление об установлении факта смерти", category: "Особое производство", description: "Для получения наследства, если факт смерти не зарегистрирован вовремя.", icon: "📜", prompt: "Помоги составить заявление в суд об установлении факта смерти. Спроси: данные умершего, место/время и зачем нужно установление факта." },
    { id: 20, title: "Жалоба на действия налоговой", category: "Налоги", description: "Оспаривание уведомления о доначислении налогов или блокировке счетов.", icon: "📉", prompt: "Составь жалобу на действия налогового органа. Спроси: номер уведомления, БИН компании и суть несогласия с налогами." }
  ],
  kk: [
    { id: 1, title: "Некені бұзу туралы талап арыз", category: "Отбасы құқығы", description: "Сот арқылы некені бұзу (балалар болғанда немесе келісім болмағанда).", icon: "💍", prompt: "ҚР заңдары бойынша некені бұзу туралы талап арыз құрастыруға көмектес. Сұра: ерлі-зайыптылардың деректері, неке күні, балалардың болуы және мүлік дауы." },
    { id: 2, title: "Алимент өндіру (сот бұйрығы)", category: "Отбасы құқығы", description: "Балаларды асырауға кірістен үлес өндірудің оңайлатылған тәртібі.", icon: "👶", prompt: "Алимент өндіру туралы сот бұйрығын шығаруға арыз құрастыр. Сұра: ата-ана мен балалардың деректері, борышкердің жұмыс орны." },
    { id: 3, title: "Баланың тұрғылықты жерін анықтау", category: "Отбасы құқығы", description: "Ажырасқаннан кейін баланың кіммен тұратыны туралы дау.", icon: "🏠", prompt: "Баланың тұрғылықты жерін анықтау туралы талап арыз құрастыруға көмектес. Сұра: баланың жасы, тұру жағдайлары және баланың бауыр басуы." },
    { id: 4, title: "Шағым: Смартфонды/техниканы қайтару", category: "Тұтынушылар құқығын қорғау", description: "Ақауы бар гаджет үшін ақшаны қайтару немесе жөндеу 30 күннен асса.", icon: "📱", prompt: "Электроника дүкеніне шағым жаз. Сұра: моделі, сатып алған күні, ақауы және сервисте қанша уақыт болғаны." },
    { id: 5, title: "Әуе компаниясына талап арыз (рейс кешігуі)", category: "Тұтынушылар құқығын қорғау", description: "Кешіккен әр сағат үшін 3% айыппұл және тамақ/қонақүй шығындарын өндіру.", icon: "✈️", prompt: "ҚР әуе компаниясына рейстің кешігуіне байланысты шағым құрастыр. Сұра: рейс нөмірі, кешігу уақыты және шығындар." },
    { id: 6, title: "Қолхат бойынша қарызды өндіру", category: "Азаматтық құқық", description: "Жеке тұлғаға қарызға берілген ақшаны қайтаруды талап ету.", icon: "💰", prompt: "Қолхат бойынша қарыз сомасын өндіру туралы талап арыз құрастыр. Сұра: сомасы, қарыз берілген күн, қайтару мерзімі және борышкердің аты-жөні." },
    { id: 7, title: "Сот бұйрығының күшін жою (Несие қарызы)", category: "Қаржы", description: "Банк немесе МҚҰ қарызды өндіруіне қарсылық.", icon: "💳", prompt: "Банк/МҚҰ алдындағы қарыз бойынша сот бұйрығына қарсылық құрастыруға көмектес. Сұра: бұйрық нөмірі, алған күні және келіспеу себебі." },
    { id: 8, title: "Жол апатына кінәліге талап арыз", category: "Көлік", description: "Сақтандыру төлемі көлікті толық қалпына келтіруге жетпеген жағдайда.", icon: "🚗", prompt: "Жол апатына кінәлі тұлғаға талап арыз құрастыр. Сұра: залалды бағалау сомасы, сақтандыру төлемі және полиция хаттамасының деректері." },
    { id: 9, title: "Сергек айыппұлын шағымдану", category: "Әкімшілік құқық", description: "Рөлде көлік иесі болмаған жағдайда ЖҚЕ бұзу туралы нұсқаманы даулау.", icon: "📸", prompt: "Бейнетіркеу айыппұлына шағымдануға көмектес. Сұра: нұсқама нөмірі, бұзушылықтың мәні және дәлелдемелер (жалға алу шарты, басқа адамға сақтандыру)." },
    { id: 10, title: "Пәтерден шығару туралы талап арыз", category: "Жылжымайтын мүлік", description: "Шартсыз тұрып жатқан немесе ережелерді бұзған адамдарды шығару.", icon: "🔑", prompt: "Пәтерден шығару туралы талап арыз құрастыр. Сұра: мекенжайы, кім тұрып жатыр және қандай негізде (немесе оның жоқтығы)." },
    { id: 11, title: "Пәтерді су басқандағы залалды өндіру", category: "Жылжымайтын мүлік", description: "Жоғарғы көршілер су басқаннан кейін жөндеуге өтемақы талап ету.", icon: "💧", prompt: "Пәтерді су басқаны үшін көршілерге талап арыз құрастыруға көмектес. Сұра: күні, ПИК/МИБ актісінің болуы және залалды бағалау сомасы." },
    { id: 12, title: "Жұмысқа қайта тұру туралы талап арыз", category: "Еңбек құқығы", description: "Заңсыз жұмыстан шығарылған немесе ескертусіз қысқартылған кезде.", icon: "💼", prompt: "Жұмысқа қайта тұру және мәжбүрлі бос жүрген уақыт үшін төлем алу туралы талап арыз құрастыр. Сұра: лауазымы, жұмыстан шығару себебі және бұйрық күні." },
    { id: 13, title: "Төленбеген жалақыны өндіру", category: "Еңбек құқығы", description: "Жалақыны және пайдаланылмаған демалыс үшін өтемақыны талап ету.", icon: "💵", prompt: "Жалақы қарызын өндіруге көмектес. Сұра: компания атауы, жұмыс кезеңі және қарыз сомасы." },
    { id: 14, title: "Ар-намыс пен қадір-қасиетті қорғау", category: "Азаматтық құқық", description: "Желідегі немесе БАҚ-тағы жала жабуды теріске шығару және моральдық зиянды өндіру.", icon: "🗣️", prompt: "Ар-намыс пен қадір-қасиетті қорғау туралы талап арыз құрастыр. Сұра: өтірік қайда жарияланды, қандай фактілер бұрмаланды және зиян сомасы." },
    { id: 15, title: "Дәрігерге шағым (медициналық салғырттық)", category: "Денсаулық сақтау", description: "Сапасыз емдеуге Медициналық бақылау комитетіне шағым.", icon: "🏥", prompt: "Дәрігердің әрекетіне шағым жазуға көмектес. Сұра: клиника, қабылдау күні және қателік немесе денсаулыққа зиян неде болды." },
    { id: 16, title: "Мәмілені жарамсыз деп тану", category: "Жылжымайтын мүлік", description: "Қысыммен немесе алдау арқылы жасалған сатып алу-сатуды даулау.", icon: "📑", prompt: "Мәмілені даулауға көмектес. Сұра: шарттың мәні, күні және мәміленің заңсыз саналу себептері." },
    { id: 17, title: "Қайта жоспарлауды заңдастыру", category: "Жылжымайтын мүлік", description: "Қайта жаңартылған нысанға меншік құқығын тану туралы талап арыз.", icon: "🏗️", prompt: "Қайта жоспарлауды заңдастыру туралы талап арыз құрастыр. Сұра: мекенжайы, не өзгертілді және сарапшының техникалық қорытындысы бар ма." },
    { id: 18, title: "Мүлікті бұғаттаудан шығару", category: "Атқарушылық іс жүргізу", description: "ЖСИ бұғаттауды заңсыз салса немесе қарыз өтелген болса.", icon: "🔓", prompt: "Бұғаттаудан шығару туралы талап арыз құрастыруға көмектес. Сұра: ЖСИ аты-жөні, өндіріс нөмірі және негіздеме." },
    { id: 19, title: "Қайтыс болу фактісін анықтау", category: "Ерекше іс жүргізу", description: "Қайтыс болу фактісі уақытында тіркелмесе, мұра алу үшін.", icon: "📜", prompt: "Сотқа қайтыс болу фактісін анықтау туралы арыз құрастыруға көмектес. Сұра: қайтыс болған адамның деректері, орны/уақыты және себебі." },
    { id: 20, title: "Салық органының әрекетіне шағым", category: "Салық", description: "Салықты қосымша есептеу немесе шоттарды бұғаттау туралы хабарламаны даулау.", icon: "📉", prompt: "Салық органының әрекетіне шағым құрастыр. Сұра: хабарлама нөмірі, компанияның БСН және келіспеушіліктің мәні." }
  ],
  en: [
    { id: 1, title: "Statement of claim for divorce", category: "Family Law", description: "Divorce through court (if there are children or no consent).", icon: "💍", prompt: "Help draft a divorce claim under RK laws. Ask: spouses' details, marriage date, children, and property dispute." },
    { id: 2, title: "Alimony recovery (court order)", category: "Family Law", description: "Simplified procedure for collecting a share of income for child support.", icon: "👶", prompt: "Draft an application for a court order to collect alimony. Ask: parents' and children's data, debtor's workplace." },
    { id: 3, title: "Determination of child's residence", category: "Family Law", description: "Dispute over who the child will live with after divorce.", icon: "🏠", prompt: "Help draft a claim determining the child's place of residence. Ask: child's age, living conditions, and attachment." },
    { id: 4, title: "Claim: Return of smartphone/electronics", category: "Consumer Rights", description: "Refund for a defective gadget or repair taking over 30 days.", icon: "📱", prompt: "Write a complaint to an electronics store. Ask: model, purchase date, defect, and repair time." },
    { id: 5, title: "Claim against airline (flight delay)", category: "Consumer Rights", description: "Recovery of a 3% fine per hour of delay and compensation for food/hotel.", icon: "✈️", prompt: "Draft a claim against an RK airline for a flight delay. Ask: flight number, delay time, and expenses incurred." },
    { id: 6, title: "Debt recovery by receipt", category: "Civil Law", description: "Demand for the return of money loaned to an individual.", icon: "💰", prompt: "Draft a claim for debt recovery by receipt. Ask: amount, loan date, return date, and debtor's full name." },
    { id: 7, title: "Cancel court order (Loan debt)", category: "Finance", description: "Objection to debt collection by a bank or microfinance organization (MFO).", icon: "💳", prompt: "Help draft an objection to a court order for a bank/MFO debt. Ask: order number, receipt date, and reason for disagreement." },
    { id: 8, title: "Claim against accident culprit", category: "Transport", description: "If insurance payment was not enough to fully restore the car.", icon: "🚗", prompt: "Draft a claim against the culprit of a traffic accident. Ask: damage assessment amount, insurance payment, and police protocol details." },
    { id: 9, title: "Appeal of Sergek fine", category: "Administrative Law", description: "Disputing a traffic violation notice if the owner was not driving.", icon: "📸", prompt: "Help appeal a video traffic fine. Ask: notice number, nature of violation, and evidence (lease agreement, insurance on another person)." },
    { id: 10, title: "Claim for eviction from apartment", category: "Real Estate", description: "Eviction of persons living without a contract or violating rules.", icon: "🔑", prompt: "Draft an eviction claim. Ask: address, who is living there, and on what grounds (or lack thereof)." },
    { id: 11, title: "Damage recovery for apartment flooding", category: "Real Estate", description: "Demand for repair compensation after flooding by upstairs neighbors.", icon: "💧", prompt: "Help draft a claim against neighbors for apartment flooding. Ask: date, presence of a housing act, and damage assessment amount." },
    { id: 12, title: "Claim for reinstatement at work", category: "Labor Law", description: "In case of illegal dismissal or redundancy without notice.", icon: "💼", prompt: "Draft a claim for job reinstatement and payment for forced absence. Ask: position, reason for dismissal, and order date." },
    { id: 13, title: "Recovery of unpaid salary", category: "Labor Law", description: "Demand to pay salary and compensation for unused vacation.", icon: "💵", prompt: "Help recover salary debt. Ask: company name, period of work, and debt amount." },
    { id: 14, title: "Protection of honor and dignity", category: "Civil Law", description: "Refutation of libel in social networks or media and moral damage recovery.", icon: "🗣️", prompt: "Draft a claim for protection of honor and dignity. Ask: where the lie was published, what facts are distorted, and moral damage amount." },
    { id: 15, title: "Complaint against a doctor (negligence)", category: "Healthcare", description: "Complaint to the Medical Control Committee for poor-quality treatment.", icon: "🏥", prompt: "Help write a complaint about a doctor's actions. Ask: clinic, appointment date, and what the error or harm was." },
    { id: 16, title: "Invalidation of transaction", category: "Real Estate", description: "Disputing a sale/purchase made under pressure or deceit.", icon: "📑", prompt: "Help dispute a transaction. Ask: nature of the contract, date, and reasons why the transaction is illegal (deceit, incapacity)." },
    { id: 17, title: "Legalization of redevelopment", category: "Real Estate", description: "Claim for recognition of ownership of a reconstructed object.", icon: "🏗️", prompt: "Draft a claim for the legalization of redevelopment. Ask: address, what was changed, and if there is an expert's technical conclusion." },
    { id: 18, title: "Lifting property attachment", category: "Enforcement Proceedings", description: "If a bailiff imposed an arrest illegally or the debt is already paid.", icon: "🔓", prompt: "Help draft a claim to lift an arrest. Ask: Bailiff's full name, proceeding number, and grounds for lifting." },
    { id: 19, title: "Establishment of the fact of death", category: "Special Proceedings", description: "For inheritance, if the fact of death was not registered in time.", icon: "📜", prompt: "Help draft an application to court to establish the fact of death. Ask: deceased's data, place/time, and reason for establishment." },
    { id: 20, title: "Complaint against tax authorities", category: "Taxes", description: "Disputing a notice of additional tax assessment or account blocking.", icon: "📉", prompt: "Draft a complaint against the tax authority's actions. Ask: notice number, company's BIN, and essence of tax disagreement." }
  ]
};

export default function TemplatesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { lang } = useLanguage(); // ПОЛУЧАЕМ ТЕКУЩИЙ ЯЗЫК ИЗ КОНТЕКСТА
  const t = uiTranslations[lang];
  const templates = templatesData[lang]; // Берем нужный массив шаблонов

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