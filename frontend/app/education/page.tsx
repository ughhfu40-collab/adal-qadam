"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GUIDES = [
  // --- СУДЫ И ПРОЦЕСС ---
  { id: 1, category: "Суд", title: "Как подать иск в суд: Пошаговый план", readTime: "5 мин", content: "1. Соберите доказательства (чеки, переписки).\n2. Соблюдите досудебный порядок (претензия).\n3. Оплатите госпошлину (1% физлица, 3% юрлица).\n4. Подайте через office.sud.kz." },
  { id: 2, category: "Суд", title: "Как вести себя на процессе?", readTime: "4 мин", content: "Обращайтесь к судье 'Уважаемый суд'. Не перебивайте оппонента. Заранее подготовьте тезисы выступления. Вы имеете право на аудиозапись (ст. 19 ГПК РК)." },
  { id: 3, category: "Суд", title: "Апелляция: Как обжаловать решение?", readTime: "6 мин", content: "У вас есть 1 месяц после вынесения решения в окончательной форме. Жалоба подается через суд, вынесший решение. Нужно указать, какие именно нормы закона нарушил судья." },
  
  // --- ФИНАНСЫ И ДОЛГИ ---
  { id: 4, category: "Деньги", title: "Звонят коллекторы: Ваши права", readTime: "3 мин", content: "Звонки разрешены только с 8:00 до 21:00, не более 3 раз в день. Угрозы и звонки родственникам (не гарантам) незаконны. Жалуйтесь в АРРФР." },
  { id: 5, category: "Деньги", title: "Блокировка счетов ЧСИ", readTime: "5 мин", content: "Если заблокировали спецсчет (пособия, алименты) — берите справку из банка и требуйте разблокировки. ЧСИ обязан снять арест со спецсчета в течение 3 дней." },
  { id: 6, category: "Деньги", title: "Банкротство физлиц в РК", readTime: "7 мин", content: "Доступно, если долг не гасится более 12 месяцев. Бывает внесудебное (через eGov) и судебное. Учитывайте последствия: запрет на кредиты на 5 лет." },
  { id: 7, category: "Деньги", title: "Кредитные каникулы: Как получить?", readTime: "4 мин", content: "Напишите заявление в банк, приложив доказательства ухудшения финположения (справка о потере работы, болезни). Банк обязан рассмотреть за 15 дней." },

  // --- ПОКУПКИ И ПРАВА ---
  { id: 8, category: "Покупки", title: "Возврат товара в 14 дней", readTime: "4 мин", content: "Сохраните чек и упаковку. Нельзя возвращать: сотки, лекарства, белье, метражные товары. Остальное — без проблем, даже если просто не понравился цвет." },
  { id: 9, category: "Покупки", title: "Обман на маркетплейсах", readTime: "5 мин", content: "Если пришел не тот товар — фиксируйте на видео в пункте выдачи. Пишите претензию в поддержку и требуйте чарджбэк через банк, если площадка молчит." },
  { id: 10, category: "Покупки", title: "Гарантийный ремонт: Сроки", readTime: "4 мин", content: "Ремонт не должен превышать 20 дней (если иное не в договоре). На время ремонта вы имеете право требовать подменный товар (для техники)." },

  // --- НЕДВИЖИМОСТЬ И ЖИЛЬЕ ---
  { id: 11, category: "Жилье", title: "Затопили соседи: План действий", readTime: "5 мин", content: "1. Акт от ОСИ/КСК (обязательно!).\n2. Фото/видео.\n3. Оценка ущерба.\n4. Претензия и суд. Не начинайте ремонт до суда или оценки!" },
  { id: 12, category: "Жилье", title: "Договор аренды: На что смотреть?", readTime: "6 мин", content: "Проверяйте документы на собственность. Фиксируйте залог и состояние мебели на фото. Укажите срок уведомления о выселении (минимум 1 месяц)." },
  { id: 13, category: "Жилье", title: "Узаконивание перепланировки", readTime: "8 мин", content: "Сначала эскизный проект, затем разрешение в АПЗ, после — ввод в эксплуатацию. Если уже сделали — только через суд и штраф." },
  { id: 14, category: "Жилье", title: "Споры с ОСИ/КСК", readTime: "5 мин", content: "Вы имеете право требовать отчет о расходах каждые полгода. Если деньги тратятся нецелевым образом — жалуйтесь в Жилищную инспекцию города." },

  // --- СЕМЬЯ ---
  { id: 15, category: "Семья", title: "Алименты: Как взыскать?", readTime: "4 мин", content: "25% на одного, 33% на двоих, 50% на троих. Если отец не работает — считается от средней зарплаты по РК (~350-400к тенге)." },
  { id: 16, category: "Семья", title: "Раздел имущества при разводе", readTime: "6 мин", content: "Все, что куплено в браке — 50/50. Подарки, наследство и добрачное имущество не делятся. Доли могут изменить, если есть дети." },
  { id: 17, category: "Семья", title: "Лишение родительских прав", readTime: "7 мин", content: "Крайняя мера. Основания: неуплата алиментов > 6 мес, насилие, алкоголизм. Нужно заключение Опеки и решение суда." },

  // --- РАБОТА ---
  { id: 18, category: "Работа", title: "Незаконное увольнение", readTime: "5 мин", content: "Срок обжалования — 1 год. Сначала Согласительная комиссия (обязательно!), потом суд. Требуйте восстановления и зарплату за прогул." },
  { id: 19, category: "Работа", title: "Задержка зарплаты: Пеня", readTime: "3 мин", content: "За каждый день задержки работодатель обязан платить пеню (ставка НБРК * 1.25). Пишите жалобу в Инспекцию труда через eOtinish." },
  { id: 20, category: "Работа", title: "Декрет и сохранение места", readTime: "4 мин", content: "Вас не имеют права уволить во время беременности и отпуска по уходу за ребенком до 3 лет. Место и должность сохраняются за вами." },

  // --- АВТО ---
  { id: 21, category: "Авто", title: "Обжалование штрафа Сергек", readTime: "4 мин", content: "У вас есть 10 дней. Если за рулем были не вы — предоставьте страховку другого лица или договор аренды. Пишите в УАП ДП вашего города." },
  { id: 22, category: "Авто", title: "ДТП: Что делать на месте?", readTime: "5 мин", content: "Не уезжайте! Вызывайте полицию (102). Снимите видео положения машин. Оформите Европротокол, если ущерб до 100 МРП и нет пострадавших." },
  { id: 23, category: "Авто", title: "Страховая платит мало", readTime: "6 мин", content: "Делайте независимую оценку. Пишите претензию страховщику. Если не помогло — к Страховому омбудсмену (это бесплатно)." },

  // --- ЦИФРОВЫЕ ПРАВА И СЕТЬ ---
  { id: 24, category: "IT", title: "Защита персональных данных", readTime: "4 мин", content: "Никто не имеет права требовать фото вашего удостоверения без согласия. Жалуйтесь в Комитет информбезопасности РК за утечки." },
  { id: 25, category: "IT", title: "Мошенники и онлайн-кредиты", readTime: "5 мин", content: "Если на вас оформили кредит без ведома — сразу заявление в полицию и в МФО. Требуйте записи биометрии. Установите 'Добровольный отказ от кредитов' в eGov." },
  { id: 26, category: "IT", title: "Клевета в соцсетях", readTime: "5 мин", content: "Статья 73-3 КоАП РК. Фиксируйте скриншоты (лучше у нотариуса). Можно требовать удаления и компенсации морального вреда через суд." },

  // --- МЕДИЦИНА И НАЛОГИ ---
  { id: 27, category: "Медицина", title: "Врачебная ошибка", readTime: "6 мин", content: "Жалуйтесь в Комитет медконтроля. Требуйте независимую экспертизу. Врачи несут ответственность за халатность по ст. 317 УК РК." },
  { id: 28, category: "Медицина", title: "Бесплатные лекарства (ОСМС)", readTime: "4 мин", content: "Если вы застрахованы, список бесплатных лекарств огромен. Если в поликлинике говорят 'нет' — звоните в контакт-центр 1406." },
  { id: 29, category: "Налоги", title: "Налоговые вычеты для физлиц", readTime: "5 мин", content: "Вы можете уменьшить налог (ИПН) на медицину, обучение и проценты по ипотеке в Отбасы Банке. Подайте заявление в бухгалтерию." },
  { id: 30, category: "Налоги", title: "Налог на транспорт и жилье", readTime: "3 мин", content: "Срок оплаты транспорта — до 1 апреля. Жилье — до 1 октября. Проверяйте задолженность в приложении e-Salyq Azamat." }
];

