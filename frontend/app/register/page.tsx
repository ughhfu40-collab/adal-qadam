"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Словарь переводов
const TRANSLATIONS = {
  ru: {
    step: "Шаг",
    step1: "Регистрация: Шаг 1",
    step2: "Регистрация: Шаг 2",
    emailPh: "Ваш Email",
    passPh: "Придумайте пароль",
    btnGetCode: "Получить код",
    haveAccount: "Уже есть аккаунт?",
    loginBtn: "Войти",
    sentTo: "Код подтверждения отправлен на:",
    userPh: "Придумайте логин",
    btnFinal: "Завершить",
    timer: "Код действителен:",
    resendBtn: "Отправить код повторно",
    errConn: "Нет связи с сервером",
    errEmail: "Email уже занят",
    errFullCode: "Введите полный код",
    errResend: "Ошибка при отправке кода",
    errFinal: "Неверный код или логин занят"
  },
  kk: {
    step: "Қадам",
    step1: "Тіркелу: 1-қадам",
    step2: "Тіркелу: 2-қадам",
    emailPh: "Сіздің Email",
    passPh: "Құпия сөзді ойлап табыңыз",
    btnGetCode: "Кодты алу",
    haveAccount: "Аккаунт бар ма?",
    loginBtn: "Кіру",
    sentTo: "Растау коды мына мекенжайға жіберілді:",
    userPh: "Логин ойлап табыңыз",
    btnFinal: "Аяқтау",
    timer: "Кодтың жарамдылығы:",
    resendBtn: "Кодты қайта жіберу",
    errConn: "Сервермен байланыс жоқ",
    errEmail: "Бұл Email бос емес",
    errFullCode: "Толық кодты енгізіңіз",
    errResend: "Кодты жіберу қатесі",
    errFinal: "Код қате немесе логин бос емес"
  },
  en: {
    step: "Step",
    step1: "Registration: Step 1",
    step2: "Registration: Step 2",
    emailPh: "Your Email",
    passPh: "Create a password",
    btnGetCode: "Get code",
    haveAccount: "Already have an account?",
    loginBtn: "Login",
    sentTo: "Confirmation code sent to:",
    userPh: "Create a username",
    btnFinal: "Complete",
    timer: "Code expires in:",
    resendBtn: "Resend code",
    errConn: "No server connection",
    errEmail: "Email is already taken",
    errFullCode: "Enter full code",
    errResend: "Error resending code",
    errFinal: "Invalid code or username taken"
  }
};

export default function Register() {
  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();

  const t = TRANSLATIONS[lang];
  const API_URL = "https://adal-qadam.onrender.com";

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1 || (value && !/^\d+$/.test(value))) return;
    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/register/step1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setStep(2);
        setTimeLeft(60);
      } else {
        setError(t.errEmail);
      }
    } catch (err) { setError(t.errConn); }
  };

  const handleResendCode = async () => {
    setError('');
    setCodeDigits(Array(6).fill(''));
    try {
      const res = await fetch(`${API_URL}/register/step1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setTimeLeft(60);
        inputRefs.current[0]?.focus();
      } else setError(t.errResend);
    } catch (err) { setError(t.errConn); }
  };

  const handleFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const codeStr = codeDigits.join('');
    if (codeStr.length !== 6) {
      setError(t.errFullCode);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register/final`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeStr, username }),
      });
      if (res.ok) {
        router.push('/login');
      } else {
        setError(t.errFinal);
      }
    } catch (err) { setError(t.errConn); }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#060b19] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Language Switcher */}
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
      
      <div className="w-full max-w-md z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 relative text-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-[0.2em] text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.8)] uppercase mb-4">
            Adal Qadam
          </h1>
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full backdrop-blur-md">
            <span className="text-blue-300 text-[11px] font-bold uppercase tracking-[0.2em]">
              {step === 1 ? t.step1 : t.step2}
            </span>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-2xl text-center backdrop-blur-md">{error}</div>}
        
        {step === 1 ? (
          <>
            <form onSubmit={handleStep1} className="space-y-4">
              <input type="email" required placeholder={t.emailPh} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" required placeholder={t.passPh} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md mt-2 transition-all active:scale-95">
                {t.btnGetCode}
              </button>
            </form>
            <div className="mt-8 text-center pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm font-light">{t.haveAccount}{' '}
                <button onClick={() => router.push('/login')} className="text-blue-400 font-bold hover:text-blue-300 transition-all">{t.loginBtn}</button>
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center bg-blue-500/10 border border-blue-400/20 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-gray-300 text-xs mb-1 font-light">{t.sentTo}</p>
              <p className="text-blue-200 font-bold tracking-wide text-sm">{email}</p>
            </div>

            <form onSubmit={handleFinal} className="space-y-5">
              <div className="flex justify-center gap-3">
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 md:w-12 md:h-12 bg-black/20 border border-white/10 text-white text-center text-xl rounded-full focus:border-blue-500/50 outline-none transition-all shadow-inner"
                    value={digit}
                    onChange={e => handleDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                  />
                ))}
              </div>

              <input type="text" required placeholder={t.userPh} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none placeholder:text-gray-500/70 shadow-inner" value={username} onChange={e => setUsername(e.target.value)} />
              
              <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md transition-all active:scale-95">
                {t.btnFinal}
              </button>
            </form>

            <div className="text-center pt-2">
              {timeLeft > 0 ? (
                <p className="text-gray-400 text-xs font-light">{t.timer} <span className="text-blue-400 font-mono font-bold">{formatTime(timeLeft)}</span></p>
              ) : (
                <button onClick={handleResendCode} className="text-blue-400 text-xs font-bold hover:text-blue-300 transition-all uppercase tracking-wider">
                  {t.resendBtn}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}