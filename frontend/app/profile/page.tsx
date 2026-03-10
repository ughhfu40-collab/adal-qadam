"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState<{ username?: string; email: string; id: number } | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadUserData(token);
    loadUserCases(token);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, [router]);

  const loadUserData = async (token: string) => {
    try {
     const res = await fetch('https://adal-qadam.onrender.com/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 404) {
        setLoadingError("Ошибка 404: На бэкенде нет пути /users/me");
      } else {
        localStorage.removeItem('token'); 
        router.push('/login');
      }
    } catch (e) { 
      setLoadingError("Ошибка связи с сервером. Проверьте терминал бэкенда.");
      console.error(e);
    }
  };

  const loadUserCases = async (token: string) => {
    try {
      const res = await fetch('https://adal-qadam.onrender.com/cases', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setCases(await res.json());
    } catch (e) { console.error("Ошибка загрузки истории"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length <= 2) return name + "***@" + domain;
    return name.substring(0, 2) + "******@" + domain;
  };

  if (loadingError) {
    return (
      <div className="min-h-screen bg-[#080f1e] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h2 className="text-xl text-white mb-2">Не удалось загрузить профиль</h2>
        <p className="text-red-400/80 mb-6">{loadingError}</p>
        <button onClick={() => router.push('/')} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">Вернуться в чат</button>
      </div>
    );
  }

  if (!user) return <div className="min-h-screen bg-[#080f1e] flex items-center justify-center text-blue-400 animate-pulse">Загрузка данных...</div>;

  const savedMoney = cases.length * 50000;
  
  // Если имени нет, берем логин из почты
  const displayName = user.username || user.email.split('@')[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#080f1e] text-gray-200 font-sans overflow-hidden relative">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-0'} transition-all duration-300 bg-[#0c1527]/90 backdrop-blur-xl border-r border-blue-500/10 flex flex-col no-print z-30 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.5)] relative shrink-0`}>
        <div className="w-[280px] flex flex-col h-full">
          <div className="p-6 pb-2 flex justify-center">
             <h2 className="text-2xl font-black tracking-[0.2em] text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.5)] uppercase">Adal Qadam</h2>
          </div>

          <div className="p-5 pt-3">
            <button onClick={() => router.push('/')} className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-blue-600/10 border border-blue-500/20 text-blue-300 p-3 rounded-2xl font-medium transition-all text-[15px]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              В чат ИИ
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
            <p className="text-[11px] font-semibold text-blue-400/60 uppercase tracking-widest mb-3 px-1 mt-2">История обращений</p>
            {cases.map((c) => (
              <button key={c.id} onClick={() => router.push(`/?case=${c.id}`)} className="w-full text-left px-4 py-3 rounded-xl text-[14px] transition-all truncate flex items-center gap-3 text-gray-400 hover:bg-blue-600/10 hover:text-blue-200 border border-transparent">
                <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </div>
          
          <div className="p-5 pt-4 border-t border-blue-500/10 space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-blue-600/20 border border-blue-500/40 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] p-3 rounded-2xl font-medium transition-all text-[15px] group">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">{initial}</div>
              <span className="text-blue-200">Личный кабинет</span>
            </button>
            
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-red-500/15 border border-transparent hover:border-red-500/30 text-gray-500 hover:text-red-400 p-3 rounded-2xl font-medium transition-all text-[14px] group">
              <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Выйти
            </button>
          </div>
        </div>
      </aside>

      {/* КОНТЕНТ ПРОФИЛЯ */}
      <main className="flex-1 flex flex-col h-full relative z-10 w-full overflow-y-auto custom-scrollbar p-6 md:p-12">
        <div className="absolute top-4 left-4 z-20 md:hidden no-print">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 text-blue-300 hover:text-white rounded-xl hover:bg-blue-600/20 transition-all backdrop-blur-md border border-transparent">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </button>
        </div>

        <div className="max-w-5xl mx-auto w-full mt-10 md:mt-0">
          
          <div className="bg-[#0f192e] border border-blue-500/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                <span className="text-5xl text-white font-black">{initial}</span>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-wide text-white mb-2">{displayName}</h1>
                <div className="flex items-center gap-2 text-blue-200 text-sm bg-blue-900/40 px-4 py-1.5 rounded-full border border-blue-500/30 w-fit">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {maskEmail(user.email)}
                </div>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-2xl text-left md:text-right w-full md:w-auto">
              <p className="text-blue-400 text-[11px] uppercase tracking-widest mb-1 font-bold">Сэкономлено на юристах</p>
              <p className="text-4xl font-black text-white">{savedMoney.toLocaleString('ru-RU')} ₸</p>
              <p className="text-blue-300/70 text-sm mt-2">Сгенерировано документов: <span className="text-white font-bold">{cases.length}</span></p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-100 tracking-wide mb-6">Сохраненные документы</h2>
            
            <div className="space-y-4">
              {cases.length === 0 ? (
                <div className="bg-[#0f192e]/50 border border-blue-500/10 rounded-3xl p-10 text-center">
                  <p className="text-blue-300/60 text-lg mb-4">Вы пока не создали ни одного иска.</p>
                  <button onClick={() => router.push('/')} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">Начать консультацию</button>
                </div>
              ) : (
                cases.slice().reverse().map(c => (
                  <div key={c.id} className="bg-[#0f192e] border border-blue-500/20 p-6 rounded-2xl flex justify-between items-center hover:bg-blue-900/30 hover:border-blue-500/40 transition-all cursor-pointer group shadow-lg" onClick={() => router.push(`/?case=${c.id}`)}>
                    <div className="truncate pr-4 flex items-center gap-5">
                      <div className="w-14 h-14 bg-blue-900/40 border border-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/40 transition-all">
                        <svg className="w-6 h-6 text-blue-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-blue-100 text-[17px] font-medium truncate">{c.title}</p>
                        <p className="text-blue-400/60 text-sm mt-1">{new Date(c.created_at).toLocaleDateString('ru-RU')} • Дело #{c.id}</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-blue-500/50 group-hover:text-blue-400 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        body, html { background-color: #080f1e !important; color-scheme: dark; margin: 0; padding: 0; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }
      `}} />
    </div>
  );
}