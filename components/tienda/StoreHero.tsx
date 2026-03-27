"use client";

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function StoreHero({ storeStatus }: { storeStatus: string }) {
  const t = useTranslations('StoreHero');

  return (
    <div className="w-full max-w-6xl mx-auto px-6 mb-8">
      <div className="relative bg-[#121826]/80 backdrop-blur-md border border-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#00A8FF]/10 to-transparent blur-[50px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border mb-6 inline-block ${
                storeStatus === 'activo'
                  ? 'bg-green-400/10 text-green-400 border-green-400/30'
                  : storeStatus === 'pausa'
                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                  : 'bg-red-500/10 text-red-500 border-red-500/30'
              }`}
            >
              {storeStatus === 'activo' ? t('status_online') : storeStatus === 'pausa' ? t('status_away') : t('status_offline')}
            </span>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight uppercase">
              {t('title_part1')}{' '}
              <span className="text-[#00A8FF] drop-shadow-[0_0_15px_rgba(0,168,255,0.4)]">
                {t('title_part2')}
              </span>
            </h1>

            <p className="text-gray-400 font-medium max-w-md text-lg leading-snug">
              {t('description')}
            </p>
          </div>

          <div className="relative w-40 h-40 md:w-56 md:h-56 hidden md:block">
            <div className="absolute inset-0 bg-[#00A8FF]/20 rounded-full blur-2xl animate-pulse"></div>
            <Image
              src="/Logo-khaz.png" // Asegúrate de que el archivo en /public se llame exactamente así
              alt="Khazonli Logo"
              fill
              priority
              className={`object-contain transition-all duration-500 ${
                storeStatus !== 'activo'
                  ? 'grayscale opacity-50'
                  : 'drop-shadow-[0_0_30px_rgba(0,168,255,0.5)] animate-neon-breathe'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}