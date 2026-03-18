"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../LanguageContext'; // ИМПОРТ КОНТЕКСТА

// --- СЛОВАРИ ИНТЕРФЕЙСА ---
const uiTranslations = {
  ru: {
    title: "База знаний",
    subtitle: "Энциклопедия прав гражданина РК:",
    articlesCount: "статей",
    termsCount: "терминов",
    toProfile: "В профиль",
    tabArticles: "📚 Статьи",
    tabDict: "📖 Словарь",
    searchPlaceholder: "Поиск (налоги, алименты, штрафы)...",
    collapse: "Свернуть",
    expand: "Развернуть полностью ↓"
  },
  kk: {
    title: "Білім базасы",
    subtitle: "ҚР азаматының құқықтары энциклопедиясы:",
    articlesCount: "мақала",
    termsCount: "термин",
    toProfile: "Профильге",
    tabArticles: "📚 Мақалалар",
    tabDict: "📖 Сөздік",
    searchPlaceholder: "Іздеу (салық, алимент, айыппұл)...",
    collapse: "Жасыру",
    expand: "Толық ашу ↓"
  },
  en: {
    title: "Knowledge Base",
    subtitle: "Encyclopedia of RK citizen rights:",
    articlesCount: "articles",
    termsCount: "terms",
    toProfile: "To Profile",
    tabArticles: "📚 Articles",
    tabDict: "📖 Dictionary",
    searchPlaceholder: "Search (taxes, alimony, fines)...",
    collapse: "Collapse",
    expand: "Expand fully ↓"
  }
};

