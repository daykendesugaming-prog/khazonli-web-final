import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation'; // Usamos tu navegación inteligente

export default function SplashGateway() {
  const t = useTranslations('Gateway');

  return (
    <div className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden bg-[#0B0F19] pt-16">
      
      {/* LADO IZQUIERDO: GAMER HUB */}
      <Link 
        href="/tienda" 
        className="group relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-800/50 hover:bg-[#060A14] transition-all duration-700 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000">
           <div className="w-full h-full bg-[url('/fondo-gamer.jpg')] bg-cover bg-center filter blur-[2px]"></div>
           <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F19]/80 to-[#00A8FF]/10"></div>
        </div>
        
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#00A8FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="text-center z-10 transform group-hover:scale-105 transition-transform duration-500 px-4">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#00A8FF] tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(0,168,255,0.4)]">
            {t('gamer_title')}
          </h2>
          <p className="text-gray-300 font-medium tracking-wide max-w-sm mx-auto">
            {t('gamer_desc')}
          </p>
          <div className="mt-8 inline-block px-7 py-2.5 border border-[#00A8FF]/50 text-[#00A8FF] rounded-full group-hover:bg-[#00A8FF] group-hover:text-[#0B0F19] group-hover:shadow-[0_0_30px_rgba(0,168,255,0.6)] font-bold transition-all">
            {t('gamer_btn')}
          </div>
        </div>
      </Link>

      {/* LADO DERECHO: PRO SERVICES */}
      <Link 
        href="/servicios" 
        className="group relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center hover:bg-black transition-all duration-700 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000">
           <div className="w-full h-full bg-[url('/fondo-pro.jpg')] bg-cover bg-center filter blur-[2px]"></div>
           <div className="absolute inset-0 bg-gradient-to-bl from-[#0B0F19]/90 to-[#FBB03B]/10"></div>
        </div>

        <div className="absolute inset-0 z-0 bg-gradient-to-bl from-[#FBB03B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="text-center z-10 transform group-hover:scale-105 transition-transform duration-500 px-4">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-4">
            PRO <span className="text-[#FBB03B] drop-shadow-[0_0_15px_rgba(251,176,59,0.2)]">SERVICES</span>
          </h2>
          <p className="text-gray-400 font-medium tracking-wide max-w-sm mx-auto">
            {t('pro_desc')}
          </p>
          <div className="mt-8 inline-block px-7 py-2.5 border border-gray-700 text-gray-300 rounded-full group-hover:border-[#FBB03B] group-hover:text-[#FBB03B] transition-all font-bold">
            {t('pro_btn')}
          </div>
        </div>
      </Link>
    </div>
  );
}