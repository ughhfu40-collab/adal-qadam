"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Словарь переводов
const TRANSLATIONS = {
  ru: {
    title: "Восстановление",
    subtitle: "Введите ваш Email, чтобы получить код доступа",
    phEmail: "Ваш Email",
    btnGetCode: "Получить код",
    step2Subtitle: "Введите 6-значный код",
    phCode: "Код",
    phNewPassword: "Новый пароль",
    btnSave: "Сохранить пароль",
    back: "Вернуться ко входу",
    msgSent: "Код отправлен! Проверь почту (или логи бэкенда).",
    msgNotFound: "Пользователь с таким Email не найден",
    msgError: "Нет связи с сервером",
    msgSuccess: "Пароль успешно изменен!",
    msgWrongCode: "Неверный код восстановления"
  },
  kk: {
    title: "Қалпына келтіру",
    subtitle: "Кіру кодын алу үшін Email-ды енгізіңіз",
    phEmail: "Сіздің Email",
    btnGetCode: "Кодты алу",
    step2Subtitle: "6 таңбалы кодты енгізіңіз",
    phCode: "Код",
    phNewPassword: "Жаңа құпия сөз",
    btnSave: "Құпия сөзді сақтау",
    back: "Кіруге қайту",
    msgSent: "Код жіберілді! Поштаны (немесе бэкенд логтарын) тексеріңіз.",
    msgNotFound: "Мұндай Email бар пайдаланушы табылмады",
    msgError: "Сервермен байланыс жоқ",
    msgSuccess: "Құпия сөз сәтті өзгертілді!",
    msgWrongCode: "Қалпына келтіру коды қате"
  },
  en: {
    title: "Recovery",
    subtitle: "Enter your Email to receive an access code",
    phEmail: "Your Email",
    btnGetCode: "Get Code",
    step2Subtitle: "Enter the 6-digit code",
    phCode: "Code",
    phNewPassword: "New Password",
    btnSave: "Save Password",
    back: "Back to Login",
    msgSent: "Code sent! Check your email (or backend logs).",
    msgNotFound: "User with this Email not found",
    msgError: "No connection to the server",
    msgSuccess: "Password changed successfully!",
    msgWrongCode: "Invalid recovery code"
  }
};

export default function ForgotPasswordPage() {
  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const t = TRANSLATIONS[lang];
  const API_URL = 'https://adal-qadam.onrender.com';

  const handleRequestCode = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep(2);
        setMessage(t.msgSent);
      } else {
        setMessage(t.msgNotFound);
      }
    } catch (err) {
      setMessage(t.msgError);
    }
  };

  const handleReset = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/password-reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      });
      if (res.ok) {
        alert(t.msgSuccess);
        router.push('/login');
      } else {
        setMessage(t.msgWrongCode);
      }
    } catch (err) {
      setMessage(t.msgError);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white p-4 relative">
      
      {/* Переключатель языков */}
      <div className="absolute top-6 right-6 flex gap-2">
        {['ru', 'kk', 'en'].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l as any)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${lang === l ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0f172a] border-gray-700 text-gray-400'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <form className="p-8 bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-blue-900/20 w-full max-w-sm border border-gray-800">
        <h2 className="text-2xl font-semibold mb-2 text-white text-center">{t.title}</h2>
        
        {message && (
          <p className="text-blue-400 text-sm text-center mb-6 bg-blue-900/20 p-2 rounded animate-pulse">
            {message}
          </p>
        )}

        {step === 1 ? (
          <>
            <p className="text-gray-400 text-sm text-center mb-6">{t.subtitle}</p>
            <input 
              type="email" placeholder={t.phEmail} required
              className="w-full p-3 mb-6 bg-[#1e293b] rounded-xl border border-gray-700 outline-none focus:border-blue-500 transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)} 
            />
            <button 
              onClick={handleRequestCode} 
              className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              {t.btnGetCode}
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-sm text-center mb-4">{t.step2Subtitle}</p>
            <input 
              type="text" placeholder={t.phCode} required
              className="w-full p-3 mb-4 bg-[#1e293b] rounded-xl border border-gray-700 outline-none text-center tracking-widest text-xl focus:border-blue-500 transition-all"
              value={code} onChange={(e) => setCode(e.target.value)} 
            />
            <input 
              type="password" placeholder={t.phNewPassword} required
              className="w-full p-3 mb-6 bg-[#1e293b] rounded-xl border border-gray-700 outline-none focus:border-blue-500 transition-all"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
            />
            <button 
              onClick={handleReset} 
              className="w-full bg-green-600 hover:bg-green-500 p-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-green-900/20"
            >
              {t.btnSave}
            </button>
          </>
        )}
        
        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors uppercase tracking-wider font-semibold">
            {t.back}
          </Link>
        </div>
      </form>
    </div>
  );
}