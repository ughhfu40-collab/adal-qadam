"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../LanguageContext'; // ИМПОРТ КОНТЕКСТА ЯЗЫКА

// --- СЛОВАРИ ПЕРЕВОДОВ ---
const translations = {
  ru: {
    regTitle: "Регистрация:", step1: "Шаг 1", step2: "Шаг 2",
    emailTaken: "Email уже занят", noConnection: "Нет связи с сервером",
    sendError: "Ошибка при отправке кода", fullCodeReq: "Введите полный код",
    invalidCodeOrLogin: "Неверный код или логин занят", emailPlaceholder: "Ваш Email",
    passwordPlaceholder: "Придумайте пароль", getCode: "Получить код",
    alreadyHave: "Уже есть аккаунт?", login: "Войти",
    codeSentTo: "Код подтверждения отправлен на:", usernamePlaceholder: "Придумайте логин",
    finish: "Завершить", codeValid: "Код действителен:", resendCode: "Отправить код повторно"
  },
  kk: {
    regTitle: "Тіркелу:", step1: "1-қадам", step2: "2-қадам",
    emailTaken: "Email бос емес", noConnection: "Сервермен байланыс жоқ",
    sendError: "Кодты жіберу қатесі", fullCodeReq: "Кодты толық енгізіңіз",
    invalidCodeOrLogin: "Код қате немесе логин бос емес", emailPlaceholder: "Сіздің Email",
    passwordPlaceholder: "Құпиясөз ойлап табыңыз", getCode: "Кодты алу",
    alreadyHave: "Аккаунтыңыз бар ма?", login: "Кіру",
    codeSentTo: "Растау коды жіберілді:", usernamePlaceholder: "Логин ойлап табыңыз",
    finish: "Аяқтау", codeValid: "Код жарамды:", resendCode: "Кодты қайта жіберу"
  },
  en: {
    regTitle: "Registration:", step1: "Step 1", step2: "Step 2",
    emailTaken: "Email is already taken", noConnection: "No connection to server",
    sendError: "Error sending code", fullCodeReq: "Enter the full code",
    invalidCodeOrLogin: "Invalid code or username is taken", emailPlaceholder: "Your Email",
    passwordPlaceholder: "Create a password", getCode: "Get code",
    alreadyHave: "Already have an account?", login: "Log in",
    codeSentTo: "Verification code sent to:", usernamePlaceholder: "Create a username",
    finish: "Finish", codeValid: "Code valid for:", resendCode: "Resend code"
  }
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false); // ДОБАВЛЕНО
  
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();

  // ПОДКЛЮЧАЕМ ЯЗЫК
  const { lang } = useLanguage();
  const t = translations[lang];

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

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setIsPending(true);
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
        const data = await res.json().catch(() => ({}));
        setError(data.detail || t.emailTaken);
      }
    } catch (err) { setError(t.noConnection); }
    finally { setIsPending(false); }
  };

  const handleResendCode = async () => {
    if (isPending) return;
    setIsPending(true);
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
      } else setError(t.sendError);
    } catch (err) { setError(t.noConnection); }
    finally { setIsPending(false); }
  };

  const handleFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setError('');
    const codeStr = codeDigits.join('');
    if (codeStr.length !== 6) {
      setError(t.fullCodeReq);
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch(`${API_URL}/register/final`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeStr, username }),
      });
      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || t.invalidCodeOrLogin);
      }
    } catch (err) { setError(t.noConnection); }
    finally { setIsPending(false); }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
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
              {t.regTitle} {step === 1 ? t.step1 : t.step2}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-2xl text-center backdrop-blur-md">
            {error}
          </div>
        )}
        
        {step === 1 ? (
          <>
            <form onSubmit={handleStep1} className="space-y-4">
              <input type="email" required placeholder={t.emailPlaceholder} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" required placeholder={t.passwordPlaceholder} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="submit" disabled={isPending} className={`w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed`}>
                {isPending ? '...' : t.getCode}
              </button>
            </form>
            <div className="mt-8 text-center pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm font-light">{t.alreadyHave}{' '}
                <button onClick={() => router.push('/login')} className="text-blue-400 font-bold hover:text-blue-300 transition-all">{t.login}</button>
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center bg-blue-500/10 border border-blue-400/20 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-gray-300 text-sm mb-1 font-light">{t.codeSentTo}</p>
              <p className="text-blue-200 font-semibold tracking-wide">{email}</p>
            </div>

            <form onSubmit={handleFinal} className="space-y-5">
              <div className="flex justify-center gap-3">
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 bg-black/20 border border-white/10 text-white text-center text-xl rounded-full focus:border-blue-500/50 outline-none transition-all shadow-inner"
                    value={digit}
                    onChange={e => handleDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                  />
                ))}
              </div>

              <input type="text" required placeholder={t.usernamePlaceholder} className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none placeholder:text-gray-500/70 shadow-inner" value={username} onChange={e => setUsername(e.target.value)} />
              
              <button type="submit" disabled={isPending} className={`w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed`}>
                {isPending ? '...' : t.finish}
              </button>
            </form>

            <div className="text-center pt-2">
              {timeLeft > 0 ? (
                <p className="text-gray-400 text-sm font-light">{t.codeValid} <span className="text-blue-400 font-mono font-bold">{formatTime(timeLeft)}</span></p>
              ) : (
                <button onClick={handleResendCode} disabled={isPending} className={`text-blue-400 text-sm font-bold hover:text-blue-300 transition-all disabled:opacity-50`}>
                  {isPending ? '...' : t.resendCode}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}