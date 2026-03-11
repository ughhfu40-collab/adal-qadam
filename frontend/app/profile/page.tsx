"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const router = useRouter();

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
      setLoadingError("Ошибка связи с сервером");
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
      console.error("Ошибка истории"); 
    }
  };

  const handleChangeUsername = async () => {
    const newName = prompt("Введите новый логин (минимум 3 символа):");
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
        alert("Логин успешно изменен! Пожалуйста, войдите снова с новым логином.");
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        const err = await res.json();
        alert(err.detail || "Этот логин уже занят или произошла ошибка");
      }
    } catch (e) { 
      alert("Ошибка связи с сервером"); 
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
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-gray-400 max-w-xs">{loadingError}</p>
        <button onClick={() => router.push('/')} className="mt-6 bg-white text-black px-8 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-all">Назад</button>
      </div>
    );
  }

  if (!user) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-500/50 font-mono text-sm tracking-widest uppercase">Initializing Adal Qadam...</p>
    </div>
  );

  const savedMoney = (cases ? cases.length : 0) * 50000;
  const displayName = user?.username || user?.email?.split('@')[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#020617] text-gray-200 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-500 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col z-30 overflow-hidden`}>
        <div className="w-72 flex flex-col h-full">
          <div className="p-8">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
                <h2 className="text-xl font-bold text-white tracking-tight italic">ADAL QADAM</h2>
             </div>
          </div>

          <nav className="px-4 space-y-1 flex-1">
            {[
                { label: 'В чат ИИ', path: '/', icon: '✨' },
                { label: 'Шаблоны', path: '/templates', icon: '📄' },
                { label: 'База знаний', path: '/education', icon: '🎓' },
                { label: 'Адвокаты', path: '/lawyers', icon: '👨‍⚖️' },
                { label: 'Проверка юриста', path: '/audit', icon: '🕵️‍♂️' }
            ].map((item) => (
                <button 
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${item.label === 'Проверка юриста' ? 'bg-red-500/5 text-red-400 border border-red-500/10' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                >
                  <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
            ))}
          </nav>

          <div className="p-6">
             <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-500 font-mono">Cloud Active</span>
                </div>
             </div>
             <button onClick={handleLogout} className="w-full py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm font-bold flex items-center justify-center gap-2">
                <span>🚪</span> Выйти
             </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12 relative">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Header Card */}
          <section className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-[#0b0f1a] border border-white/5 p-10 rounded-[30px] flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                            {initial}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-[#0b0f1a] rounded-full flex items-center justify-center text-[10px]" title="Verified User">✅</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-black text-white tracking-tight">{displayName}</h1>
                            <button onClick={handleChangeUsername} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all text-blue-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                        </div>
                        <p className="mt-2 font-mono text-sm text-gray-500 bg-black/30 px-4 py-1.5 rounded-full border border-white/5 inline-block italic">
                            {maskEmail(user?.email)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-right">
                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Personal Impact</p>
                        <p className="text-4xl font-black text-white tabular-nums">
                            {savedMoney.toLocaleString('ru-RU')} <span className="text-blue-500 text-xl italic">₸</span>
                        </p>
                        <p className="text-gray-500 text-[10px] mt-1">Сэкономлено средств</p>
                    </div>
                </div>
            </div>
          </section>

          {/* Documents Section */}
          <section>
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
                    Архив документов
                </h2>
                <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">{cases?.length || 0} ITEMS</span>
            </div>

            <div className="grid gap-3">
                {(!cases || cases.length === 0) ? (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center">
                        <p className="text-gray-600 font-medium italic">Ваша история пока пуста</p>
                    </div>
                ) : (
                    [...cases].reverse().map((c: any) => (
                        <div 
                          key={c?.id} 
                          onClick={() => router.push(`/?case=${c?.id}`)}
                          className="group bg-[#0f1423]/50 hover:bg-[#161c30] border border-white/5 p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:translate-x-1"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all">📄</div>
                                <div>
                                    <p className="text-gray-200 font-semibold group-hover:text-white transition-colors">{c?.title || "Документ без названия"}</p>
                                    <p className="text-[10px] text-gray-600 font-mono mt-0.5 uppercase tracking-tighter">
                                        {c?.created_at ? new Date(c.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) : "Дата неизвестна"}
                                    </p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gray-600 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </section>

          {/* Legal Section */}
          <footer className="relative pt-10">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="bg-red-500/[0.02] border border-red-500/10 p-8 rounded-[30px]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Юридический протокол</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[11px] leading-relaxed text-gray-500 uppercase tracking-wider font-medium">
                    <div className="space-y-4">
                        <p><strong className="text-red-500/50 mr-2">01</strong> Adal Qadam — это аналитическая нейросеть. Мы не заменяем адвокатов, а усиливаем вашу позицию.</p>
                        <p><strong className="text-red-500/50 mr-2">02</strong> Любой прогноз носит справочный характер и не гарантирует 100% исход дела в судах РК.</p>
                    </div>
                    <div className="space-y-4">
                        <p><strong className="text-red-500/50 mr-2">03</strong> Итоговое решение остается за пользователем. Платформа не несет ответственности за убытки.</p>
                        <p><strong className="text-red-500/50 mr-2">04</strong> Данные актуальны на: <span className="text-white font-mono">{new Date().toLocaleDateString('ru-RU')}</span>. База обновляется ежедневно.</p>
                    </div>
                </div>
            </div>
            <p className="text-center text-[10px] text-gray-700 mt-10 font-mono tracking-[0.4em] uppercase">Built for Excellence • Kazakhstan 2026</p>
          </footer>

        </div>
      </main>
    </div>
  );
}