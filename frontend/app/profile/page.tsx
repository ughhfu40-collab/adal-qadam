"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Словарь переводов
const TRANSLATIONS = {
  ru: {
    loading: "Загрузка...",
    error: "Ошибка связи с сервером",
    back: "Назад",
    sidebar: {
      chat: "В чат ИИ",
      templates: "📄 Шаблоны документов",
      knowledge: "🎓 База знаний",
      lawyers: "👨‍⚖️ Каталог адвокатов",
      audit: "🕵️‍♂️ Проверка юриста",
      logout: "Выйти"
    },
    stats: {
      saved: "Сэкономлено",
      currency: "₸"
    },
    usernamePrompt: "Введите новый логин (минимум 3 символа):",
    usernameSuccess: "Логин успешно изменен! Пожалуйста, войдите снова с новым логином.",
    usernameError: "Этот логин уже занят или произошла ошибка",
    docsTitle: "Документы",
    emptyHistory: "История пуста",
    docDefault: "Документ",
    disclaimer: {
      title: "Юридические оговорки и защита от ответственности",
      item1: "1. Статус сервиса: Adal Qadam является информационно-аналитическим инструментом. Сервис не оказывает юридическую помощь в смысле, определённом Законом РК «Об адвокатской деятельности и юридической помощи».",
      item2: "2. Отказ от юридической ответственности: Прогнозируемый результат носит «информационный и справочный характер» и не является юридическим заключением, рекомендацией или гарантией исхода дела.",
      item3: "3. Ограничение ответственности: Сервис не несёт ответственности за прямые или косвенные убытки. Прогнозы могут не совпадать с фактическим решением суда.",
      item4: "4. Дата актуальности: Все прогнозы основаны на актуальной базе судебных решений. Текущая сессия:"
    }
  },
  kk: {
    loading: "Жүктелуде...",
    error: "Сервермен байланыс қатесі",
    back: "Артқа",
    sidebar: {
      chat: "ЖИ чатқа",
      templates: "📄 Құжат үлгілері",
      knowledge: "🎓 Білім базасы",
      lawyers: "👨‍⚖️ Адвокаттар каталогы",
      audit: "🕵️‍♂️ Заңгерді тексеру",
      logout: "Шығу"
    },
    stats: {
      saved: "Үнемделді",
      currency: "₸"
    },
    usernamePrompt: "Жаңа логинді енгізіңіз (кемінде 3 таңба):",
    usernameSuccess: "Логин сәтті өзгертілді! Жаңа логинмен қайта кіріңіз.",
    usernameError: "Бұл логин бос емес немесе қате кетті",
    docsTitle: "Құжаттар",
    emptyHistory: "Тарих бос",
    docDefault: "Құжат",
    disclaimer: {
      title: "Заңдық ескертулер және жауапкершіліктен бас тарту",
      item1: "1. Сервис мәртебесі: Adal Qadam ақпараттық-талдау құралы болып табылады. Сервис «Адвокаттық қызмет және заң көмегі туралы» ҚР Заңында айқындалған мағынада заң көмегін көрсетпейді.",
      item2: "2. Заңдық жауапкершіліктен бас тарту: Болжамды нәтиже «ақпараттық және анықтамалық сипатта» болады және заңды қорытынды немесе істің нәтижесіне кепілдік болып табылмайды.",
      item3: "3. Жауапкершілікті шектеу: Сервис тікелей немесе жанама шығындар үшін жауап бермейді. Болжамдар соттың нақты шешімімен сәйкес келмеуі мүмкін.",
      item4: "4. Өзектілік күні: Барлық болжамдар сот шешімдерінің өзекті базасына негізделген. Ағымдағы сессия:"
    }
  },
  en: {
    loading: "Loading...",
    error: "Server connection error",
    back: "Back",
    sidebar: {
      chat: "To AI Chat",
      templates: "📄 Document Templates",
      knowledge: "🎓 Knowledge Base",
      lawyers: "👨‍⚖️ Lawyers Catalog",
      audit: "🕵️‍♂️ Lawyer Audit",
      logout: "Logout"
    },
    stats: {
      saved: "Money Saved",
      currency: "₸"
    },
    usernamePrompt: "Enter new username (min 3 characters):",
    usernameSuccess: "Username changed successfully! Please log in again with your new username.",
    usernameError: "This username is taken or an error occurred",
    docsTitle: "Documents",
    emptyHistory: "History is empty",
    docDefault: "Document",
    disclaimer: {
      title: "Legal Disclaimers and Limitation of Liability",
      item1: "1. Service Status: Adal Qadam is an information and analytical tool. The service does not provide legal assistance as defined by the Law of the Republic of Kazakhstan 'On Advocacy and Legal Assistance'.",
      item2: "2. Legal Disclaimer: The predicted result is for 'informational and reference purposes' only and is not a legal opinion, recommendation, or guarantee of the outcome of the case.",
      item3: "3. Limitation of Liability: The service is not liable for direct or indirect damages. Forecasts may not coincide with the actual court decision.",
      item4: "4. Current Date: All forecasts are based on current court rulings. Current session:"
    }
  }
};

