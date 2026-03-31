"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SellModal from './SellModal';

interface Props {
  servers: any[];
  dolarRate: number;
  user: any;
  profile: any;
}

export default function SellSection({ servers, dolarRate, user, profile }: Props) {
  const t = useTranslations('TradingBoard');
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Funciones de ayuda con protección contra nulos
  const toNumber = (value: any) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatBs = (value: number) =>
    value.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // 2. Obtener la moneda de forma segura para evitar el error de .split()
  const currencyLabel = t('currency') || 'Kamas';
  const shortCurrency = currencyLabel.includes(' ') ? currencyLabel.split(' ')[0] : currencyLabel;

  return (
    <div className="animate-fade-in">

      <div className="grid gap-6 md:grid-cols-3">
        {!servers || servers.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-[#121826]/30">
            <span className="text-4xl block mb-4 opacity-20">🌍</span>
            <p className="text-gray-500 font-bold uppercase tracking-widest">{t('no_buy')}</p>
          </div>
        ) : (
          servers.map((server, index) => (
            <div
              // 🟢 SOLUCIÓN AL ERROR DE KEY: Usamos ID o en su defecto el índice
              key={server.id || `server-sell-${index}`}
              className="bg-[linear-gradient(180deg,#121826_0%,#0f1724_100%)] p-6 rounded-[28px] border border-gray-800 hover:border-[#00A8FF]/50 transition-all duration-500 group relative overflow-hidden shadow-lg hover:shadow-[0_0_35px_rgba(0,168,255,0.15)]"
            >
              {/* Brillo neón superior */}
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#00A8FF] to-transparent group-hover:w-full transition-all duration-700"></div>

              <div className="relative z-10">
                <p className="text-[10px] font-black text-[#00A8FF] uppercase mb-2 tracking-[0.2em] opacity-80">
                  {server.game}
                </p>

                <h3 className="text-2xl font-black text-white uppercase mt-1 tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                  {server.server}
                </h3>

                <div className="bg-[#0B0F19]/80 backdrop-blur-sm p-5 rounded-2xl my-6 text-center border border-gray-800/50 shadow-inner group-hover:border-[#00A8FF]/20 transition-colors">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1 tracking-widest">
                    {t('label_rate')}
                  </p>
                  <p className="text-[#00A8FF] font-black text-3xl leading-none drop-shadow-[0_0_12px_rgba(0,168,255,0.3)]">
                    ${server.rate} <span className="text-sm">USDT</span>
                  </p>

                  {/* CONVERSIÓN A BOLÍVARES */}
                  <p className="text-amber-300 text-[12px] font-semibold mt-2">
                    ≈ {formatBs(toNumber(server.rate) * dolarRate)} Bs
                  </p>
                  <p className="text-gray-600 text-[8px] font-bold mt-2 uppercase tracking-tighter opacity-50">
                    USDT / {shortCurrency}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedServer(server);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-4 bg-[#00A8FF]/10 text-[#00A8FF] border border-[#00A8FF]/30 rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] hover:bg-[#00A8FF] hover:text-[#0B0F19] transition-all duration-300 active:scale-95"
                >
                  {t('btn_sell')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <SellModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedServer={selectedServer}
        dolarRate={dolarRate}
        user={user}
        profile={profile}
      />
    </div>
  );
}