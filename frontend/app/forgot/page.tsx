"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(''); // В твоем бэкенде сброс идет по Email
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = ввод email, 2 = ввод кода и пароля
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Ссылка на твой бэкенд
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
        setMessage("Код отправлен! Проверь почту (или логи бэкенда).");
      } else {
        setMessage("Пользователь с таким Email не найден");
      }
    } catch (err) {
      setMessage("Нет связи с сервером");
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
        alert("Пароль успешно изменен!");
        router.push('/login');
      } else {
        setMessage("Неверный код восстановления");
      }
    } catch (err) {
      setMessage("Нет связи с сервером");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white">
      <form className="p-8 bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-blue-900/20 w-96 border border-gray-800">
        <h2 className="text-2xl font-semibold mb-2 text-white text-center">Восстановление</h2>
        
        {message && <p className="text-blue-400 text-sm text-center mb-6 bg-blue-900/20 p-2 rounded">{message}</p>}

        {step === 1 ? (
          <>
            <p className="text-gray-400 text-sm text-center mb-6">Введите ваш Email, чтобы получить код доступа</p>
            <input 
              type="email" placeholder="Ваш Email" required
              className="w-full p-3 mb-6 bg-[#1e293b] rounded-xl border border-gray-700 outline-none focus:border-blue-500"
              value={email} onChange={(e) => setEmail(e.target.value)} 
            />
            <button onClick={handleRequestCode} className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-xl font-bold transition-colors">Получить код</button>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-sm text-center mb-4">Введите 6-значный код</p>
            <input 
              type="text" placeholder="Код" required
              className="w-full p-3 mb-4 bg-[#1e293b] rounded-xl border border-gray-700 outline-none text-center tracking-widest text-xl focus:border-blue-500"
              value={code} onChange={(e) => setCode(e.target.value)} 
            />
            <input 
              type="password" placeholder="Новый пароль" required
              className="w-full p-3 mb-6 bg-[#1e293b] rounded-xl border border-gray-700 outline-none focus:border-blue-500"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
            />
            <button onClick={handleReset} className="w-full bg-green-600 hover:bg-green-500 p-3 rounded-xl font-bold transition-colors">Сохранить пароль</button>
          </>
        )}
        
        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-gray-500 hover:text-white">Вернуться ко входу</Link>
        </div>
      </form>
    </div>
  );
}