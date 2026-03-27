import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function ServiciosPro() {
  const t = useTranslations('Servicios');
  
  const whatsappNumber = "584124989220"; 
  const message = encodeURIComponent("Buenas tardes, quiero cotizar mi proyecto. ¿Está disponible?");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  // Definimos las llaves para iterar sobre ellas
  const serviceKeys = ['web', 'auto', 'bot'] as const;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 md:p-24 selection:bg-[#FBB03B] selection:text-black pt-32">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/" className="group text-gray-500 text-xs font-bold uppercase tracking-[0.3em] hover:text-[#00A8FF] transition-colors mb-12 inline-flex items-center">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> {t('back_central')}
        </Link>
        
        <header className="mb-20">
          <h1 className="text-6xl md:text-7xl font-black mb-4 uppercase tracking-tighter italic">
            {t('header_title')} <span className="text-[#FBB03B]">{t('header_pro')}</span>
          </h1>
          <div className="h-1 w-24 bg-[#FBB03B]"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {serviceKeys.map((key) => (
            <div key={key} className="bg-[#121826]/50 border border-gray-800 p-1 rounded-3xl hover:border-[#FBB03B] transition-all duration-500 group overflow-hidden shadow-2xl">
              <div className="p-8">
                <div className="relative h-48 w-full mb-8 overflow-hidden rounded-2xl bg-[#0B0F19] border border-gray-800/50">
                  <img 
                    src={key === 'web' ? "/Desarrollo Web.jpg" : key === 'auto' ? "/Automatización.jpg" : "/Bots de Mando.jpg"} 
                    alt={t(`${key}_title`)}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121826] to-transparent"></div>
                </div>

                <h3 className="text-xl font-black uppercase mb-4 tracking-widest group-hover:text-[#FBB03B] transition-colors italic">
                  {t(`${key}_title`)}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                  {t(`${key}_desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SECCIÓN COTIZAR */}
        <div className="relative mt-32 p-[1px] bg-gradient-to-r from-transparent via-[#FBB03B]/40 to-transparent rounded-3xl overflow-hidden">
          <div className="bg-[#121826]/80 backdrop-blur-sm p-12 rounded-3xl text-center relative z-10 border border-white/5">
            <h2 className="text-3xl font-black uppercase mb-4 italic text-white">
              {t('cta_title')} <span className="text-[#FBB03B]">{t('cta_highlight')}</span>
            </h2>
            <p className="mb-10 text-gray-400 max-w-lg mx-auto font-medium">
              {t('cta_desc')}
            </p>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FBB03B] text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(251,176,59,0.5)] hover:scale-105 transition-all duration-300 active:scale-95"
            >
              {t('cta_btn')}
            </a>
          </div>
        </div>

        <footer className="mt-24 text-center">
             <p className="text-gray-700 text-[10px] uppercase tracking-[0.5em] font-bold">
               {t('footer_rights', { year: new Date().getFullYear() })}
             </p>
        </footer>
      </div>
    </div>
  );
}