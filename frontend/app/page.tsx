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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadCases();
  }, [router]);

  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  }, [messages, loading]);

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
    const res = await fetch('https://adal-qadam.onrender.com/cases', {
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
  const res = await fetch(`https://adal-qadam.onrender.com/cases/${caseId}`, {
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
      const res = await fetch('https://adal-qadam.onrender.com/analyze', {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const formatMessage = (content: string) => {
    if (!content) return '';
    let html = content;
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?:^|\n)(?:->|-|\*)\s+(.*)/g, '<br/><li>$1</li>');
    return html;
  };

  return (
    <div className="flex h-screen bg-[#080f1e] text-gray-200 font-sans overflow-hidden relative">
      
      {/* ФОНОВЫЕ СВЕЧЕНИЯ */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-0'} transition-all duration-300 bg-[#0c1527]/90 backdrop-blur-xl border-r border-blue-500/10 flex flex-col no-print z-30 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.5)] relative shrink-0`}>
        <div className="w-[280px] flex flex-col h-full">
          <div className="p-6 pb-2 flex justify-center">
             <h2 className="text-2xl font-black tracking-[0.2em] text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.5)] uppercase">Adal Qadam</h2>
          </div>

          <div className="p-5 pt-3">
            <button onClick={startNewCase} className="w-full flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-100 p-3 rounded-2xl font-medium transition-all text-[15px] shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Новое дело
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
            <p className="text-[11px] font-semibold text-blue-400/60 uppercase tracking-widest mb-3 px-1 mt-2">База данных подключена</p>
            {cases.map((c) => (
              <button key={c.id} onClick={() => loadCaseChat(c.id)} className={`w-full text-left px-4 py-3 rounded-xl text-[14px] transition-all truncate flex items-center gap-3 ${activeCaseId === c.id ? 'bg-blue-600/20 text-blue-200 border border-blue-500/40 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'}`}>
                <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </div>
          
          <div className="p-5 pt-4 border-t border-blue-500/10 space-y-3">
            <button onClick={() => router.push('/profile')} className="w-full flex items-center justify-center gap-3 bg-blue-900/30 hover:bg-blue-600/30 border border-blue-500/20 text-blue-100 p-3 rounded-2xl font-medium transition-all text-[15px] shadow-sm group">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-110 transition-transform">N</div>
              Личный кабинет
            </button>
            
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-red-500/15 border border-transparent hover:border-red-500/30 text-gray-500 hover:text-red-400 p-3 rounded-2xl font-medium transition-all text-[14px] group">
              <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Выйти
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative z-10 w-full min-w-0">
        <div className="absolute top-4 left-4 z-20 no-print">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 text-blue-300 hover:text-white rounded-xl hover:bg-blue-600/20 transition-all backdrop-blur-md border border-transparent hover:border-blue-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </button>
        </div>

        {/* MESSAGES LIST */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 pt-16 pb-48 custom-scrollbar w-full flex flex-col items-center">
          {messages.length === 0 ? (
            
            /* СТАРТОВЫЙ ЭКРАН С РОВНЫМ ЩИТОМ И КЛИКАБЕЛЬНЫМИ КНОПКАМИ */
            <div className="w-full max-w-5xl h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l9-4 9 4v6c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V6z" />
                </svg>
              </div>
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-4 tracking-wider uppercase drop-shadow-sm">Adal Qadam</h3>
              <p className="text-[16px] text-blue-300/60 max-w-md font-light leading-relaxed mb-8">
                Ваш цифровой юрист. Опишите ситуацию, и я составлю грамотное исковое заявление на основе законов РК.
              </p>
              
              {/* Кликабельные подсказки */}
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                <button 
                  onClick={() => setText("Мне нужно составить иск о взыскании долга. Помоги, пожалуйста.")} 
                  className="px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-900/20 hover:bg-blue-600/30 text-blue-300/80 hover:text-blue-100 text-sm shadow-sm transition-all"
                >
                  Взыскание долга
                </button>
                <button 
                  onClick={() => setText("Хочу подать в суд на возмещение морального вреда. Какие нужны основания?")} 
                  className="px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-900/20 hover:bg-blue-600/30 text-blue-300/80 hover:text-blue-100 text-sm shadow-sm transition-all"
                >
                  Моральный вред
                </button>
                <button 
                  onClick={() => setText("Нарушены мои права потребителя. Как составить претензию и иск?")} 
                  className="px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-900/20 hover:bg-blue-600/30 text-blue-300/80 hover:text-blue-100 text-sm shadow-sm transition-all"
                >
                  Защита прав потребителей
                </button>
              </div>
            </div>

          ) : (
            <div className="w-full max-w-5xl space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                  <div className={`rounded-3xl p-6 ${
                    msg.role === 'user' 
                    ? 'bg-blue-600/40 border border-blue-400/30 text-white max-w-[85%] lg:max-w-[75%] rounded-br-sm shadow-[0_8px_32px_rgba(37,99,235,0.15)]' 
                    : 'bg-[#0f192e] border border-blue-500/20 backdrop-blur-xl rounded-bl-sm w-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                  }`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-500/20">
                        <span className="text-[12px] font-semibold text-blue-400/90 uppercase tracking-widest">Правовое заключение</span>
                      </div>
                    )}
                    <div className="prose prose-invert max-w-none text-[16px] leading-relaxed w-full" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  </div>
                </div>
              ))}
              {loading && <div className="text-blue-400/80 animate-pulse text-sm font-medium ml-4 w-full max-w-5xl">Анализ базы законов РК...</div>}
              <div className="h-10 w-full" ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="absolute bottom-6 w-full px-6 md:px-12 no-print z-10 flex justify-center">
          <div className="w-full max-w-5xl flex items-end gap-2 bg-[#080f1e]/95 backdrop-blur-2xl p-3 rounded-3xl border border-blue-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)] focus-within:border-blue-400/50 transition-all">
            <button onClick={toggleListening} className={`p-3.5 rounded-2xl ${isListening ? 'bg-red-500/20 text-red-400' : 'text-blue-400 hover:text-blue-200 hover:bg-blue-600/20'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>

            <textarea
              className="flex-1 bg-transparent text-gray-100 outline-none resize-none py-3 px-2 text-[15px] max-h-48 custom-scrollbar"
              rows={1}
              placeholder="Опишите ситуацию..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />

            <button onClick={handleSend} disabled={loading || (!text && !file)} className="p-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 text-white rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:shadow-none border border-blue-400/40 disabled:border-transparent">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        </div>
      </main>

      {/* ИСПРАВЛЕНИЕ БЕЛЫХ РАМОК ПРИ ПРОКРУТКЕ */}
      <style dangerouslySetInnerHTML={{ __html: `
        body, html { background-color: #080f1e !important; color-scheme: dark; margin: 0; padding: 0; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }
        .prose * { background: transparent !important; color: #e2e8f0 !important; }
        .prose h1, .prose h2, .prose h3 { color: #93c5fd !important; margin: 1.5rem 0 0.5rem; }
        .prose strong { color: #ffffff !important; font-weight: 700; background: rgba(59,130,246,0.15) !important; padding: 2px 4px; border-radius: 4px; border: 1px solid rgba(59,130,246,0.2); }
        .prose li { margin-bottom: 0.5rem; list-style: none; padding-left: 1.5rem; position: relative; }
        .prose li::before { content: '→'; color: #3b82f6; position: absolute; left: 0; font-weight: bold; }
      `}} />
    </div>
  );
}