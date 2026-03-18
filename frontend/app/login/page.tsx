"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../LanguageContext'; // ИМПОРТ КОНТЕКСТА

// --- СЛОВАРИ ПЕРЕВОДОВ ---
const translations = {
  ru: {
    auth: "Авторизация", recovery: "Восстановление пароля",
    invalidCreds: "Неверный логин или пароль", noConn: "Нет связи с сервером",
    codeSent: "Код восстановления отправлен на почту", userNotFound: "Пользователь с таким email не найден",
    fullCodeReq: "Введите полный код", pwdChanged: "Пароль успешно изменен! Теперь вы можете войти.",
    invalidCode: "Неверный код восстановления", usernamePlaceholder: "Ваш логин",
    pwdPlaceholder: "Пароль", forgot: "Забыли?", loginBtn: "Войти",
    noAccount: "Нет аккаунта?", createProfile: "Создать профиль",
    enterEmail: "Введите ваш Email для восстановления доступа.", emailPlaceholder: "Ваш Email",
    sendCode: "Отправить код", goBack: "Вернуться назад",
    newPwdPlaceholder: "Новый пароль", savePwd: "Сохранить пароль", cancel: "Отмена"
  },
  kk: {
    auth: "Авторизация", recovery: "Құпиясөзді қалпына келтіру",
    invalidCreds: "Қате логин немесе құпиясөз", noConn: "Сервермен байланыс жоқ",
    codeSent: "Қалпына келтіру коды поштаға жіберілді", userNotFound: "Бұл email бар пайдаланушы табылмады",
    fullCodeReq: "Кодты толық енгізіңіз", pwdChanged: "Құпиясөз сәтті өзгертілді! Енді жүйеге кіре аласыз.",
    invalidCode: "Қалпына келтіру коды қате", usernamePlaceholder: "Сіздің логиніңіз",
    pwdPlaceholder: "Құпиясөз", forgot: "Ұмыттыңыз ба?", loginBtn: "Кіру",
    noAccount: "Аккаунт жоқ па?", createProfile: "Профиль құру",
    enterEmail: "Қол жеткізуді қалпына келтіру үшін Email-ді енгізіңіз.", emailPlaceholder: "Сіздің Email",
    sendCode: "Кодты жіберу", goBack: "Артқа қайту",
    newPwdPlaceholder: "Жаңа құпиясөз", savePwd: "Құпиясөзді сақтау", cancel: "Болдырмау"
  },
  en: {
    auth: "Authorization", recovery: "Password Recovery",
    invalidCreds: "Invalid username or password", noConn: "No connection to server",
    codeSent: "Recovery code sent to email", userNotFound: "User with this email not found",
    fullCodeReq: "Enter the full code", pwdChanged: "Password successfully changed! You can now log in.",
    invalidCode: "Invalid recovery code", usernamePlaceholder: "Your username",
    pwdPlaceholder: "Password", forgot: "Forgot?", loginBtn: "Log in",
    noAccount: "No account?", createProfile: "Create profile",
    enterEmail: "Enter your Email to restore access.", emailPlaceholder: "Your Email",
    sendCode: "Send code", goBack: "Go back",
    newPwdPlaceholder: "New password", savePwd: "Save password", cancel: "Cancel"
  }
};

export default function Login() {
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

  // ПОДКЛЮЧАЕМ ЯЗЫК
  const { lang } = useLanguage();
  const t = translations[lang];

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
        const errData = await res.json().catch(() => ({}));
        setError(errData.detail || t.invalidCreds);
      }
    } catch (err) { 
      setError(t.noConn); 
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
        setMsg(t.codeSent);
      } else {
        setError(t.userNotFound);
      }
    } catch (err) { setError(t.noConn); }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const codeStr = resetDigits.join('');
    if (codeStr.length !== 6) {
      setError(t.fullCodeReq);
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
        setMsg(t.pwdChanged);
        setResetDigits(Array(6).fill(''));
        setNewPassword('');
      } else {
        setError(t.invalidCode);
      }
    } catch (err) { setError(t.noConn); }
  };

  return (
    <div className="min-h-screen bg-[#060b19] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 relative text-white">
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
              <input type="text" required placeholder={t.usernamePlaceholder} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={username} onChange={e => setUsername(e.target.value)} />
              <div className="relative">
                <input type="password" required placeholder={t.pwdPlaceholder} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => { setView('forgot'); setError(''); setMsg(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300 font-medium">{t.forgot}</button>
              </div>
              <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md mt-2">{t.loginBtn}</button>
            </form>
            <div className="mt-8 text-center pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm">{t.noAccount}{' '}
                <button onClick={() => router.push('/register')} className="text-blue-400 font-bold hover:text-blue-300 transition-all">{t.createProfile}</button>
              </p>
            </div>
          </>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-gray-300 text-sm mb-4 text-center">{t.enterEmail}</p>
            <input type="email" required placeholder={t.emailPlaceholder} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none placeholder:text-gray-500/70" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
            <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl">{t.sendCode}</button>
            <button type="button" onClick={() => { setView('login'); setError(''); }} className="w-full text-gray-400 text-sm hover:text-white mt-3">{t.goBack}</button>
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
                    className="w-12 h-12 bg-black/20 border border-white/10 text-white text-center text-xl rounded-full focus:border-blue-500/50 outline-none"
                    value={digit}
                    onChange={e => handleDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                  />
                ))}
            </div>
            <input type="password" required placeholder={t.newPwdPlaceholder} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none placeholder:text-gray-500/70" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md">
              {t.savePwd}
            </button>
            <button type="button" onClick={() => { setView('login'); setError(''); setMsg(''); }} className="w-full text-gray-400 text-sm hover:text-white mt-3">{t.cancel}</button>
          </form>
        )}
      </div>
    </div>
  );
}