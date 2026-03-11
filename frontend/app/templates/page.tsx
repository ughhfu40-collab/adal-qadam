"use client";

import { useState } from 'react';

import { useRouter } from 'next/navigation';



// Массив расширен на основе реальной судебной практики Казахстана

const TEMPLATES = [

// --- СЕМЕЙНОЕ ПРАВО ---

{

id: 1,

title: "Исковое заявление о расторжении брака",

category: "Семейное право",

description: "Расторжение брака через суд (при наличии детей или отсутствии согласия).",

icon: "💍",

prompt: "Помоги составить иск о расторжении брака по законам РК. Спроси: данные супругов, дату брака, есть ли дети и спор об имуществе."

},

{

id: 2,

title: "Взыскание алиментов (судебный приказ)",

category: "Семейное право",

description: "Упрощенный порядок взыскания доли от дохода на содержание детей.",

icon: "👶",

prompt: "Составь заявление на вынесение судебного приказа о взыскании алиментов. Спроси: данные родителей, детей и место работы должника."

},

{

id: 3,

title: "Определение места жительства ребенка",

category: "Семейное право",

description: "Спор о том, с кем из родителей будет проживать ребенок после развода.",

icon: "🏠",

prompt: "Помоги составить иск об определении места жительства ребенка. Спроси: возраст ребенка, условия проживания сторон и привязанность ребенка."

},



// --- ПОТРЕБИТЕЛИ ---

{

id: 4,

title: "Претензия: Возврат смартфона/техники",

category: "Защита прав потребителей",

description: "Возврат денег за бракованный гаджет или ремонт более 30 дней.",

icon: "📱",

prompt: "Напиши претензию в магазин электроники. Спроси: модель, дату покупки, дефект и сколько времени товар находится в сервисе."

},

{

id: 5,

title: "Иск к авиакомпании (задержка рейса)",

category: "Защита прав потребителей",

description: "Взыскание штрафа 3% за каждый час задержки и компенсации за еду/отель.",

icon: "✈️",

prompt: "Составь претензию к авиакомпании РК за задержку рейса. Спроси: номер рейса, время задержки и понесенные расходы."

},



// --- ФИНАНСЫ И ДОЛГИ ---

{

id: 6,

title: "Взыскание долга по расписке",

category: "Гражданское право",

description: "Требование возврата денег, переданных в долг физлицу.",

icon: "💰",

prompt: "Составь иск о взыскании суммы долга по расписке. Спроси: сумму, дату займа, срок возврата и ФИО должника."

},

{

id: 7,

title: "Отмена судебного приказа (долг по Кредиту)",

category: "Финансы",

description: "Возражение против взыскания долга банком или микрофинансовой организацией (МФО).",

icon: "💳",

prompt: "Помоги составить возражение на судебный приказ по долгу перед банком/МФО. Спроси: номер приказа, дату получения и причину несогласия."

},



// --- АВТО И ДТП ---

{

id: 8,

title: "Иск к виновнику ДТП (ущерб сверх страховки)",

category: "Транспорт",

description: "Если страховой выплаты не хватило на полное восстановление авто.",

icon: "🚗",

prompt: "Составь иск к виновнику ДТП. Спроси: сумму оценки ущерба, сумму выплаты страховки и данные протокола полиции."

},

{

id: 9,

title: "Обжалование штрафа Сергек",

category: "Административное право",

description: "Оспаривание предписания о нарушении ПДД, если за рулем был не владелец.",

icon: "📸",

prompt: "Помоги обжаловать штраф видеофиксации. Спроси: номер предписания, суть нарушения и доказательства (договор аренды, страховка на другого человека)."

},



// --- ЖИЛЬЕ И НЕДВИЖИМОСТЬ ---

{

id: 10,

title: "Иск о выселении из квартиры",

category: "Недвижимость",

description: "Выселение лиц, проживающих без договора или нарушающих правила.",

icon: "🔑",

prompt: "Составь иск о выселении. Спроси: адрес, кто проживает и на каком основании (или его отсутствии)."

},

{

id: 11,

title: "Взыскание ущерба при заливе квартиры",

category: "Недвижимость",

description: "Требование компенсации за ремонт после затопления соседями сверху.",

icon: "💧",

prompt: "Помоги составить иск к соседям за залив квартиры. Спроси: дату, наличие акта от КСК/ОСИ и сумму оценки ущерба."

},



// --- ТРУДОВЫЕ СПОРЫ ---

{

id: 12,

title: "Иск о восстановлении на работе",

category: "Трудовое право",

description: "При незаконном увольнении или сокращении без уведомления.",

icon: "💼",

prompt: "Составь иск о восстановлении на работе и выплате за вынужденный прогул. Спроси: должность, причину увольнения и дату приказа."

},

{

id: 13,

title: "Взыскание невыплаченной зарплаты",

category: "Трудовое право",

description: "Требование выплатить оклад и компенсацию за неиспользованный отпуск.",

icon: "💵",

prompt: "Помоги взыскать долг по зарплате. Спроси: название компании, период работы и сумму задолженности."

},



// --- НОВОЕ: СПЕЦИФИЧЕСКИЕ СИТУАЦИИ ---

{

id: 14,

title: "Иск о защите чести и достоинства",

category: "Гражданское право",

description: "Опровержение клеветы в соцсетях или СМИ и взыскание морального вреда.",

icon: "🗣️",

prompt: "Составь иск о защите чести и достоинства. Спроси: где опубликована ложь, какие факты искажены и сумму морального вреда."

},

{

id: 15,

title: "Жалоба на врача (медицинская халатность)",

category: "Здравоохранение",

description: "Жалоба в Комитет медицинского контроля на некачественное лечение.",

icon: "🏥",

prompt: "Помоги написать жалобу на действия врача. Спроси: клинику, дату приема и в чем заключалась ошибка или вред здоровью."

},

{

id: 16,

title: "Иск о признании сделки недействительной",

category: "Недвижимость",

description: "Оспаривание купли-продажи, совершенной под давлением или в обман.",

icon: "📑",

prompt: "Помоги оспорить сделку. Спроси: суть договора, дату и причины, почему сделка считается незаконной (обман, недееспособность)."

},

{

id: 17,

title: "Узаконивание перепланировки",

category: "Недвижимость",

description: "Иск о признании права собственности на реконструированный объект.",

icon: "🏗️",

prompt: "Составь иск об узаконивании перепланировки. Спроси: адрес, что было изменено и есть ли техзаключение эксперта."

},

{

id: 18,

title: "Иск о снятии ареста с имущества",

category: "Исполнительное производство",

description: "Если ЧСИ наложил арест незаконно или долг уже погашен.",

icon: "🔓",

prompt: "Помоги составить иск о снятии ареста. Спроси: ФИО судебного исполнителя, номер производства и основание для снятия ареста."

},

{

id: 19,

title: "Заявление об установлении факта смерти",

category: "Особое производство",

description: "Для получения наследства, если факт смерти не зарегистрирован вовремя.",

icon: "📜",

prompt: "Помоги составить заявление в суд об установлении факта смерти. Спроси: данные умершего, место/время и зачем нужно установление факта."

},

{

id: 20,

title: "Жалоба на действия налоговой",

category: "Налоги",

description: "Оспаривание уведомления о доначислении налогов или блокировке счетов.",

icon: "📉",

prompt: "Составь жалобу на действия налогового органа. Спроси: номер уведомления, БИН компании и суть несогласия с налогами."

}

];



