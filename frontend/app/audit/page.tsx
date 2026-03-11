"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuditPage() {
  const router = useRouter();
  const [caseDesc, setCaseDesc] = useState("");
  const [lawyerWords, setLawyerWords] = useState("");

  const handleAudit = () => {
    if (!caseDesc || !lawyerWords) {
      alert("Пожалуйста, заполните оба поля.");
      return;
    }

    const prompt = `Выступи в роли независимого юридического аудитора LegalPredict AI. 
    Я хочу проверить добросовестность и адекватность действий моего юриста.
    
    Суть моего дела: ${caseDesc}
    Мой юрист утверждает/требует: ${lawyerWords}
    
    Проанализируй ситуацию по законам РК и ответь на следующие вопросы:
    1. Красные флаги: Есть ли признаки обмана (например, гарантия 100% результата в суде — это нарушение этики адвоката)?
    2. Адекватность: Соответствуют ли требования юриста (по деньгам/срокам) реальной практике?
    3. Рекомендация: Какие 3 контрольных вопроса мне стоит задать этому юристу, чтобы проверить его компетентность?
    
    В конце обязательно добавь: "Внимание: В случае существенных расхождений вы вправе направить жалобу в Республиканскую коллегию адвокатов. LegalPredict AI не выступает посредником или арбитром в спорах между клиентом и юристом."`;

    router.push(`/?template_prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-red-500">🕵️‍♂️</span> Проверка юриста (Аудит)
            </h1>
            <p className="text-gray-400 mt-2">Оцените действия вашего адвоката с помощью независимого ИИ</p>
          </div>
          <button 
            onClick={() => router.push('/profile')} 
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all"
          >
            В профиль
          </button>
        </div>

        <div className="bg-[#0f192e] border border-red-500/20 p-8 rounded-3xl shadow-2xl relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500/60 rounded-l-3xl"></div>
          
          <div className="mb-8 bg-red-900/10 border border-red-500/20 p-4 rounded-xl text-sm text-gray-300">
            <strong>Зачем это нужно?</strong> Часто недобросовестные юристы обещают "100% выигрыш" или просят огромные суммы за простые дела. Опишите ситуацию, и наш ИИ проверит её на наличие профессиональных нарушений.
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-blue-200 font-bold mb-2">1. Краткая суть вашего дела</label>
              <textarea 
                className="w-full bg-[#0c1527] border border-blue-500/30 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all min-h-[100px] resize-none"
                placeholder="Например: Затопили соседи, есть акт от КСК, ущерб на 500 тысяч тенге."
                value={caseDesc}
                onChange={(e) => setCaseDesc(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-blue-200 font-bold mb-2">2. Что обещает или требует ваш юрист?</label>
              <textarea 
                className="w-full bg-[#0c1527] border border-blue-500/30 rounded-2xl p-4 text-white outline-none focus:border-red-500 transition-all min-h-[100px] resize-none"
                placeholder="Например: Просит 300 тысяч тенге вперед и дает 100% гарантию, что суд выиграем за неделю."
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
              Проверить юриста на честность
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}