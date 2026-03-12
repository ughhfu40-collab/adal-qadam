"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const LAWYERS = [
  {
    id: 1,
    name: "Аскар Болатов",
    specialization: "Семейное право",
    experience: "12 лет",
    winRate: "89%",
    rating: 4.9,
    price: "от 15 000 ₸",
    imageInitials: "АБ"
  },
  {
    id: 2,
    name: "Динара Сатпаева",
    specialization: "Гражданские споры",
    experience: "8 лет",
    winRate: "92%",
    rating: 5.0,
    price: "от 20 000 ₸",
    imageInitials: "ДС"
  },
  {
    id: 3,
    name: "Тимур Оспанов",
    specialization: "Бизнес и налоги",
    experience: "15 лет",
    winRate: "85%",
    rating: 4.8,
    price: "от 50 000 ₸",
    imageInitials: "ТО"
  },
  {
    id: 4,
    name: "Елена Смирнова",
    specialization: "Трудовые споры",
    experience: "6 лет",
    winRate: "95%",
    rating: 4.7,
    price: "от 10 000 ₸",
    imageInitials: "ЕС"
  }
];

export default function LawyersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  
  const filteredLawyers = LAWYERS.filter(lawyer => 
    lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080f1e] text-gray-200 p-6 md:p-12 relative overflow-hidden">
      {/* Фоновое свечение */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-10 border-b border-blue-500/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-blue-500">⚖️</span> Каталог адвокатов
            </h1>
            <p className="text-gray-400 mt-2">Найдите проверенного специалиста для вашего дела</p>
          </div>
          <button 
            onClick={() => router.push('/')} 
            className="px-5 py-2.5 bg-[#0c1527] border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all"
          >
            Вернуться в чат
          </button>
        </div>

        {/* Поиск */}
        <div className="mb-8 relative">
          <input 
            type="text" 
            placeholder="Поиск по имени или специализации (например, Семейное право)..." 
            className="w-full bg-[#0c1527] border border-blue-500/20 rounded-2xl p-4 pl-12 text-white outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-6 h-6 text-gray-500 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Сетка карточек адвокатов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-[#0f192e] border border-blue-500/10 p-6 rounded-3xl hover:border-blue-500/40 transition-all flex flex-col md:flex-row gap-6 items-center md:items-start group">
              {/* Аватар */}
              <div className="w-20 h-20 shrink-0 bg-blue-900/50 rounded-full flex items-center justify-center text-2xl font-bold text-blue-300 border border-blue-500/20 group-hover:scale-105 transition-transform">
                {lawyer.imageInitials}
              </div>
              
              {/* Информация */}
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex justify-between items-start mb-2 flex-col md:flex-row">
                  <h3 className="text-xl font-bold text-white">{lawyer.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg text-sm font-bold mt-2 md:mt-0">
                    ⭐ {lawyer.rating}
                  </div>
                </div>
                
                <p className="text-blue-400 text-sm mb-4 font-medium">{lawyer.specialization}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-6 bg-[#0c1527] p-4 rounded-xl">
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">Опыт работы</span>
                    <strong className="text-white">{lawyer.experience}</strong>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">Успешные дела</span>
                    <strong className="text-green-400">{lawyer.winRate}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gray-300 font-bold">{lawyer.price}</span>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-500 transition-all text-sm font-medium">
                    Связаться
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLawyers.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              По вашему запросу адвокаты не найдены.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 