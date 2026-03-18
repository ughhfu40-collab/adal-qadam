"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../LanguageContext'; // ИМПОРТ КОНТЕКСТА

// --- СЛОВАРИ ПЕРЕВОДОВ ---
const translations = {
  ru: {
    alertEmpty: "Пожалуйста, заполните оба поля.",
    title: "Проверка юриста (Аудит)",
    subtitle: "Оцените действия вашего адвоката с помощью независимого ИИ",
    toProfile: "В профиль",
    whyNeededTitle: "Зачем это нужно?",
    whyNeededText: "Часто недобросовестные юристы обещают \"100% выигрыш\" или просят огромные суммы за простые дела. Опишите ситуацию, и наш ИИ проверит её на наличие профессиональных нарушений.",
    label1: "1. Краткая суть вашего дела",
    placeholder1: "Например: Затопили соседи, есть акт от КСК, ущерб на 500 тысяч тенге.",
    label2: "2. Что обещает или требует ваш юрист?",
    placeholder2: "Например: Просит 300 тысяч тенге вперед и дает 100% гарантию, что суд выиграем за неделю.",
    checkBtn: "Проверить юриста на честность"
  },
  kk: {
    alertEmpty: "Екі өрісті де толтырыңыз.",
    title: "Заңгерді тексеру (Аудит)",
    subtitle: "Тәуелсіз ЖИ көмегімен адвокатыңыздың әрекеттерін бағалаңыз",
    toProfile: "Профильге",
    whyNeededTitle: "Бұл не үшін қажет?",
    whyNeededText: "Жиі жосықсыз заңгерлер \"100% ұтысқа\" уәде береді немесе қарапайым істер үшін үлкен сома сұрайды. Жағдайды сипаттаңыз, біздің ЖИ оны кәсіби бұзушылықтардың бар-жоғына тексереді.",
    label1: "1. Ісіңіздің қысқаша мәні",
    placeholder1: "Мысалы: Көршілер су басты, ПИК актісі бар, залал 500 мың теңге.",
    label2: "2. Заңгеріңіз не уәде етеді немесе талап етеді?",
    placeholder2: "Мысалы: 300 мың теңге алдын ала сұрайды және сотты бір аптада ұтамыз деп 100% кепілдік береді.",
    checkBtn: "Заңгерді адалдыққа тексеру"
  },
  en: {
    alertEmpty: "Please fill in both fields.",
    title: "Lawyer Audit",
    subtitle: "Evaluate your lawyer's actions with independent AI",
    toProfile: "To Profile",
    whyNeededTitle: "Why is this needed?",
    whyNeededText: "Often unscrupulous lawyers promise a \"100% win\" or ask for huge sums for simple cases. Describe the situation, and our AI will check it for professional violations.",
    label1: "1. Brief essence of your case",
    placeholder1: "E.g., Flooded by neighbors, act from management company exists, damage is 500,000 KZT.",
    label2: "2. What does your lawyer promise or demand?",
    placeholder2: "E.g., Asks for 300,000 KZT upfront and gives a 100% guarantee that we will win the court in a week.",
    checkBtn: "Check the lawyer for honesty"
  }
};

