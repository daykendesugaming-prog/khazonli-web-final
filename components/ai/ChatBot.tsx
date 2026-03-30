"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Send, X, Loader2 } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatBot({ mode = 'bubble' }: { mode?: 'full' | 'bubble' }) {
  const t = useTranslations('Chat');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(mode === 'full');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al recibir mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    setShowFallbackButton(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }],
          locale: locale
        }),
      });

      const data = await response.json();
      
      // Manejar respuesta del nuevo endpoint DeepSeek
      if (data.fallback) {
        // Mostrar mensaje de fallback y activar botón de WhatsApp
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: data.content || "Nuestro soporte IA está en mantenimiento. Haz clic en el botón abajo para ir a WhatsApp."
        }]);
        setShowFallbackButton(true);
      } else if (data.content) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "Error de conexión. Por favor, contacta con soporte a través de WhatsApp."
      }]);
      setShowFallbackButton(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    window.open('https://wa.me/584124989220', '_blank'); // Reemplaza con tu número real
  };

  const ChatWindow = (
    <div className={`flex flex-col bg-[#121826]/95 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-[30px] overflow-hidden animate-fade-in ${mode === 'bubble' ? 'fixed bottom-24 right-6 w-[350px] md:w-[380px] h-[550px] z-[100]' : 'w-full h-[600px] relative'
      }`}>
      {/* HEADER DEL CHAT */}
      <div className="p-4 bg-[#0B0F19] border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* LOGO DEL BOT EN EL HEADER */}
          <div className="w-10 h-10 overflow-hidden rounded-full border border-[#00A8FF]/40 shadow-[0_0_10px_rgba(0,168,255,0.3)] bg-[#0B0F19] shrink-0">
            <img src="/ia5.jpg" alt="Khaz AI" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Khaz AI</h3>
            <p className="text-[9px] text-green-500 font-bold uppercase tracking-tighter flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {t('online') || 'En línea'}
            </p>
          </div>
        </div>
        {mode === 'bubble' && (
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors p-2">
            <X size={20} />
          </button>
        )}
      </div>

      {/* ÁREA DE MENSAJES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#0B0F19]/50">
        {messages.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center opacity-40">
            <img src="/khaz-bot.png" alt="Logo" className="w-16 h-16 grayscale mb-4" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('welcome')}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] p-4 rounded-[20px] text-[13px] leading-relaxed shadow-lg ${msg.role === 'user'
              ? 'bg-[#00A8FF] text-[#0B0F19] font-black rounded-tr-none'
              : 'bg-[#1e2536] text-gray-200 border border-gray-800 rounded-tl-none'
              }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-[#1e2536] p-4 rounded-[20px] rounded-tl-none border border-gray-800">
              <Loader2 size={16} className="animate-spin text-[#00A8FF]" />
            </div>
          </div>
        )}

        {/* BOTÓN DE WHATSAPP PARA FALLBACK */}
        {showFallbackButton && (
          <div className="flex justify-center mt-4 animate-fade-in">
            <button
              onClick={handleWhatsAppRedirect}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 transition-all shadow-lg"
            >
              <span className="text-sm">Contactar por WhatsApp</span>
            </button>
          </div>
        )}
      </div>

      {/* ÁREA DE INPUT */}
      <form onSubmit={handleSubmit} className="p-4 bg-[#0B0F19] border-t border-gray-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 bg-[#121826] border border-gray-800 rounded-2xl px-5 py-3 text-xs text-white outline-none focus:border-[#00A8FF]/50 transition-all placeholder:text-gray-600"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-12 h-12 bg-[#00A8FF] text-[#0B0F19] rounded-2xl flex items-center justify-center hover:bg-blue-400 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,168,255,0.3)]"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );

  if (mode === 'bubble') {
    return (
      <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-4 w-16 h-16 bg-[#0B0F19] rounded-full shadow-[0_0_25px_rgba(0,168,255,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] border-2 border-[#00A8FF]/50 p-0 overflow-hidden group"
            style={{ insetInlineEnd: '1rem' }} // CSS lógico para RTL/LTR
          >
            {/* LA IMAGEN DEL BOT QUE ABRE EL CHAT */}
            <img
              src="/ia5.jpg"
              alt="Chat AI"
              className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
            />
            {/* Notificación pequeña */}
            <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#0B0F19] rounded-full"></span>
          </button>
        )}
        {isOpen && ChatWindow}
      </>
    );
  }

  return ChatWindow;
}