export default function Profile() {
  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const router = useRouter();

  const t = TRANSLATIONS[lang];
  const API_URL = 'https://adal-qadam.onrender.com';

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    loadUserData(token);
    loadUserCases(token);
    if (typeof window !== 'undefined' && window.innerWidth < 768) setIsSidebarOpen(false);
  }, [router]);

  const loadUserData = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem('token'); 
        router.push('/login');
      }
    } catch (e) { 
      setLoadingError(t.error);
    }
  };

  const loadUserCases = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/cases`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCases(Array.isArray(data) ? data : []);
      }
    } catch (e) { 
      console.error("History error"); 
    }
  };

  const handleChangeUsername = async () => {
    const newName = prompt(t.usernamePrompt);
    if (!newName || newName.length < 3) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/update-username`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_username: newName })
      });
      if (res.ok) {
        alert(t.usernameSuccess);
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        const err = await res.json();
        alert(err.detail || t.usernameError);
      }
    } catch (e) { 
      alert(t.error); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const maskEmail = (email: string) => {
    if (!email || typeof email !== 'string' || !email.includes("@")) return email || "";
    const [name, domain] = email.split("@");
    if (name.length <= 2) return name + "***@" + domain;
    return name.substring(0, 2) + "******@" + domain;
  };

  if (loadingError) {
    return (
      <div className="min-h-screen bg-[#080f1e] flex flex-col items-center justify-center p-6 text-white font-sans">
        <p>{loadingError}</p>
        <button onClick={() => router.push('/')} className="mt-4 bg-blue-600 px-6 py-2 rounded-xl font-bold">{t.back}</button>
      </div>
    );
  }

  if (!user) return <div className="min-h-screen bg-[#080f1e] flex items-center justify-center text-blue-400 font-bold">{t.loading}</div>;

  const savedMoney = (cases ? cases.length : 0) * 50000;
  const displayName = user?.username || user?.email?.split('@')[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#080f1e] text-gray-200 overflow-hidden relative font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-0'} transition-all duration-300 bg-[#0c1527]/90 backdrop-blur-xl border-r border-blue-500/10 flex flex-col z-30 overflow-hidden shrink-0`}>
        <div className="w-[280px] flex flex-col h-full">
          <div className="p-6 text-center">
             <h2 className="text-2xl font-black text-blue-200 uppercase tracking-widest">Adal Qadam</h2>
          </div>
          <div className="p-5 space-y-3">
            <button onClick={() => router.push('/')} className="w-full flex items-center justify-center gap-2 border border-blue-500/20 text-blue-300 p-3 rounded-2xl hover:bg-blue-600/10 transition-all font-medium">
              {t.sidebar.chat}
            </button>
            <button onClick={() => router.push('/templates')} className="w-full flex items-center justify-center gap-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 p-3 rounded-2xl hover:bg-purple-600/40 transition-all font-medium">
              {t.sidebar.templates}
            </button>
            <button onClick={() => router.push('/education')} className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 p-3 rounded-2xl hover:bg-emerald-600/40 transition-all font-medium">
              {t.sidebar.knowledge}
            </button>
            <button onClick={() => router.push('/lawyers')} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-900/20">
              {t.sidebar.lawyers}
            </button>
            <button onClick={() => router.push('/audit')} className="w-full flex items-center justify-center gap-2 bg-red-600/20 border border-red-500/30 text-red-300 p-3 rounded-2xl hover:bg-red-600/40 transition-all font-medium">
              {t.sidebar.audit}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            {cases && cases.map((c: any) => (
              <button key={c?.id} onClick={() => router.push(`/?case=${c?.id}`)} className="w-full text-left px-4 py-3 rounded-xl text-[13px] truncate text-gray-400 hover:bg-blue-600/10 hover:text-blue-200 block mb-1 transition-colors">
                {c?.title || t.docDefault}
              </button>
            ))}
          </div>
          <div className="p-5 border-t border-blue-500/10">
            <button onClick={handleLogout} className="w-full text-gray-500 hover:text-red-400 p-3 transition-all font-bold uppercase text-xs tracking-widest">
              {t.sidebar.logout}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Language Switcher */}
          <div className="flex justify-end gap-2 mb-6">
            {['ru', 'kk', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${lang === l ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0c1527] border-blue-500/20 text-gray-400'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* User Profile Header */}
          <div className="bg-[#0f192e] border border-blue-500/20 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 mb-8 shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-900/40">{initial}</div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-white">{displayName}</h1>
                  <button onClick={handleChangeUsername} className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-blue-400 group">
                    <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <p className="text-blue-300 text-xs font-bold bg-blue-900/40 px-3 py-1 rounded-full mt-2 inline-block border border-blue-500/20 tracking-wider">
                   {maskEmail(user?.email)}
                </p>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-2xl text-center md:text-right">
              <p className="text-blue-400 text-[10px] uppercase font-black tracking-widest mb-1">{t.stats.saved}</p>
              <p className="text-3xl font-black text-white">{savedMoney.toLocaleString('ru-RU')} {t.stats.currency}</p>
            </div>
          </div>

          {/* History Section */}
          <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-blue-200">{t.docsTitle}</h2>
          <div className="space-y-4">
            {(!cases || cases.length === 0) ? (
              <p className="text-center text-gray-500 py-10 italic">{t.emptyHistory}</p>
            ) : (
              [...cases].reverse().map((c: any) => (
                <div key={c?.id} className="bg-[#0f192e] border border-blue-500/10 p-6 rounded-2xl flex justify-between items-center hover:bg-blue-900/40 cursor-pointer transition-all group" onClick={() => router.push(`/?case=${c?.id}`)}>
                  <div>
                    <p className="text-blue-100 font-bold group-hover:text-white transition-colors">{c?.title || t.docDefault}</p>
                    <p className="text-gray-500 text-xs mt-1 font-medium">
                        {c?.created_at ? new Date(c.created_at).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US') : ""}
                    </p>
                  </div>
                  <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              ))
            )}
          </div>

          {/* Legal Disclaimer Block */}
          <div className="mt-12 bg-[#0c1527] border border-red-500/20 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500/60 rounded-l-3xl"></div>
            <h2 className="text-lg font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {t.disclaimer.title}
            </h2>
            <div className="space-y-4 text-xs text-gray-400 leading-relaxed font-medium">
              <p>{t.disclaimer.item1}</p>
              <p>{t.disclaimer.item2}</p>
              <p>{t.disclaimer.item3}</p>
              <p>{t.disclaimer.item4} <span className="text-blue-400 font-mono font-bold">{new Date().toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')}</span>.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}