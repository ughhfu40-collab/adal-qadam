"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Словарь переводов
const TRANSLATIONS = {
  ru: {
    auth: "Авторизация",
    recovery: "Восстановление",
    loginPh: "Ваш логин",
    passPh: "Пароль",
    forgotBtn: "Забыли?",
    enterBtn: "Войти",
    noAccount: "Нет аккаунта?",
    createBtn: "Создать профиль",
    forgotDesc: "Введите ваш Email для восстановления доступа.",
    emailPh: "Ваш Email",
    sendBtn: "Отправить код",
    backBtn: "Вернуться назад",
    codePh: "Код",
    newPassPh: "Новый пароль",
    saveBtn: "Сохранить пароль",
    cancelBtn: "Отмена",
    errConn: "Нет связи с сервером",
    errCreds: "Неверный логин или пароль",
    errEmail: "Пользователь с таким email не найден",
    errCode: "Неверный код восстановления",
    errFullCode: "Введите полный код",
    msgSent: "Код восстановления отправлен на почту",
    msgSuccess: "Пароль успешно изменен! Теперь вы можете войти."
  },
  kk: {
    auth: "Авторизация",
    recovery: "Қалпына келтіру",
    loginPh: "Логиніңіз",
    passPh: "Құпия сөз",
    forgotBtn: "Ұмыттыңыз ба?",
    enterBtn: "Кіру",
    noAccount: "Аккаунт жоқ па?",
    createBtn: "Профиль жасау",
    forgotDesc: "Кіруді қалпына келтіру үшін Email енгізіңіз.",
    emailPh: "Сіздің Email",
    sendBtn: "Кодты жіберу",
    backBtn: "Артқа қайту",
    codePh: "Код",
    newPassPh: "Жаңа құпия сөз",
    saveBtn: "Құпия сөзді сақтау",
    cancelBtn: "Бас тарту",
    errConn: "Сервермен байланыс жоқ",
    errCreds: "Логин немесе құпия сөз қате",
    errEmail: "Мұндай email бар пайдаланушы табылмады",
    errCode: "Қалпына келтіру коды қате",
    errFullCode: "Толық кодты енгізіңіз",
    msgSent: "Қалпына келтіру коды поштаға жіберілді",
    msgSuccess: "Құпия сөз сәтті өзгертілді! Енді жүйеге кіре аласыз."
  },
  en: {
    auth: "Authorization",
    recovery: "Recovery",
    loginPh: "Username",
    passPh: "Password",
    forgotBtn: "Forgot?",
    enterBtn: "Login",
    noAccount: "No account?",
    createBtn: "Create profile",
    forgotDesc: "Enter your Email to restore access.",
    emailPh: "Your Email",
    sendBtn: "Send Code",
    backBtn: "Go back",
    codePh: "Code",
    newPassPh: "New Password",
    saveBtn: "Save Password",
    cancelBtn: "Cancel",
    errConn: "No server connection",
    errCreds: "Invalid username or password",
    errEmail: "User with this email not found",
    errCode: "Invalid recovery code",
    errFullCode: "Enter full code",
    msgSent: "Recovery code sent to email",
    msgSuccess: "Password changed successfully! You can now log in."
  }
};

export default function Login() {
  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const [view, setView] = useState<'login' | 'forgot' | 'reset'>('login');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [resetDigits, setResetDigits] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const t = TRANSLATIONS[lang];
  const API_URL = "https://adal-qadam.onrender.com";

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1 || (value && !/^\d+$/.test(value))) return;
    const newDigits = [...resetDigits];
    newDigits[index] = value;
    setResetDigits(newDigits);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
      const res = await fetch(`${API_URL}/token`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        router.push('/');
      } else {
        setError(t.errCreds);
      }
    } catch (err) { 
      setError(t.errConn); 
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (res.ok) {
        setView('reset');
        setResetDigits(Array(6).fill(''));
        setMsg(t.msgSent);
      } else {
        setError(t.errEmail);
      }
    } catch (err) { setError(t.errConn); }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const codeStr = resetDigits.join('');
    if (codeStr.length !== 6) {
      setError(t.errFullCode);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/password-reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: codeStr, new_password: newPassword }),
      });
      if (res.ok) {
        setView('login');
        setMsg(t.msgSuccess);
        setResetDigits(Array(6).fill(''));
        setNewPassword('');
      } else {
        setError(t.errCode);
      }
    } catch (err) { setError(t.errConn); }
  };

  return (
    <div className="min-h-screen bg-[#060b19] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Переключатель языков */}
      <div className="absolute top-6 right-6 flex gap-2 z-20">
        {['ru', 'kk', 'en'].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l as any)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${lang === l ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-[0.2em] text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.8)] uppercase mb-4">
            Adal Qadam
          </h1>
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full backdrop-blur-md">
            <span className="text-blue-300 text-[11px] font-bold uppercase tracking-[0.2em]">
              {view === 'login' ? t.auth : t.recovery}
            </span>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-2xl text-center backdrop-blur-md">{error}</div>}
        {msg && <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm rounded-2xl text-center backdrop-blur-md">{msg}</div>}

        {view === 'login' && (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" required placeholder={t.loginPh} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={username} onChange={e => setUsername(e.target.value)} />
              <div className="relative">
                <input type="password" required placeholder={t.passPh} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => { setView('forgot'); setError(''); setMsg(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300 font-medium">{t.forgotBtn}</button>
              </div>
              <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md mt-2 transition-all active:scale-95">{t.enterBtn}</button>
            </form>
            <div className="mt-8 text-center pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm">{t.noAccount}{' '}
                <button onClick={() => router.push('/register')} className="text-blue-400 font-bold hover:text-blue-300 transition-all">{t.createBtn}</button>
              </p>
            </div>
          </>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-gray-300 text-sm mb-4 text-center">{t.forgotDesc}</p>
            <input type="email" required placeholder={t.emailPh} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none placeholder:text-gray-500/70" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
            <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95">{t.sendBtn}</button>
            <button type="button" onClick={() => { setView('login'); setError(''); }} className="w-full text-gray-400 text-sm hover:text-white mt-3">{t.backBtn}</button>
          </form>
        )}

        {view === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <div className="flex justify-center gap-3">
                {resetDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 md:w-12 md:h-12 bg-black/20 border border-white/10 text-white text-center text-xl rounded-full focus:border-blue-500/50 outline-none transition-all"
                    value={digit}
                    onChange={e => handleDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                  />
                ))}
            </div>
            <input type="password" required placeholder={t.newPassPh} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none placeholder:text-gray-500/70" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md transition-all active:scale-95">
              {t.saveBtn}
            </button>
            <button type="button" onClick={() => { setView('login'); setError(''); setMsg(''); }} className="w-full text-gray-400 text-sm hover:text-white mt-3">{t.cancelBtn}</button>
          </form>
        )}
      </div>
    </div>
  );
}