"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [isListening, setIsListening] = useState(false);
  
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const API_URL = 'https://adal-qadam.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadCases();

    const params = new URLSearchParams(window.location.search);
    const cId = params.get('case');
    const templatePrompt = params.get('template_prompt');

    if (cId) {
      loadCaseChat(parseInt(cId));
    } else if (templatePrompt) {
      setText(templatePrompt);
      setTimeout(() => {
        window.history.replaceState({}, document.title, "/"); 
      }, 500);
    }

    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, [router]);

  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  }, [messages, loading]);

  const downloadPDF = (content: string, title: string) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; color: black; background: white;">
        <h1 style="text-align: center; color: #1e3a8a;">ADAL QADAM</h1>
        <p style="text-align: center; font-size: 12px; color: #666;">Юридический анализ и документы</p>
        <hr style="margin: 20px 0;"/>
        <div style="line-height: 1.6; font-size: 14px;">${content}</div>
        
        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 10px; color: #777;">
          <p><strong>Отказ от ответственности:</strong> Данный документ сформирован ИИ Adal Qadam. 
          Результат носит справочный характер и не является юридическим заключением или гарантией исхода дела. 
          Сервис не оказывает юридическую помощь в смысле Закона РК «Об адвокатской деятельности».</p>
        </div>
      </div>
    `;
    const opt = {
      margin: 0.5,
      filename: `Adal_Qadam_${title || 'document'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert("Ваш браузер не поддерживает голосовой ввод.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
    } else {
      setIsListening(false);
      return;
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev + (prev ? " " : "") + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const loadCases = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/cases`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setCases(await res.json());
    } else if (res.status === 401) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const loadCaseChat = async (caseId: number) => {
    const token = localStorage.getItem('token');
    setActiveCaseId(caseId);
    const res = await fetch(`${API_URL}/cases/${caseId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setMessages(await res.json());
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const startNewCase = () => {
    setActiveCaseId(null);
    setMessages([]);
    setText('');
    setFile(null);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSend = async () => {
    if (!text && !file) return;
    
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    if (text) formData.append('text', text);
    if (file) formData.append('file', file);
    if (activeCaseId) formData.append('case_id', activeCaseId.toString());

    const newMsg = { role: 'user', content: text || `[Прикреплен файл: ${file?.name}]` };
    setMessages(prev => [...prev, newMsg]);
    
    setLoading(true);
    setText('');
    setFile(null);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'ai', content: data.analysis }]);
        
        if (!activeCaseId && data.case_id) {
          setActiveCaseId(data.case_id);
          loadCases();
        }
      }
    } catch (e) {
      alert("Нет связи с сервером.");
    }
    setLoading(false);
  };

  // --- ВОЗВРАЩЕННАЯ ФУНКЦИЯ ВЫХОДА ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // --- НОВАЯ ФУНКЦИЯ КРАСИВОГО ТЕКСТА ---
  const formatMessage = (content: string) => {
    if (!content) return '';
    let html = content;
    
    // Заголовки
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-6 mb-2 text-blue-300">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-black mt-6 mb-3 text-blue-200">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black mt-6 mb-4 text-white">$1</h1>');
    
    // Жирный текст
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    
    // Нумерованные списки
    html = html.replace(/(?:^|\n)(\d+)\.\s+(.*)/g, '<div class="ml-4 mt-2 flex items-start"><span class="mr-2 text-blue-500 font-bold">$1.</span><span>$2</span></div>');
    
    // Маркированные списки
    html = html.replace(/(?:^|\n)(?:->|-|\*)\s+(.*)/g, '<div class="ml-4 mt-2 flex items-start"><span class="mr-2 text-blue-500">•</span><span>$1</span></div>');

    // Переносы строк (абзацы)
    html = html.replace(/\n/g, '<br/>');
    
    // Убираем лишние пустые строки после блоков, чтобы не было гигантских дыр
    html = html.replace(/<\/div><br\/>/g, '</div>');
    html = html.replace(/<\/h1><br\/>/g, '</h1>');
    html = html.replace(/<\/h2><br\/>/g, '</h2>');
    html = html.replace(/<\/h3><br\/>/g, '</h3>');
    
    // Оборачиваем в контейнер с увеличенным интервалом строк для лучшей читаемости
    return `<div class="leading-relaxed tracking-wide">${html}</div>`;
  };

  return (
    <div className="flex h-screen bg-[#080f1e] text-gray-200 font-sans overflow-hidden relative">
       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-0'} transition-all duration-300 bg-[#0c1527]/90 backdrop-blur-xl border-r border-blue-500/10 flex flex-col no-print z-30 overflow-hidden relative shrink-0`}>
        <div className="w-[280px] flex flex-col h-full">
          <div className="p-6 pb-2 flex justify-center text-center">
             <h2 className="text-2xl font-black tracking-[0.2em] text-blue-200 uppercase">Adal Qadam</h2>
          </div>
           <div className="p-5 pt-3">
            <button onClick={startNewCase} className="w-full flex items-center justify-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-100 p-3 rounded-2xl font-medium transition-all hover:bg-blue-600/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Новое дело
            </button>
          </div>
           <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
            {cases.map((c) => (
              <button key={c.id} onClick={() => loadCaseChat(c.id)} className={`w-full text-left px-4 py-3 rounded-xl text-[14px] transition-all truncate flex items-center gap-3 ${activeCaseId === c.id ? 'bg-blue-600/20 text-blue-200 border border-blue-500/40' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}>
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </div>
          <div className="p-5 border-t border-blue-500/10 space-y-2">
            <button onClick={() => router.push('/profile')} className="w-full p-3 bg-blue-900/30 text-blue-100 rounded-2xl hover:bg-blue-900/50 transition-all">Личный кабинет</button>
            {/* Кнопка "Выйти" теперь работает */}
            <button onClick={handleLogout} className="w-full text-gray-500 hover:text-red-400 p-3 transition-all">Выйти</button>
          </div>
        </div>
      </aside>
 
      <main className="flex-1 flex flex-col h-full relative z-10 w-full min-w-0">
        <div className="absolute top-4 left-4 z-20">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 text-blue-300 hover:text-white rounded-xl bg-blue-600/10 border border-blue-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </button>
        </div>
      
        <div className="flex-1 overflow-y-auto px-6 md:px-12 pt-16 pb-48 custom-scrollbar w-full flex flex-col items-center">
          {messages.length === 0 ? (
             <div className="w-full max-w-5xl h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l9-4 9 4v6c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V6z" />
                </svg>
              </div>
              <h3 className="text-4xl font-black text-blue-100 mb-4 tracking-wider uppercase">Adal Qadam</h3>
              <p className="text-blue-300/60 max-w-md font-light mb-8">Ваш цифровой юрист РК.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => router.push('/templates')} className="px-6 py-2 rounded-xl border border-purple-500/30 bg-purple-900/20 text-purple-300 hover:bg-purple-600/30 transition-all flex items-center gap-2">
                  📄 Открыть шаблоны
                </button>
              </div>
            </div>
           ) : (
            <div className="w-full max-w-5xl space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                  <div className={`rounded-3xl p-6 relative ${msg.role === 'user' ? 'bg-blue-600/40 border border-blue-400/30 max-w-[80%]' : 'bg-[#0f192e] border border-blue-500/20 w-full'}`}>
                    <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                    
                    {msg.role === 'ai' && (
                      <button 
                        onClick={() => downloadPDF(formatMessage(msg.content), activeCaseId ? activeCaseId.toString() : 'doc')}
                        className="mt-6 flex items-center justify-center w-[160px] gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        СКАЧАТЬ PDF
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && <div className="text-blue-400/80 animate-pulse text-sm ml-4">Анализ базы законов РК...</div>}
              <div ref={chatEndRef} className="h-10" />
            </div>
          )}
        </div>

        <div className="absolute bottom-6 w-full px-6 md:px-12 flex justify-center z-10">
          <div className="w-full max-w-5xl flex items-end gap-2 bg-[#080f1e]/95 backdrop-blur-2xl p-3 rounded-3xl border border-blue-500/20">
            <button onClick={toggleListening} className={`p-3.5 rounded-2xl ${isListening ? 'bg-red-500/20 text-red-400' : 'text-blue-400'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
             <textarea
              className="flex-1 bg-transparent text-white outline-none resize-none py-3 px-2"
              rows={1}
              placeholder="Опишите ситуацию или выберите шаблон..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <button onClick={handleSend} disabled={loading || (!text && !file)} className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        </div>
      </main>
     
      <style dangerouslySetInnerHTML={{ __html: `
        body, html { background-color: #080f1e !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 10px; }
       `}} />
    </div>
  );
}