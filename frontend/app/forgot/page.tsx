"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = ввод логина, 2 = ввод кода и пароля
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRequestCode = async (e: any) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (res.ok) {
      setStep(2);
      setMessage("Код сгенерирован! Посмотри в терминал Бэкенда.");
    } else {
      setMessage("Пользователь не найден");
    }
  };

  const handleReset = async (e: any) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, code, new_password: newPassword }),
    });
    if (res.ok) {
      alert("Пароль успешно изменен!");
      router.push('/login');
    } else {
      setMessage("Неверный код восстановления");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white">
      <form className="p-8 bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-blue-900/20 w-96 border border-gray-800">
        <h2 className="text-2xl font-semibold mb-2 text-white text-center">Восстановление</h2>
        
        {message && <p className="text-blue-400 text-sm text-center mb-6 bg-blue-900/20 p-2 rounded">{message}</p>}

        {step === 1 ? (
          <>
            <p className="text-gray-400 text-sm text-center mb-6">Введите логин, чтобы получить секретный код</p>
            <input 
              type="text" placeholder="Ваш логин" required
              className="w-full p-3 mb-6 bg-[#1e293b] rounded-xl border border-gray-700 outline-none"
              value={username} onChange={(e) => setUsername(e.target.value)} 
            />
            <button onClick={handleRequestCode} className="w-full bg-blue-600 p-3 rounded-xl font-bold">Получить код</button>
          </>
        ) : (
          <>
            <input 
              type="text" placeholder="4-значный код из терминала" required
              className="w-full p-3 mb-4 bg-[#1e293b] rounded-xl border border-gray-700 outline-none text-center tracking-widest text-xl"
              value={code} onChange={(e) => setCode(e.target.value)} 
            />
            <input 
              type="password" placeholder="Новый пароль" required
              className="w-full p-3 mb-6 bg-[#1e293b] rounded-xl border border-gray-700 outline-none"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
            />
            <button onClick={handleReset} className="w-full bg-green-600 p-3 rounded-xl font-bold">Сохранить пароль</button>
          </>
        )}
        
        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-gray-500 hover:text-white">Вернуться ко входу</Link>
        </div>
      </form>
    </div>
  );
}