// --- СТАТЬИ НА 3 ЯЗЫКАХ ---
const guidesData = {
  ru: [
    { id: 1, category: "Суд", title: "Как подать иск в суд: Пошаговый план", readTime: "5 мин", content: "1. Соберите доказательства (чеки, переписки).\n2. Соблюдите досудебный порядок (претензия).\n3. Оплатите госпошлину (1% физлица, 3% юрлица).\n4. Подайте через office.sud.kz." },
    { id: 2, category: "Суд", title: "Как вести себя на процессе?", readTime: "4 мин", content: "Обращайтесь к судье 'Уважаемый суд'. Не перебивайте оппонента. Заранее подготовьте тезисы выступления. Вы имеете право на аудиозапись (ст. 19 ГПК РК)." },
    { id: 3, category: "Суд", title: "Апелляция: Как обжаловать решение?", readTime: "6 мин", content: "У вас есть 1 месяц после вынесения решения в окончательной форме. Жалоба подается через суд, вынесший решение. Нужно указать, какие именно нормы закона нарушил судья." },
    { id: 4, category: "Деньги", title: "Звонят коллекторы: Ваши права", readTime: "3 мин", content: "Звонки разрешены только с 8:00 до 21:00, не более 3 раз в день. Угрозы и звонки родственникам (не гарантам) незаконны. Жалуйтесь в АРРФР." },
    { id: 5, category: "Деньги", title: "Блокировка счетов ЧСИ", readTime: "5 мин", content: "Если заблокировали спецсчет (пособия, алименты) — берите справку из банка и требуйте разблокировки. ЧСИ обязан снять арест со спецсчета в течение 3 дней." },
    { id: 6, category: "Деньги", title: "Банкротство физлиц в РК", readTime: "7 мин", content: "Доступно, если долг не гасится более 12 месяцев. Бывает внесудебное (через eGov) и судебное. Учитывайте последствия: запрет на кредиты на 5 лет." },
    { id: 7, category: "Деньги", title: "Кредитные каникулы: Как получить?", readTime: "4 мин", content: "Напишите заявление в банк, приложив доказательства ухудшения финположения (справка о потере работы, болезни). Банк обязан рассмотреть за 15 дней." },
    { id: 8, category: "Покупки", title: "Возврат товара в 14 дней", readTime: "4 мин", content: "Сохраните чек и упаковку. Нельзя возвращать: сотки, лекарства, белье, метражные товары. Остальное — без проблем, даже если просто не понравился цвет." },
    { id: 9, category: "Покупки", title: "Обман на маркетплейсах", readTime: "5 мин", content: "Если пришел не тот товар — фиксируйте на видео в пункте выдачи. Пишите претензию в поддержку и требуйте чарджбэк через банк, если площадка молчит." },
    { id: 10, category: "Покупки", title: "Гарантийный ремонт: Сроки", readTime: "4 мин", content: "Ремонт не должен превышать 20 дней (если иное не в договоре). На время ремонта вы имеете право требовать подменный товар (для техники)." },
    { id: 11, category: "Жилье", title: "Затопили соседи: План действий", readTime: "5 мин", content: "1. Акт от ОСИ/КСК (обязательно!).\n2. Фото/видео.\n3. Оценка ущерба.\n4. Претензия и суд. Не начинайте ремонт до суда или оценки!" },
    { id: 12, category: "Жилье", title: "Договор аренды: На что смотреть?", readTime: "6 мин", content: "Проверяйте документы на собственность. Фиксируйте залог и состояние мебели на фото. Укажите срок уведомления о выселении (минимум 1 месяц)." },
    { id: 13, category: "Жилье", title: "Узаконивание перепланировки", readTime: "8 мин", content: "Сначала эскизный проект, затем разрешение в АПЗ, после — ввод в эксплуатацию. Если уже сделали — только через суд и штраф." },
    { id: 14, category: "Жилье", title: "Споры с ОСИ/КСК", readTime: "5 мин", content: "Вы имеете право требовать отчет о расходах каждые полгода. Если деньги тратятся нецелевым образом — жалуйтесь в Жилищную инспекцию города." },
    { id: 15, category: "Семья", title: "Алименты: Как взыскать?", readTime: "4 мин", content: "25% на одного, 33% на двоих, 50% на троих. Если отец не работает — считается от средней зарплаты по РК (~350-400к тенге)." },
    { id: 16, category: "Семья", title: "Раздел имущества при разводе", readTime: "6 мин", content: "Все, что куплено в браке — 50/50. Подарки, наследство и добрачное имущество не делятся. Доли могут изменить, если есть дети." },
    { id: 17, category: "Семья", title: "Лишение родительских прав", readTime: "7 мин", content: "Крайняя мера. Основания: неуплата алиментов > 6 мес, насилие, алкоголизм. Нужно заключение Опеки и решение суда." },
    { id: 18, category: "Работа", title: "Незаконное увольнение", readTime: "5 мин", content: "Срок обжалования — 1 год. Сначала Согласительная комиссия (обязательно!), потом суд. Требуйте восстановления и зарплату за прогул." },
    { id: 19, category: "Работа", title: "Задержка зарплаты: Пеня", readTime: "3 мин", content: "За каждый день задержки работодатель обязан платить пеню (ставка НБРК * 1.25). Пишите жалобу в Инспекцию труда через eOtinish." },
    { id: 20, category: "Работа", title: "Декрет и сохранение места", readTime: "4 мин", content: "Вас не имеют права уволить во время беременности и отпуска по уходу за ребенком до 3 лет. Место и должность сохраняются за вами." },
    { id: 21, category: "Авто", title: "Обжалование штрафа Сергек", readTime: "4 мин", content: "У вас есть 10 дней. Если за рулем были не вы — предоставьте страховку другого лица или договор аренды. Пишите в УАП ДП вашего города." },
    { id: 22, category: "Авто", title: "ДТП: Что делать на месте?", readTime: "5 мин", content: "Не уезжайте! Вызывайте полицию (102). Снимите видео положения машин. Оформите Европротокол, если ущерб до 100 МРП и нет пострадавших." },
    { id: 23, category: "Авто", title: "Страховая платит мало", readTime: "6 мин", content: "Делайте независимую оценку. Пишите претензию страховщику. Если не помогло — к Страховому омбудсмену (это бесплатно)." },
    { id: 24, category: "IT", title: "Защита персональных данных", readTime: "4 мин", content: "Никто не имеет права требовать фото вашего удостоверения без согласия. Жалуйтесь в Комитет информбезопасности РК за утечки." },
    { id: 25, category: "IT", title: "Мошенники и онлайн-кредиты", readTime: "5 мин", content: "Если на вас оформили кредит без ведома — сразу заявление в полицию и в МФО. Требуйте записи биометрии. Установите 'Добровольный отказ от кредитов' в eGov." },
    { id: 26, category: "IT", title: "Клевета в соцсетях", readTime: "5 мин", content: "Статья 73-3 КоАП РК. Фиксируйте скриншоты (лучше у нотариуса). Можно требовать удаления и компенсации морального вреда через суд." },
    { id: 27, category: "Медицина", title: "Врачебная ошибка", readTime: "6 мин", content: "Жалуйтесь в Комитет медконтроля. Требуйте независимую экспертизу. Врачи несут ответственность за халатность по ст. 317 УК РК." },
    { id: 28, category: "Медицина", title: "Бесплатные лекарства (ОСМС)", readTime: "4 мин", content: "Если вы застрахованы, список бесплатных лекарств огромен. Если в поликлинике говорят 'нет' — звоните в контакт-центр 1406." },
    { id: 29, category: "Налоги", title: "Налоговые вычеты для физлиц", readTime: "5 мин", content: "Вы можете уменьшить налог (ИПН) на медицину, обучение и проценты по ипотеке в Отбасы Банке. Подайте заявление в бухгалтерию." },
    { id: 30, category: "Налоги", title: "Налог на транспорт и жилье", readTime: "3 мин", content: "Срок оплаты транспорта — до 1 апреля. Жилье — до 1 октября. Проверяйте задолженность в приложении e-Salyq Azamat." }
  ],
  kk: [
    { id: 1, category: "Сот", title: "Сотқа қалай талап арыз беру керек", readTime: "5 мин", content: "1. Дәлелдер жинаңыз. 2. Сотқа дейінгі тәртіпті сақтаңыз. 3. Мемлекеттік баж төлеңіз. 4. office.sud.kz арқылы тапсырыңыз." },
    { id: 2, category: "Сот", title: "Сотта өзін қалай ұстау керек?", readTime: "4 мин", content: "Судьяға 'Құрметті сот' деп жүгініңіз. Оппоненттің сөзін бөлмеңіз. Аудиожазба жасауға құқығыңыз бар (ҚР АІЖК 19-бабы)." },
    { id: 3, category: "Сот", title: "Апелляция: Шешімге қалай шағымдануға болады?", readTime: "6 мин", content: "Шешім шыққаннан кейін 1 ай уақытыңыз бар. Шағым шешім шығарған сот арқылы беріледі." },
    { id: 4, category: "Ақша", title: "Коллекторлар қоңырау шалса", readTime: "3 мин", content: "Қоңыраулар 8:00-ден 21:00-ге дейін, күніне 3 реттен артық емес рұқсат етілген. Қорқытулар заңсыз." },
    { id: 5, category: "Ақша", title: "ЖСИ шоттарды бұғаттауы", readTime: "5 мин", content: "Арнайы шот бұғатталса (жәрдемақы, алимент) — банктен анықтама алып, бұғаттауды шешуді талап етіңіз." },
    { id: 6, category: "Ақша", title: "ҚР-дағы жеке тұлғалардың банкроттығы", readTime: "7 мин", content: "Егер қарыз 12 айдан астам өтелмесе қолжетімді. Назар аударыңыз: 5 жылға несие алуға тыйым салынады." },
    { id: 7, category: "Ақша", title: "Несиелік демалыс: Қалай алуға болады?", readTime: "4 мин", content: "Қаржылық жағдайыңыздың нашарлағанын дәлелдейтін құжаттармен банкке өтініш жазыңыз." },
    { id: 8, category: "Сатып алу", title: "Тауарды 14 күнде қайтару", readTime: "4 мин", content: "Чек пен қаптаманы сақтаңыз. Дәрі-дәрмек, іш киім, телефондар қайтарылмайды." },
    { id: 9, category: "Сатып алу", title: "Маркетплейстердегі алдау", readTime: "5 мин", content: "Басқа тауар келсе — видеоға түсіріңіз. Қолдау қызметіне шағымданып, банк арқылы чарджбэк талап етіңіз." },
    { id: 10, category: "Сатып алу", title: "Кепілдік жөндеу мерзімі", readTime: "4 мин", content: "Жөндеу 20 күннен аспауы тиіс. Осы уақытта ауыстыратын тауар талап етуге құқығыңыз бар." },
    { id: 11, category: "Тұрғын үй", title: "Көршілер су басса", readTime: "5 мин", content: "1. МИБ/ПИК актісі. 2. Фото/видео. 3. Залалды бағалау. 4. Талап арыз. Жөндеуді сотқа дейін бастамаңыз!" },
    { id: 12, category: "Тұрғын үй", title: "Жалға алу шарты: Неге назар аудару керек?", readTime: "6 мин", content: "Меншік құжаттарын тексеріңіз. Кепілақы мен жиһаздың күйін суретке түсіріңіз." },
    { id: 13, category: "Тұрғын үй", title: "Қайта жоспарлауды заңдастыру", readTime: "8 мин", content: "Алдымен эскиздік жоба, содан кейін рұқсат алу қажет. Егер жасап қойсаңыз — тек сот және айыппұл арқылы." },
    { id: 14, category: "Тұрғын үй", title: "МИБ/ПИК-пен даулар", readTime: "5 мин", content: "Әр жарты жыл сайын шығындар туралы есеп талап етуге құқығыңыз бар." },
    { id: 15, category: "Отбасы", title: "Алимент: Қалай өндіруге болады?", readTime: "4 мин", content: "Бір балаға 25%, екеуіне 33%, үшеуіне 50%. Егер әкесі жұмыс істемесе — ҚР бойынша орташа жалақыдан есептеледі." },
    { id: 16, category: "Отбасы", title: "Ажырасу кезінде мүлікті бөлу", readTime: "6 мин", content: "Некеде сатып алынғанның бәрі — 50/50. Сыйлықтар мен мұра бөлінбейді." },
    { id: 17, category: "Отбасы", title: "Ата-ана құқығынан айыру", readTime: "7 мин", content: "Ең шеткі шара. Негіздер: алимент төлемеу > 6 ай, зорлық-зомбылық, маскүнемдік." },
    { id: 18, category: "Жұмыс", title: "Заңсыз жұмыстан шығару", readTime: "5 мин", content: "Шағымдану мерзімі — 1 жыл. Алдымен Келісім комиссиясы, сосын сот." },
    { id: 19, category: "Жұмыс", title: "Жалақыны кешіктіру: Өсімпұл", readTime: "3 мин", content: "Кешіктірілген әр күн үшін жұмыс беруші өсімпұл төлеуге міндетті." },
    { id: 20, category: "Жұмыс", title: "Декрет және орынды сақтау", readTime: "4 мин", content: "Жүктілік және бала 3 жасқа толғанша күтім жасау демалысы кезінде сізді жұмыстан шығаруға құқығы жоқ." },
    { id: 21, category: "Авто", title: "Сергек айыппұлын шағымдану", readTime: "4 мин", content: "Сізде 10 күн бар. Егер рөлде сіз болмасаңыз — басқа адамның сақтандыруын ұсыныңыз." },
    { id: 22, category: "Авто", title: "ЖКО: Оқиға орнында не істеу керек?", readTime: "5 мин", content: "Кетіп қалмаңыз! Полиция шақырыңыз (102). Егер залал 100 АЕК-ке дейін болса, Европротокол рәсімдеңіз." },
    { id: 23, category: "Авто", title: "Сақтандыру аз төлесе", readTime: "6 мин", content: "Тәуелсіз бағалау жасаңыз. Сақтандырушыға шағым жазыңыз." },
    { id: 24, category: "IT", title: "Дербес деректерді қорғау", readTime: "4 мин", content: "Ешкім сіздің келісіміңізсіз жеке куәлігіңіздің суретін талап етуге құқылы емес." },
    { id: 25, category: "IT", title: "Алаяқтар және онлайн-несиелер", readTime: "5 мин", content: "Егер сізге несие рәсімделсе — бірден полицияға арыз жазыңыз." },
    { id: 26, category: "IT", title: "Желідегі жала жабу", readTime: "5 мин", content: "ҚР ӘҚБтК 73-3 бабы. Скриншоттарды бекітіп, сот арқылы өтемақы талап етіңіз." },
    { id: 27, category: "Медицина", title: "Дәрігерлік қателік", readTime: "6 мин", content: "Медициналық бақылау комитетіне шағымданыңыз. Тәуелсіз сараптама талап етіңіз." },
    { id: 28, category: "Медицина", title: "Тегін дәрі-дәрмектер (МӘМС)", readTime: "4 мин", content: "Егер сіз сақтандырылған болсаңыз, тегін дәрі-дәрмектер тізімі үлкен. 1406 нөміріне қоңырау шалыңыз." },
    { id: 29, category: "Салық", title: "Салық шегерімдері", readTime: "5 мин", content: "Медицина, оқу және ипотека бойынша салықты (ЖТС) азайта аласыз." },
    { id: 30, category: "Салық", title: "Көлік және мүлік салығы", readTime: "3 мин", content: "Көлік салығын төлеу мерзімі — 1 сәуірге дейін. Тұрғын үй — 1 қазанға дейін." }
  ],
  en: [
    { id: 1, category: "Court", title: "How to file a lawsuit", readTime: "5 min", content: "1. Collect evidence. 2. Observe pre-trial order. 3. Pay state fee. 4. Submit via office.sud.kz." },
    { id: 2, category: "Court", title: "How to behave in court", readTime: "4 min", content: "Address the judge as 'Your Honor'. Do not interrupt. You have the right to audio recording." },
    { id: 3, category: "Court", title: "Appeal: How to challenge a decision", readTime: "6 min", content: "You have 1 month after the final decision. The complaint is filed through the court that made the decision." },
    { id: 4, category: "Money", title: "Collectors calling: Your rights", readTime: "3 min", content: "Calls are allowed only from 8:00 to 21:00. Threats and calls to relatives are illegal." },
    { id: 5, category: "Money", title: "Bailiff account blocking", readTime: "5 min", content: "If a special account (alimony, benefits) is blocked, get a certificate from the bank and demand unblocking." },
    { id: 6, category: "Money", title: "Bankruptcy of individuals in RK", readTime: "7 min", content: "Available if debt is not paid for over 12 months. Consequence: 5-year ban on loans." },
    { id: 7, category: "Money", title: "Credit holidays", readTime: "4 min", content: "Write an application to the bank with proof of financial deterioration." },
    { id: 8, category: "Purchases", title: "Product return in 14 days", readTime: "4 min", content: "Keep the receipt. Phones, medicines, and underwear cannot be returned. Everything else is fine." },
    { id: 9, category: "Purchases", title: "Fraud on marketplaces", readTime: "5 min", content: "Record unpacking on video. File a claim with support and demand a chargeback via the bank." },
    { id: 10, category: "Purchases", title: "Warranty repair terms", readTime: "4 min", content: "Repair should not exceed 20 days. You have the right to demand a replacement device during this time." },
    { id: 11, category: "Housing", title: "Flooded by neighbors", readTime: "5 min", content: "1. Act from management company. 2. Photo/video. 3. Damage assessment. 4. Lawsuit." },
    { id: 12, category: "Housing", title: "Rental agreement", readTime: "6 min", content: "Check property documents. Fix deposit and furniture condition on photo." },
    { id: 13, category: "Housing", title: "Legalization of redevelopment", readTime: "8 min", content: "First draft design, then permission, then commissioning. If already done - only through court." },
    { id: 14, category: "Housing", title: "Disputes with management company", readTime: "5 min", content: "You have the right to demand an expense report every six months." },
    { id: 15, category: "Family", title: "Alimony: How to collect?", readTime: "4 min", content: "25% for one child, 33% for two, 50% for three. If father is unemployed, based on average RK salary." },
    { id: 16, category: "Family", title: "Division of property upon divorce", readTime: "6 min", content: "Everything bought in marriage is 50/50. Gifts and inheritance are not divided." },
    { id: 17, category: "Family", title: "Deprivation of parental rights", readTime: "7 min", content: "Extreme measure. Grounds: unpaid alimony > 6 months, violence, alcoholism." },
    { id: 18, category: "Work", title: "Illegal dismissal", readTime: "5 min", content: "Appeal period is 1 year. Conciliation commission is mandatory before court." },
    { id: 19, category: "Work", title: "Salary delay penalty", readTime: "3 min", content: "The employer must pay a penalty for each day of delay. File a complaint with the Labor Inspectorate." },
    { id: 20, category: "Work", title: "Maternity leave and job security", readTime: "4 min", content: "You cannot be fired during pregnancy and childcare leave up to 3 years." },
    { id: 21, category: "Auto", title: "Appeal Sergek fine", readTime: "4 min", content: "You have 10 days. Provide insurance of another person if you weren't driving." },
    { id: 22, category: "Auto", title: "Accident: What to do?", readTime: "5 min", content: "Do not leave! Call police. Issue a Europrotocol if damage is minor." },
    { id: 23, category: "Auto", title: "Insurance pays too little", readTime: "6 min", content: "Do an independent assessment and complain to the Insurance Ombudsman." },
    { id: 24, category: "IT", title: "Personal data protection", readTime: "4 min", content: "No one has the right to demand your ID photo without consent." },
    { id: 25, category: "IT", title: "Scammers and online loans", readTime: "5 min", content: "If a loan is issued in your name, file a police report immediately." },
    { id: 26, category: "IT", title: "Slander in social networks", readTime: "5 min", content: "Article 73-3 of Administrative Code. Take screenshots and demand compensation in court." },
    { id: 27, category: "Medicine", title: "Medical error", readTime: "6 min", content: "Complain to the Medical Control Committee. Demand an independent examination." },
    { id: 28, category: "Medicine", title: "Free medicines (OSMS)", readTime: "4 min", content: "If insured, the list of free drugs is huge. Call 1406 if refused." },
    { id: 29, category: "Taxes", title: "Tax deductions for individuals", readTime: "5 min", content: "You can reduce income tax on medicine, education, and mortgage interest." },
    { id: 30, category: "Taxes", title: "Transport and property tax", readTime: "3 min", content: "Transport tax deadline: April 1. Property tax: October 1." }
  ]
};

