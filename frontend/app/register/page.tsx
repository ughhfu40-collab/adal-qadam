"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  // Состояние для 6 цифр кода
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(''));
  // Рефы для управления фокусом инпутов
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  // Обработчик ввода цифр
  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1 || (value && !/^\d+$/.test(value))) return; // Только 1 цифра
    
    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Перевод фокуса вперед
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Обработчик Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/register/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setStep(2);
        setTimeLeft(60);
      } else setError('Email уже занят');
    } catch (e) { setError('Нет связи с сервером'); }
  };

  const handleResendCode = async () => {
    setError('');
    setCodeDigits(Array(6).fill('')); // Очищаем инпуты
    try {
      const res = await fetch('http://127.0.0.1:8000/register/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setTimeLeft(60);
        inputRefs.current[0]?.focus(); // Фокус на первый инпут
      } else setError('Ошибка при отправке кода');
    } catch (e) { setError('Нет связи с сервером'); }
  };

  const handleFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const codeStr = codeDigits.join(''); // Собираем цифры в строку
    if (codeStr.length !== 6) {
      setError('Введите полный код');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/register/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeStr, username }),
      });
      if (res.ok) router.push('/login');
      else setError('Неверный код или логин занят');
    } catch (e) { setError('Нет связи с сервером'); }
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
      
      <div className="w-full max-w-md z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-[0.2em] text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.8)] uppercase mb-4">
            Adal Qadam
          </h1>
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full backdrop-blur-md shadow-[0_0_10px_rgba(59,130,246,0.1)]">
            <span className="text-blue-300 text-[11px] font-bold uppercase tracking-[0.2em]">
              Регистрация: {step === 1 ? 'Шаг 1' : 'Шаг 2'}
            </span>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-2xl text-center backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.1)]">{error}</div>}
        
        {step === 1 ? (
          <>
            <form onSubmit={handleStep1} className="space-y-4">
              <input type="email" required placeholder="Ваш Email" className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 focus:bg-black/40 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" required placeholder="Придумайте пароль" className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 focus:bg-black/40 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md active:scale-[0.98] mt-2">
                Получить код
              </button>
            </form>
            <div className="mt-8 text-center pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm font-light">Уже есть аккаунт?{' '}
                <button onClick={() => router.push('/login')} className="text-blue-400 font-bold hover:text-blue-300 transition-all drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">Войти</button>
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center bg-blue-500/10 border border-blue-400/20 p-4 rounded-2xl backdrop-blur-md">
              <p className="text-gray-300 text-sm mb-1 font-light">Код подтверждения отправлен на:</p>
              <p className="text-blue-200 font-semibold tracking-wide">{email}</p>
            </div>

            <form onSubmit={handleFinal} className="space-y-5">
              {/* КРУГЛЫЕ ИНПУТЫ ДЛЯ КОДА */}
              <div className="flex justify-center gap-3">
                {codeDigits.map((digit, idx) => (
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

              <input type="text" required placeholder="Придумайте логин" className="w-full bg-black/20 border border-white/10 text-white p-4 rounded-2xl focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-500/70 shadow-inner" value={username} onChange={e => setUsername(e.target.value)} />
              
              <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 backdrop-blur-md active:scale-[0.98]">
                Завершить
              </button>
            </form>

            <div className="text-center pt-2">
              {timeLeft > 0 ? (
                <p className="text-gray-400 text-sm font-light">Код действителен: <span className="text-blue-400 font-mono font-bold">{formatTime(timeLeft)}</span></p>
              ) : (
                <button onClick={handleResendCode} className="text-blue-400 text-sm font-bold hover:text-blue-300 transition-all drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">
                  Отправить код повторно
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}