const DICTIONARY = [
  { term: "Истец", definition: "Лицо, подавшее иск в суд за защитой своих прав." },
  { term: "Ответчик", definition: "Лицо, к которому предъявлен иск (предполагаемый нарушитель)." },
  { term: "Госпошлина", definition: "Сбор в бюджет за рассмотрение дела в суде (обычно 1% от суммы)." },
  { term: "ЧСИ", definition: "Частный судебный исполнитель. Блокирует счета и взыскивает долги." },
  { term: "Апелляция", definition: "Жалоба на решение суда, которое еще не вступило в силу." },
  { term: "Кассация", definition: "Пересмотр дела в Верховном Суде РК." },
  { term: "МРП", definition: "Месячный расчетный показатель (база для штрафов)." },
  { term: "ЭЦП", definition: "Цифровая подпись для eGov и Судебного кабинета." },
  { term: "Медиация", definition: "Мирное решение спора через посредника без суда." },
  { term: "Неустойка", definition: "Денежная сумма (штраф или пеня) за нарушение договора." },
  { term: "ОСИ", definition: "Объединение собственников имущества (вместо КСК)." },
  { term: "ГПК РК", definition: "Гражданский процессуальный кодекс Республики Казахстан." },
  { term: "УПК РК", definition: "Уголовно-процессуальный кодекс." },
  { term: "КоАП", definition: "Кодекс об административных правонарушениях (штрафы ПДД и др.)." },
  { term: "Резидент", definition: "Лицо, постоянно проживающее в РК (важно для налогов)." },
  { term: "Оферта", definition: "Предложение заключить договор на определенных условиях." },
  { term: "Акцепт", definition: "Согласие на условия оферты (подписание или оплата)." },
  { term: "Форс-мажор", definition: "Обстоятельства непреодолимой силы (война, паводок)." },
  { term: "Доверенность", definition: "Документ, дающий право действовать от имени другого лица." },
  { term: "БИН/ИИН", definition: "Уникальные номера компаний и граждан в базе РК." },
  { term: "Обременение", definition: "Запрет на продажу имущества (залог в банке, арест)." },
  { term: "Понятой", definition: "Незаинтересованное лицо, присутствующее при обыске или замере." },
  { term: "Свидетель", definition: "Лицо, видевшее факт нарушения своими глазами." },
  { term: "Претензия", definition: "Досудебное требование исправить нарушение." },
  { term: "Ходатайство", definition: "Официальная просьба к судье (например, вызвать свидетеля)." },
  { term: "Приостановление", definition: "Временная остановка дела в суде по уважительной причине." },
  { term: "Третейский суд", definition: "Негосударственный суд для коммерческих споров." },
  { term: "Моральный вред", definition: "Компенсация за душевные и физические страдания." },
  { term: "Упущенная выгода", definition: "Доход, который вы не получили из-за нарушения ваших прав." },
  { term: "Согласительная комиссия", definition: "Обязательный этап перед судом в трудовых спорах." }
];

