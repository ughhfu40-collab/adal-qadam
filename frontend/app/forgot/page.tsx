"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../LanguageContext'; 

const translations = {
  ru: {
    codeSent: "Код отправлен! Проверь почту (или логи бэкенда).",
    userNotFound: "Пользователь с таким Email не найден",
    noConnection: "Нет связи с сервером",
    successAlert: "Пароль успешно изменен!",
    invalidCode: "Неверный код восстановления",
    title: "Восстановление",
    descStep1: "Введите ваш Email, чтобы получить код доступа",
    emailPlaceholder: "Ваш Email",
    getCodeBtn: "Получить код",
    descStep2: "Введите 6-значный код",
    codePlaceholder: "Код",
    newPwdPlaceholder: "Новый пароль",
    savePwdBtn: "Сохранить пароль",
    backToLogin: "Вернуться ко входу",
    sending: "Отправка..."
  },
  kk: {
    codeSent: "Код жіберілді! Поштаңызды тексеріңіз.",
    userNotFound: "Бұл Email бар пайдаланушы табылмады",
    noConnection: "Сервермен байланыс жоқ",
    successAlert: "Құпиясөз сәтті өзгертілді!",
    invalidCode: "Қалпына келтіру коды қате",
    title: "Қалпына келтіру",
    descStep1: "Қол жеткізу кодын алу үшін Email-ді енгізіңіз",
    emailPlaceholder: "Сіздің Email",
    getCodeBtn: "Кодты алу",
    descStep2: "6 таңбалы кодты енгізіңіз",
    codePlaceholder: "Код",
    newPwdPlaceholder: "Жаңа құпиясөз",
    savePwdBtn: "Құпиясөзді сақтау",
    backToLogin: "Кіру бетіне оралу",
    sending: "Жіберілуде..."
  },
  en: {
    codeSent: "Code sent! Check your email.",
    userNotFound: "User with this Email not found",
    noConnection: "No connection to the server",
    successAlert: "Password successfully changed!",
    invalidCode: "Invalid recovery code",
    title: "Recovery",
    descStep1: "Enter your Email to get the access code",
    emailPlaceholder: "Your Email",
    getCodeBtn: "Get code",
    descStep2: "Enter 6-digit code",
    codePlaceholder: "Code",
    newPwdPlaceholder: "New password",
    savePwdBtn: "Save password",
    backToLogin: "Back to login",
    sending: "Sending..."
  }
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(''); 
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); 
  const [message, setMessage] = useState('');
  const [isPending, setIsPending] = useState(false); // БЛОКИРОВКА КНОПКИ
  const router = useRouter();

  const { lang } = useLanguage();
  // @ts-ignore
  const t = translations[lang] || translations.ru;

  const API_URL = 'https://adal-qadam.onrender.com';

  const handleRequestCode = async (e: any) => {
    e.preventDefault();
    if (isPending) return; // Если уже идет запрос, ничего не делаем

    setIsPending(true);
    setMessage(''); 

    try {
      const res = await fetch(`${API_URL}/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep(2);
        setMessage(t.codeSent);
      } else {
        setMessage(t.userNotFound);
      }
    } catch (err) {
      setMessage(t.noConnection);
    } finally {
      // Разблокируем кнопку через 10 секунд для повторной попытки
      setTimeout(() => setIsPending(false), 10000);
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
        alert(t.successAlert);
        router.push('/login');
      } else {
        setMessage(t.invalidCode);
      }
    } catch (err) {
      setMessage(t.noConnection);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white">
      <form className="p-8 bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-blue-900/20 w-96 border border-gray-800">
        <h2 className="text-2xl font-semibold mb-2 text-white text-center">{t.title}</h2>
        
        {message && <p className="text-blue-400 text-sm text-center mb-6 bg-blue-900/20 p-2 rounded">{message}</p>}

        {step === 1 ? (
          <>
            <p className="text-gray-400 text-sm text-center mb-6">{t.descStep1}</p>
            <input 
              type="email" placeholder={t.emailPlaceholder} required
              className="w-full p-3 mb-6 bg-[#1e293b] rounded-xl border border-gray-700 outline-none focus:border-blue-500"
              value={email} onChange={(e) => setEmail(e.target.value)} 
            />
            <button 
              onClick={handleRequestCode} 
              disabled={isPending}
              className={`w-full p-3 rounded-xl font-bold transition-all ${isPending ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
              {isPending ? t.sending : t.getCodeBtn}
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-sm text-center mb-4">{t.descStep2}</p>
            <input 
              type="text" placeholder={t.codePlaceholder} required
              className="w-full p-3 mb-4 bg-[#1e293b] rounded-xl border border-gray-700 outline-none text-center tracking-widest text-xl focus:border-blue-500"
              value={code} onChange={(e) => setCode(e.target.value)} 
            />
            <input 
              type="password" placeholder={t.newPwdPlaceholder} required
              className="w-full p-3 mb-6 bg-[#1e293b] rounded-xl border border-gray-700 outline-none focus:border-blue-500"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
            />
            <button onClick={handleReset} className="w-full bg-green-600 hover:bg-green-500 p-3 rounded-xl font-bold transition-colors">{t.savePwdBtn}</button>
          </>
        )}
        
        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-gray-500 hover:text-white">{t.backToLogin}</Link>
        </div>
      </form>
    </div>
  );
}