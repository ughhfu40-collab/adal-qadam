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

  // --- ФУНКЦИЯ СМЕНЫ ЛОГИНА ---
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
      <div className="min-h-screen bg-[#080f1e] flex flex-col items-center justify-center p-6 text-white">
        <p>{loadingError}</p>
        <button onClick={() => router.push('/')} className="mt-4 bg-blue-600 px-4 py-2 rounded">Назад</button>
      </div>
    );
  }

  if (!user) return <div className="min-h-screen bg-[#080f1e] flex items-center justify-center text-blue-400">Загрузка...</div>;

  const savedMoney = (cases ? cases.length : 0) * 50000;
  const displayName = user?.username || user?.email?.split('@')[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#080f1e] text-gray-200 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
      
      <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-0'} transition-all duration-300 bg-[#0c1527]/90 backdrop-blur-xl border-r border-blue-500/10 flex flex-col z-30 overflow-hidden shrink-0`}>
        <div className="w-[280px] flex flex-col h-full">
          <div className="p-6 text-center">
             <h2 className="text-2xl font-black text-blue-200 uppercase">Adal Qadam</h2>
          </div>
          <div className="p-5 space-y-3">
            <button onClick={() => router.push('/')} className="w-full flex items-center justify-center gap-2 border border-blue-500/20 text-blue-300 p-3 rounded-2xl hover:bg-blue-600/10 transition-all">
              В чат ИИ
            </button>
            <button onClick={() => router.push('/templates')} className="w-full flex items-center justify-center gap-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 p-3 rounded-2xl hover:bg-purple-600/40 transition-all font-medium">
              📄 Шаблоны документов
            </button>
            <button onClick={() => router.push('/education')} className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 p-3 rounded-2xl hover:bg-emerald-600/40 transition-all font-medium">
              🎓 База знаний
            </button>
            <button onClick={() => router.push('/lawyers')} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-500 transition-all font-medium">
              👨‍⚖️ Каталог адвокатов
            </button>
            <button onClick={() => router.push('/audit')} className="w-full flex items-center justify-center gap-2 bg-red-600/20 border border-red-500/30 text-red-300 p-3 rounded-2xl hover:bg-red-600/40 transition-all font-medium">
              🕵️‍♂️ Проверка юриста
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            {cases && cases.map((c: any) => (
              <button key={c?.id} onClick={() => router.push(`/?case=${c?.id}`)} className="w-full text-left px-4 py-3 rounded-xl text-[14px] truncate text-gray-400 hover:bg-blue-600/10 hover:text-blue-200 block mb-1">
                {c?.title || "Без названия"}
              </button>
            ))}
          </div>
          <div className="p-5 border-t border-blue-500/10">
            <button onClick={handleLogout} className="w-full text-gray-500 hover:text-red-400 p-3 transition-all">
              Выйти
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0f192e] border border-blue-500/20 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">{initial}</div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-white">{displayName}</h1>
                  {/* КНОПКА РЕДАКТИРОВАНИЯ ЛОГИНА */}
                  <button onClick={handleChangeUsername} className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-blue-400 group" title="Изменить логин">
                    <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <p className="text-blue-300 text-sm bg-blue-900/40 px-3 py-1 rounded-full mt-1 inline-block">{maskEmail(user?.email)}</p>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-2xl">
              <p className="text-blue-400 text-xs uppercase font-bold">Сэкономлено</p>
              <p className="text-3xl font-black text-white">{savedMoney.toLocaleString('ru-RU')} ₸</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-6">Документы</h2>
          <div className="space-y-4">
            {(!cases || cases.length === 0) ? (
              <p className="text-center text-gray-500 py-10">История пуста</p>
            ) : (
              [...cases].reverse().map((c: any) => (
                <div key={c?.id} className="bg-[#0f192e] border border-blue-500/20 p-6 rounded-2xl flex justify-between items-center hover:bg-blue-900/40 cursor-pointer" onClick={() => router.push(`/?case=${c?.id}`)}>
                  <div>
                    <p className="text-blue-100 font-medium">{c?.title || "Документ"}</p>
                    <p className="text-gray-500 text-xs">
                        {c?.created_at ? new Date(c.created_at).toLocaleDateString('ru-RU') : ""}
                    </p>
                  </div>
                  <span className="text-blue-500">→</span>
                </div>
              ))
            )}
          </div>

          {/* НОВЫЙ БЛОК: ЮРИДИЧЕСКАЯ ЗАЩИТА (DISCLAIMER) */}
          <div className="mt-12 bg-[#0c1527] border border-red-500/20 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500/60 rounded-l-3xl"></div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Юридические оговорки и защита от ответственности
            </h2>
            <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
              <p>
                <strong className="text-gray-300">1. Статус сервиса:</strong> Adal Qadam является информационно-аналитическим инструментом. Сервис не оказывает юридическую помощь в смысле, определённом Законом РК «Об адвокатской деятельности и юридической помощи».
              </p>
              <p>
                <strong className="text-gray-300">2. Отказ от юридической ответственности:</strong> Прогнозируемый результат носит «информационный и справочный характер» и не является юридическим заключением, рекомендацией или гарантией исхода дела. Ответственность за окончательные решения остаётся за пользователем.
              </p>
              <p>
                <strong className="text-gray-300">3. Ограничение ответственности:</strong> Сервис не несёт ответственности за прямые или косвенные убытки, возникшие в результате использования платформы. Прогнозы могут не совпадать с фактическим решением суда.
              </p>
              <p>
                <strong className="text-gray-300">4. Дата актуальности:</strong> Все прогнозы основаны на актуальной базе судебных решений. Текущая сессия: <span className="text-blue-400 font-mono">{new Date().toLocaleDateString('ru-RU')}</span>.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}