// --- СЛОВАРЬ ТЕРМИНОВ НА 3 ЯЗЫКАХ ---
const dictData = {
  ru: [
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
    { term: "КоАП", definition: "Кодекс об административных правонарушениях." },
    { term: "Резидент", definition: "Лицо, постоянно проживающее в РК (важно для налогов)." },
    { term: "Оферта", definition: "Предложение заключить договор на определенных условиях." },
    { term: "Акцепт", definition: "Согласие на условия оферты (подписание или оплата)." },
    { term: "Форс-мажор", definition: "Обстоятельства непреодолимой силы (война, паводок)." },
    { term: "Доверенность", definition: "Документ, дающий право действовать от имени другого лица." },
    { term: "БИН/ИИН", definition: "Уникальные номера компаний и граждан в базе РК." },
    { term: "Обременение", definition: "Запрет на продажу имущества (залог в банке, арест)." },
    { term: "Понятой", definition: "Незаинтересованное лицо, присутствующее при обыске." },
    { term: "Свидетель", definition: "Лицо, видевшее факт нарушения своими глазами." },
    { term: "Претензия", definition: "Досудебное требование исправить нарушение." },
    { term: "Ходатайство", definition: "Официальная просьба к судье (например, вызвать свидетеля)." },
    { term: "Приостановление", definition: "Временная остановка дела в суде по уважительной причине." },
    { term: "Третейский суд", definition: "Негосударственный суд для коммерческих споров." },
    { term: "Моральный вред", definition: "Компенсация за душевные и физические страдания." },
    { term: "Упущенная выгода", definition: "Доход, который вы не получили из-за нарушения ваших прав." },
    { term: "Согласительная комиссия", definition: "Обязательный этап перед судом в трудовых спорах." }
  ],
  kk: [
    { term: "Талапкер", definition: "Өз құқығын қорғау үшін сотқа талап арыз берген тұлға." },
    { term: "Жауапкер", definition: "Талап арыз қойылған тұлға (болжамды бұзушы)." },
    { term: "Мемлекеттік баж", definition: "Сотта істі қарағаны үшін бюджетке төленетін алым." },
    { term: "ЖСИ", definition: "Жеке сот орындаушысы. Шоттарды бұғаттап, қарызды өндіреді." },
    { term: "Апелляция", definition: "Заңды күшіне енбеген сот шешіміне шағым." },
    { term: "Кассация", definition: "ҚР Жоғарғы Сотында істі қайта қарау." },
    { term: "АЕК", definition: "Айлық есептік көрсеткіш (айыппұлдар үшін база)." },
    { term: "ЭЦҚ", definition: "eGov және Сот кабинетіне арналған электрондық цифрлық қолтаңба." },
    { term: "Медиация", definition: "Дауды сотсыз, делдал арқылы бейбіт жолмен шешу." },
    { term: "Тұрақсыздық айыбы", definition: "Шартты бұзғаны үшін төленетін ақша (айыппұл немесе өсімпұл)." },
    { term: "МИБ", definition: "Мүлік иелерінің бірлестігі (ПИК орнына)." },
    { term: "АІЖК", definition: "Қазақстан Республикасының Азаматтық процестік кодексі." },
    { term: "ҚІЖК", definition: "Қылмыстық-процестік кодекс." },
    { term: "ӘҚБтК", definition: "Әкімшілік құқық бұзушылық туралы кодекс." },
    { term: "Резидент", definition: "ҚР-да тұрақты тұратын тұлға." },
    { term: "Оферта", definition: "Шартты белгілі бір шарттармен жасасуға ұсыныс." },
    { term: "Акцепт", definition: "Оферта шарттарымен келісу (қол қою немесе төлеу)." },
    { term: "Форс-мажор", definition: "Еңсерілмейтін күш жағдайлары (соғыс, су тасқыны)." },
    { term: "Сенімхат", definition: "Басқа тұлғаның атынан әрекет ету құқығын беретін құжат." },
    { term: "БСН/ЖСН", definition: "ҚР базасындағы компаниялар мен азаматтардың бірегей нөмірлері." },
    { term: "Ауыртпалық", definition: "Мүлікті сатуға тыйым салу (банктегі кепіл, бұғаттау)." },
    { term: "Куәгер", definition: "Тінту немесе өлшеу кезінде қатысатын мүдделі емес тұлға." },
    { term: "Куә", definition: "Бұзушылық фактісін өз көзімен көрген адам." },
    { term: "Наразылық", definition: "Бұзушылықты түзету туралы сотқа дейінгі талап." },
    { term: "Өтінішхат", definition: "Судьяға ресми өтініш (мысалы, куәгерді шақыру)." },
    { term: "Тоқтата тұру", definition: "Дәлелді себеппен соттағы істі уақытша тоқтату." },
    { term: "Төрелік сот", definition: "Коммерциялық дауларға арналған мемлекеттік емес сот." },
    { term: "Моральдық зиян", definition: "Психологиялық және физикалық азап үшін өтемақы." },
    { term: "Жіберіп алған пайда", definition: "Құқықтарыңыздың бұзылуына байланысты алмаған табыс." },
    { term: "Келісім комиссиясы", definition: "Еңбек дауларындағы сотқа дейінгі міндетті кезең." }
  ],
  en: [
    { term: "Plaintiff", definition: "A person who files a lawsuit in court to protect their rights." },
    { term: "Defendant", definition: "The person against whom the lawsuit is filed." },
    { term: "State Fee", definition: "A budget fee for considering a case in court." },
    { term: "Private Bailiff", definition: "Blocks accounts and collects debts." },
    { term: "Appeal", definition: "A complaint against a court decision that has not yet entered into force." },
    { term: "Cassation", definition: "Review of a case in the Supreme Court of the RK." },
    { term: "MCI", definition: "Monthly Calculation Index (base for fines)." },
    { term: "EDS", definition: "Electronic digital signature for eGov." },
    { term: "Mediation", definition: "Peaceful resolution of a dispute through a mediator." },
    { term: "Penalty", definition: "Money paid for breach of contract." },
    { term: "Property Owners Association", definition: "Organization replacing traditional cooperatives." },
    { term: "CPC RK", definition: "Civil Procedural Code of the Republic of Kazakhstan." },
    { term: "CrPC RK", definition: "Criminal Procedural Code." },
    { term: "Administrative Code", definition: "Code of Administrative Offenses." },
    { term: "Resident", definition: "A person permanently residing in the RK." },
    { term: "Offer", definition: "A proposal to conclude a contract on certain terms." },
    { term: "Acceptance", definition: "Agreement to the terms of the offer." },
    { term: "Force Majeure", definition: "Unforeseeable circumstances (war, flood)." },
    { term: "Power of Attorney", definition: "A document authorizing another person to act on your behalf." },
    { term: "BIN/IIN", definition: "Unique numbers of companies and citizens in the RK." },
    { term: "Encumbrance", definition: "A ban on the sale of property (bank pledge, arrest)." },
    { term: "Attesting Witness", definition: "An independent person present during a search." },
    { term: "Witness", definition: "A person who saw the fact of violation." },
    { term: "Claim", definition: "A pre-trial demand to correct a violation." },
    { term: "Motion", definition: "An official request to the judge." },
    { term: "Suspension", definition: "Temporary halt of a court case." },
    { term: "Arbitration Court", definition: "Non-state court for commercial disputes." },
    { term: "Moral Damage", definition: "Compensation for mental and physical suffering." },
    { term: "Lost Profit", definition: "Income you didn't receive due to the violation." },
    { term: "Conciliation Commission", definition: "Mandatory pre-trial stage in labor disputes." }
  ]
};