// --- ФУНКЦИЯ ГЕНЕРАЦИИ ПРОМПТА НА 3 ЯЗЫКАХ ---
const generatePrompt = (lang: string, caseDesc: string, lawyerWords: string) => {
  if (lang === 'kk') {
    return `LegalPredict AI тәуелсіз заң аудиторы ретінде әрекет ет. Мен өз заңгерімнің адалдығы мен әрекеттерінің дұрыстығын тексергім келеді.
    Менің ісімнің мәні: ${caseDesc}
    Менің заңгерім мынаны мәлімдейді/талап етеді: ${lawyerWords}
    Жағдайды ҚР заңдары бойынша талдап, келесі сұрақтарға жауап бер:
    1. Қызыл жалаушалар: Алдау белгілері бар ма (мысалы, сотта 100% нәтижеге кепілдік беру — бұл адвокат этикасын бұзу)?
    2. Адекваттылық: Заңгердің талаптары (ақша/мерзім бойынша) нақты тәжірибеге сәйкес келе ме?
    3. Ұсыныс: Бұл заңгердің құзыреттілігін тексеру үшін оған қандай 3 бақылау сұрағын қоюым керек?
    Соңында міндетті түрде қосыңыз: "Назар аударыңыз: Аса үлкен айырмашылықтар болған жағдайда сіз Республикалық адвокаттар алқасына шағым түсіруге құқылысыз. LegalPredict AI клиент пен заңгер арасындағы дауларда делдал немесе арбитр ретінде әрекет етпейді."`;
  }
  if (lang === 'en') {
    return `Act as an independent legal auditor of LegalPredict AI. I want to check the integrity and adequacy of my lawyer's actions.
    The essence of my case: ${caseDesc}
    My lawyer claims/demands: ${lawyerWords}
    Analyze the situation according to the laws of the RK and answer the following questions:
    1. Red flags: Are there signs of deception (for example, a 100% guarantee of the result in court is a violation of lawyer ethics)?
    2. Adequacy: Do the lawyer's demands (in terms of money/time) correspond to actual practice?
    3. Recommendation: What 3 control questions should I ask this lawyer to check their competence?
    At the end, be sure to add: "Attention: In case of significant discrepancies, you have the right to send a complaint to the Republican Bar Association. LegalPredict AI does not act as a mediator or arbitrator in disputes between a client and a lawyer."`;
  }
  
  // По умолчанию RU
  return `Выступи в роли независимого юридического аудитора LegalPredict AI. Я хочу проверить добросовестность и адекватность действий моего юриста.
  Суть моего дела: ${caseDesc}
  Мой юрист утверждает/требует: ${lawyerWords}
  Проанализируй ситуацию по законам РК и ответь на следующие вопросы:
  1. Красные флаги: Есть ли признаки обмана (например, гарантия 100% результата в суде — это нарушение этики адвоката)?
  2. Адекватность: Соответствуют ли требования юриста (по деньгам/срокам) реальной практике?
  3. Рекомендация: Какие 3 контрольных вопроса мне стоит задать этому юристу, чтобы проверить его компетентность?
  В конце обязательно добавь: "Внимание: В случае существенных расхождений вы вправе направить жалобу в Республиканскую коллегию адвокатов. LegalPredict AI не выступает посредником или арбитром в спорах между клиентом и юристом."`;
};


export default function AuditPage() {
  const router = useRouter();
  const [caseDesc, setCaseDesc] = useState("");
  const [lawyerWords, setLawyerWords] = useState("");

  // ПОДКЛЮЧАЕМ ЯЗЫК
  const { lang } = useLanguage();
  const t = translations[lang];

  const handleAudit = () => {
    if (!caseDesc || !lawyerWords) {
      alert(t.alertEmpty);
      return;
    }

    const prompt = generatePrompt(lang, caseDesc, lawyerWords);
    router.push(`/?template_prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-red-500">🕵️‍♂️</span> {t.title}
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

        <div className="bg-[#0f192e] border border-red-500/20 p-8 rounded-3xl shadow-2xl relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500/60 rounded-l-3xl"></div>
          
          <div className="mb-8 bg-red-900/10 border border-red-500/20 p-4 rounded-xl text-sm text-gray-300">
            <strong>{t.whyNeededTitle}</strong> {t.whyNeededText}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-blue-200 font-bold mb-2">{t.label1}</label>
              <textarea 
                className="w-full bg-[#0c1527] border border-blue-500/30 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all min-h-[100px] resize-none"
                placeholder={t.placeholder1}
                value={caseDesc}
                onChange={(e) => setCaseDesc(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-blue-200 font-bold mb-2">{t.label2}</label>
              <textarea 
                className="w-full bg-[#0c1527] border border-blue-500/30 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all min-h-[100px] resize-none"
                placeholder={t.placeholder2}
                value={lawyerWords}
                onChange={(e) => setLawyerWords(e.target.value)}
              />
            </div>

            <button 
              onClick={handleAudit}
              className="w-full bg-red-600/20 border border-red-500/40 text-red-100 py-4 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold text-lg flex items-center justify-center gap-2 mt-4"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t.checkBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}