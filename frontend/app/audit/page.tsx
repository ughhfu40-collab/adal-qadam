"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Словарь переводов
const TRANSLATIONS = {
  ru: {
    title: "Проверка юриста (Аудит)",
    subtitle: "Оцените действия вашего адвоката с помощью независимого ИИ",
    toProfile: "В профиль",
    whyTitle: "Зачем это нужно?",
    whyDesc: "Часто недобросовестные юристы обещают '100% выигрыш' или просят огромные суммы за простые дела. Опишите ситуацию, и наш ИИ проверит её на наличие профессиональных нарушений.",
    label1: "1. Краткая суть вашего дела",
    ph1: "Например: Затопили соседи, есть акт от КСК, ущерб на 500 тысяч тенге.",
    label2: "2. Что обещает или требует ваш юрист?",
    ph2: "Например: Просит 300 тысяч тенге вперед и дает 100% гарантию, что суд выиграем за неделю.",
    btnAudit: "Проверить юриста на честность",
    alert: "Пожалуйста, заполните оба поля.",
    aiPrompt: (caseDesc: string, lawyerWords: string) => `Выступи в роли независимого юридического аудитора LegalPredict AI. 
    Я хочу проверить добросовестность и адекватность действий моего юриста.
    Суть моего дела: ${caseDesc}
    Мой юрист утверждает/требует: ${lawyerWords}
    Проанализируй ситуацию по законам РК и ответь на вопросы: Красные флаги, Адекватность, 3 контрольных вопроса.
    В конце добавь: "Внимание: В случае существенных расхождений вы вправе направить жалобу в Республиканскую коллегию адвокатов."`
  },
  kk: {
    title: "Заңгерді тексеру (Аудит)",
    subtitle: "Заңгеріңіздің әрекетін тәуелсіз ЖИ арқылы бағалаңыз",
    toProfile: "Профильге",
    whyTitle: "Бұл не үшін қажет?",
    whyDesc: "Жиі жосықсыз заңгерлер '100% жеңіске' уәде береді немесе қарапайым істер үшін үлкен сома сұрайды. Жағдайды сипаттаңыз, біздің ЖИ оны кәсіби заң бұзушылықтарға тексереді.",
    label1: "1. Ісіңіздің қысқаша мазмұны",
    ph1: "Мысалы: Көршілер су жіберді, ПИК-тен акт бар, шығын 500 мың теңге.",
    label2: "2. Заңгеріңіз не уәде етеді немесе не талап етеді?",
    ph2: "Мысалы: 300 мың теңге алдын ала төлем сұрайды және сотты бір аптада жеңеміз деп 100% кепілдік береді.",
    btnAudit: "Заңгердің адалдығын тексеру",
    alert: "Екі өрісті де толтырыңыз.",
    aiPrompt: (caseDesc: string, lawyerWords: string) => `LegalPredict AI тәуелсіз заң аудиторы рөлін атқар. 
    Мен заңгерімнің әрекеттерінің адалдығы мен сәйкестігін тексергім келеді.
    Істің мәні: ${caseDesc}
    Заңгердің талабы: ${lawyerWords}
    Жағдайды ҚР заңдары бойынша талдап, сұрақтарға жауап бер: Қауіпті белгілер (Red flags), Сәйкестік, 3 бақылау сұрағы.
    Соңында қосыңыз: "Назар аударыңыз: Елеулі сәйкессіздіктер болған жағдайда сіз Республикалық адвокаттар алқасына шағым түсіруге құқылысыз."`
  },
  en: {
    title: "Lawyer Audit",
    subtitle: "Evaluate your lawyer's actions with independent AI",
    toProfile: "To Profile",
    whyTitle: "Why is this needed?",
    whyDesc: "Often, unscrupulous lawyers promise a '100% win' or ask for huge fees for simple cases. Describe the situation, and our AI will check it for professional violations.",
    label1: "1. Brief essence of your case",
    ph1: "Example: Neighbors flooded the flat, there is an act from the service provider, damages are 500,000 tenge.",
    label2: "2. What does your lawyer promise or demand?",
    ph2: "Example: Asks for 300,000 tenge upfront and gives a 100% guarantee that we will win in a week.",
    btnAudit: "Check Lawyer's Honesty",
    alert: "Please fill in both fields.",
    aiPrompt: (caseDesc: string, lawyerWords: string) => `Act as an independent legal auditor for LegalPredict AI. 
    I want to verify the integrity and adequacy of my lawyer's actions.
    Case essence: ${caseDesc}
    Lawyer's claims: ${lawyerWords}
    Analyze the situation according to the laws of Kazakhstan and answer: Red flags, Adequacy, 3 control questions.
    At the end add: "Attention: In case of significant discrepancies, you have the right to file a complaint with the Republican Bar Association."`
  }
};

export default function AuditPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const [caseDesc, setCaseDesc] = useState("");
  const [lawyerWords, setLawyerWords] = useState("");

  const t = TRANSLATIONS[lang];

  const handleAudit = () => {
    if (!caseDesc || !lawyerWords) {
      alert(t.alert);
      return;
    }

    const prompt = t.aiPrompt(caseDesc, lawyerWords);
    router.push(`/?template_prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Переключатель языков */}
        <div className="flex justify-end gap-2 mb-4">
          {['ru', 'kk', 'en'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as any)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${lang === l ? 'bg-red-600 border-red-500 text-white' : 'bg-[#0c1527] border-blue-500/20 text-gray-400'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-red-500">🕵️‍♂️</span> {t.title}
            </h1>
            <p className="text-gray-400 mt-2">{t.subtitle}</p>
          </div>
          <button 
            onClick={() => router.push('/profile')} 
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all"
          >
            {t.toProfile}
          </button>
        </div>

        <div className="bg-[#0f192e] border border-red-500/20 p-8 rounded-3xl shadow-2xl relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500/60 rounded-l-3xl"></div>
          
          <div className="mb-8 bg-red-900/10 border border-red-500/20 p-4 rounded-xl text-sm text-gray-300">
            <strong>{t.whyTitle}</strong> {t.whyDesc}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-blue-200 font-bold mb-2">{t.label1}</label>
              <textarea 
                className="w-full bg-[#0c1527] border border-blue-500/30 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all min-h-[100px] resize-none"
                placeholder={t.ph1}
                value={caseDesc}
                onChange={(e) => setCaseDesc(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-blue-200 font-bold mb-2">{t.label2}</label>
              <textarea 
                className="w-full bg-[#0c1527] border border-blue-500/30 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all min-h-[100px] resize-none"
                placeholder={t.ph2}
                value={lawyerWords}
                onChange={(e) => setLawyerWords(e.target.value)}
              />
            </div>

            <button 
              onClick={handleAudit}
              className="w-full bg-red-600/20 border border-red-500/40 text-red-100 py-4 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold text-lg flex items-center justify-center gap-2 mt-4 shadow-lg shadow-red-900/20"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t.btnAudit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}