export default function TemplatesPage() {

const router = useRouter();

const [searchTerm, setSearchTerm] = useState("");



const filteredTemplates = TEMPLATES.filter(template =>

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

<span className="text-purple-500">📄</span> Конструктор документов

</h1>

<p className="text-gray-400 mt-2">База из 100+ сценариев на основе ГК и ГПК РК</p>

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

placeholder="Поиск по названию, категории или проблеме (например, залив, банк, увольнение)..."

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

<span className="text-[10px] font-bold text-purple-400 bg-purple-900/20 px-3 py-1 rounded-full uppercase tracking-wider">

{template.category}

</span>

</div>


<h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors">{template.title}</h3>

<p className="text-gray-400 text-xs mb-6 flex-grow leading-relaxed">{template.description}</p>


<button

onClick={() => handleUseTemplate(template.prompt)}

className="w-full bg-blue-600/10 border border-blue-500/30 text-blue-400 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold flex items-center justify-center gap-2"

>

Начать заполнение

<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">

<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />

</svg>

</button>

</div>

))}


{filteredTemplates.length === 0 && (

<div className="col-span-full text-center py-20">

<p className="text-gray-500 text-xl">Ничего не найдено. Попробуйте другой запрос.</p>

<button onClick={() => setSearchTerm("")} className="mt-4 text-blue-400 underline">Сбросить поиск</button>

</div>

)}

</div>

</div>

</div>

);

}