export default function EducationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'guides' | 'dictionary'>('guides');
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);

  // ПОДКЛЮЧАЕМ ЯЗЫК
  const { lang } = useLanguage();
  const t = uiTranslations[lang];
  const guides = guidesData[lang];
  const dictionary = dictData[lang];

  const filteredGuides = guides.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDictionary = dictionary.filter(d => d.term.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-emerald-500">🎓</span> {t.title}
            </h1>
            <p className="text-gray-400 mt-2">{t.subtitle} {guides.length} {t.articlesCount} и {dictionary.length} {t.termsCount}</p>
          </div>
          <button 
            onClick={() => router.push('/profile')} 
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all font-bold uppercase text-sm tracking-wider"
          >
            {t.toProfile}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex bg-[#0c1527] p-1 rounded-2xl border border-blue-500/20 shrink-0">
            <button onClick={() => setActiveTab('guides')} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'guides' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>{t.tabArticles}</button>
            <button onClick={() => setActiveTab('dictionary')} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'dictionary' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>{t.tabDict}</button>
          </div>
          <div className="relative flex-1">
            <input type="text" placeholder={t.searchPlaceholder} className="w-full bg-[#0c1527] border border-blue-500/20 rounded-2xl p-3.5 pl-12 text-white outline-none focus:border-emerald-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                <button onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)} className="mt-4 text-emerald-500 text-xs font-bold hover:underline text-left uppercase">
                   {expandedGuide === guide.id ? t.collapse : t.expand}
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