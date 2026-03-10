"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [view, setView] = useState<'login' | 'forgot' | 'reset'>('login');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Состояние для 6 цифр кода сброса
  const [resetDigits, setResetDigits] = useState<string[]>(Array(6).fill(''));
  // Рефы для управления фокусом
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  // Обработчики для кружков ввода кода
  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1 || (value && !/^\d+$/.test(value))) return;
    const newDigits = [...resetDigits];
    newDigits[index] = value;
    setResetDigits(newDigits);
    
    // Переход фокуса вперед
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Возврат фокуса назад при нажатии Backspace
    if (e.key === 'Backspace' && !resetDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const res = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        router.push('/');
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (e) { setError('Нет связи с сервером'); }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const res = await fetch('http://127.0.0.1:8000/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (res.ok) {
        setView('reset');
        setResetDigits(Array(6).fill('')); // Сброс цифр
        setMsg('Код восстановления отправлен на почту');
      } else {
        setError('Пользователь с таким email не найден');
      }
    } catch (e) { setError('Нет связи с сервером'); }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const codeStr = resetDigits.join('');
    if (codeStr.length !== 6) {
      setError('Введите полный код');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: codeStr, new_password: newPassword }),
      });
      if (res.ok) {
        setView('login');
        setMsg('Пароль успешно изменен! Теперь вы можете войти.');
        setResetDigits(Array(6).fill(''));
        setNewPassword('');
      } else {
        setError('Неверный код восстановления');
      }
    } catch (e) { setError('Нет связи с сервером'); }
  };

  return (
    <div className="min-h-screen bg-[#060b19] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* ФОНОВЫЕ СВЕЧЕНИЯ ДЛЯ СТЕКЛА */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* СТЕКЛЯННАЯ КАРТОЧКА */}
      <div className="w-full max-w-md z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-[0.2em] text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.8)] uppercase mb-4">
            Adal Qadam
          </h1>
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full backdrop-blur-md shadow-[0_0_10px_rgba(59,130,246,0.1)]">
            <span className="text-blue-300 text-[11px] font-bold uppercase tracking-[0.2em]">
              {view === 'login' ? 'Авторизация' : 'Восстановление пароля'}
            </span>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-2xl text-center backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.1)]">{error}</div>}
        {msg && <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm rounded-2xl text-center backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.1)]">{msg}</div>}

        {/* --- ФОРМА ЛОГИНА --- */}
        {view === 'login' && (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" required placeholder="Ваш логин" className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 focus:bg-black/40 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={username} onChange={e => setUsername(e.target.value)} />
              <div className="relative">
                <input type="password" required placeholder="Пароль" className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 focus:bg-black/40 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => { setView('forgot'); setError(''); setMsg(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-all drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">Забыли?</button>
              </div>
              <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md active:scale-[0.98] mt-2">Войти</button>
            </form>
            <div className="mt-8 text-center pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm font-light">Нет аккаунта?{' '}
                <button onClick={() => router.push('/register')} className="text-blue-400 font-bold hover:text-blue-300 transition-all drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">Создать профиль</button>
              </p>
            </div>
          </>
        )}

        {/* --- ФОРМА ВВОДА EMAIL ДЛЯ СБРОСА --- */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-gray-300 text-sm mb-4 text-center font-light">Введите ваш Email, и мы отправим вам код для восстановления доступа.</p>
            <input type="email" required placeholder="Ваш Email" className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 focus:bg-black/40 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
            <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md active:scale-[0.98]">Отправить код</button>
            <button type="button" onClick={() => { setView('login'); setError(''); }} className="w-full text-gray-400 text-sm hover:text-white transition-all mt-3">Вернуться назад</button>
          </form>
        )}

        {/* --- ФОРМА ВВОДА КОДА И НОВОГО ПАРОЛЯ --- */}
        {view === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-5">
             {/* КРУГЛЫЕ ИНПУТЫ ДЛЯ КОДА СБРОСА */}
            <div className="flex justify-center gap-3">
                {resetDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 bg-black/20 border border-white/10 text-white text-center text-xl rounded-full focus:border-blue-500/50 focus:bg-black/40 outline-none transition-all shadow-inner"
                    value={digit}
                    onChange={e => handleDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                  />
                ))}
            </div>
            <input type="password" required placeholder="Новый пароль" className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 focus:bg-black/40 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            
            <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md active:scale-[0.98]">
              Сохранить пароль
            </button>
            <button type="button" onClick={() => { setView('login'); setError(''); setMsg(''); }} className="w-full text-gray-400 text-sm hover:text-white transition-all mt-3">Отмена</button>
          </form>
        )}
      </div>
    </div>
  );
}