export default function EducationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'guides' | 'dictionary'>('guides');
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);

  const filteredGuides = GUIDES.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDictionary = DICTIONARY.filter(d => d.term.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-emerald-500">🎓</span> База знаний
            </h1>
            <p className="text-gray-400 mt-2">Энциклопедия прав гражданина РК: {GUIDES.length} статей и {DICTIONARY.length} терминов</p>
          </div>
          <button 
            onClick={() => router.push('/profile')} 
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all"
          >
            В профиль
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex bg-[#0c1527] p-1 rounded-2xl border border-blue-500/20 shrink-0">
            <button onClick={() => setActiveTab('guides')} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'guides' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>📚 Статьи</button>
            <button onClick={() => setActiveTab('dictionary')} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'dictionary' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>📖 Словарь</button>
          </div>
          <div className="relative flex-1">
            <input type="text" placeholder="Поиск (налоги, алименты, штрафы)..." className="w-full bg-[#0c1527] border border-blue-500/20 rounded-2xl p-3.5 pl-12 text-white outline-none focus:border-emerald-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <svg className="w-5 h-5 text-gray-500 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {activeTab === 'guides' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map(guide => (
              <div key={guide.id} className="bg-[#0f192e] border border-emerald-500/10 p-6 rounded-3xl hover:border-emerald-500/40 transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full uppercase tracking-tighter">{guide.category}</span>
                  <span className="text-[10px] text-gray-500">{guide.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-emerald-300 transition-colors">{guide.title}</h3>
                <div className={`text-sm text-gray-400 leading-relaxed ${expandedGuide === guide.id ? '' : 'line-clamp-2'}`}>
                   {guide.content}
                </div>
                <button onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)} className="mt-4 text-emerald-500 text-xs font-bold hover:underline text-left">
                   {expandedGuide === guide.id ? "Свернуть" : "Развернуть полностью ↓"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDictionary.map((item, idx) => (
              <div key={idx} className="bg-[#0c1527] border border-blue-500/10 p-5 rounded-2xl hover:bg-[#131e36] transition-all">
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