"use client";
import { useLanguage } from "@/context/LanguageContext";
import LangSwitcher from "@/components/LangSwitcher";
// ... остальные импорты

const T = {
  ru: { chat: "В чат ИИ", templates: "Шаблоны", docs: "Документы" },
  kk: { chat: "ЖИ чатқа", templates: "Үлгілер", docs: "Құжаттар" },
  en: { chat: "AI Chat", templates: "Templates", docs: "Documents" }
};

export default function Profile() {
  const { lang } = useLanguage(); // Достаем язык из "мозга"
  const t = T[lang]; // Берем переводы

  return (
    <div className="flex ...">
       {/* В Сайдбаре рядом с логотипом добавь переключатель */}
       <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-black text-white">Adal Qadam</h2>
          <LangSwitcher />
       </div>

       {/* Текст кнопок теперь меняется сам! */}
       <button className="...">{t.chat}</button>
       <button className="...">{t.templates}</button>
       <h2 className="...">{t.docs}</h2>
    </div>
  );
}