import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ChatBot from '@/components/ai/ChatBot'; // Importamos el bot

export default function SoportePage() {
  const t = useTranslations('Legal');

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 md:p-24 flex flex-col items-center pt-32">
      <div className="max-w-4xl w-full mx-auto">
        
        {/* CABECERA */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#00A8FF]/10 rounded-full flex items-center justify-center mb-8 mx-auto border border-[#00A8FF]/20 shadow-[0_0_30px_rgba(0,168,255,0.1)]">
            <span className="text-4xl">🎧</span>
          </div>
          
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">
            {t('support_title').split(' ')[0]} <span className="text-[#00A8FF]">{t('support_title').split(' ')[1]}</span>
          </h1>
          
          <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            {/* Texto actualizado para presentar la nueva IA */}
            Interactúa con nuestra <span className="text-white font-bold">IA Inteligente</span> para resolver dudas instantáneas sobre stock, tasas y servicios.
          </p>
        </div>

        {/* 🤖 BOT EN MODO VENTANA COMPLETA */}
        <div className="mb-12 shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-[30px] overflow-hidden border border-gray-800">
           <ChatBot mode="full" />
        </div>

        {/* GRID DE INFORMACIÓN RÁPIDA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#121826]/50 p-6 rounded-3xl border border-gray-800 hover:border-[#00A8FF]/30 transition-colors">
            <h3 className="text-white font-bold uppercase text-xs mb-2 tracking-widest">{t('payment_doubts')}</h3>
            <p className="text-gray-500 text-xs italic">{t('payment_desc')}</p>
          </div>
          <div className="bg-[#121826]/50 p-6 rounded-3xl border border-gray-800 hover:border-[#FBB03B]/30 transition-colors">
            <h3 className="text-white font-bold uppercase text-xs mb-2 tracking-widest">{t('pro_queries')}</h3>
            <p className="text-gray-500 text-xs italic">{t('pro_queries_desc')}</p>
          </div>
        </div>

        {/* BOTÓN WHATSAPP (Respaldo Humano) */}
        <div className="text-center">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-4">¿Prefieres atención humana?</p>
          <a 
            href="https://chat.whatsapp.com/HTTT0c4E0wn29Xlm8kDGjs" 
            target="_blank" 
            className="px-8 py-4 bg-[#25D366] text-black font-black rounded-2xl hover:bg-[#128C7E] transition-all inline-flex items-center gap-3 shadow-[0_0_30px_rgba(37,211,102,0.2)] hover:scale-105"
          >
            <span className="text-xl">💬</span> {t('contact_btn')}
          </a>

          <Link href="/" className="mt-12 block text-gray-500 text-xs font-bold uppercase tracking-[0.3em] hover:text-[#00A8FF] transition-all">
            {t('back_central')}
          </Link>
        </div>
      </div>
    </div>
  );
}