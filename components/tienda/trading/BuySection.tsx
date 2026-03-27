"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import BuyModal from './BuyModal';

interface Props {
  stocks: any[];
  dolarRate: number;
  user: any;
  profile: any;
}

export default function BuySection({ stocks, dolarRate, user, profile }: Props) {
  const t = useTranslations('TradingBoard');
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funciones de ayuda para el cálculo (Igual que en SellSection)
  const toNumber = (value: any) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatBs = (value: number) =>
    value.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="animate-fade-in">
      <p className="text-gray-400 text-center mb-10 text-sm md:text-base italic">
        {t('subtitle_buy')}
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {stocks.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-[#121826]/30">
            <span className="text-4xl block mb-4 opacity-20">💰</span>
            <p className="text-gray-500 font-bold uppercase tracking-widest">{t('no_stock')}</p>
          </div>
        ) : (
          stocks.map((item) => (
            <div 
              key={item.id} 
              className="bg-[linear-gradient(180deg,#121826_0%,#0f1724_100%)] p-6 rounded-[28px] border border-gray-800 hover:border-[#FBB03B]/50 transition-all duration-500 group relative overflow-hidden shadow-lg hover:shadow-[0_0_35px_rgba(251,176,59,0.15)]"
            >
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FBB03B] to-transparent group-hover:w-full transition-all duration-700"></div>
              
              <div className="absolute top-0 right-0 bg-[#FBB03B]/10 text-[#FBB03B] text-[9px] font-black uppercase px-3 py-1.5 rounded-bl-xl border-l border-b border-[#FBB03B]/20 tracking-widest">
                {t('status_stock')}
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-black text-[#FBB03B] uppercase mb-2 mt-2 tracking-[0.2em] opacity-80">
                  {item.game}
                </p>
                
                <h3 className="text-2xl font-black text-white uppercase mt-1 tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                  {item.server_name}
                </h3>
                
                <div className="bg-[#0B0F19]/90 p-4 rounded-2xl my-5 flex justify-between items-center shadow-inner border border-gray-800/50 group-hover:border-[#FBB03B]/20 transition-colors">
                  <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">
                      {t('label_price')}
                    </p>
                    <p className="text-[#FBB03B] font-black text-2xl leading-none drop-shadow-[0_0_12px_rgba(251,176,59,0.2)]">
                      ${item.price_usd}
                    </p>
                    
                    {/* 🟢 CONVERSIÓN A BOLÍVARES RESTAURADA */}
                    <p className="text-gray-600 text-[10px] font-bold mt-2">
                      ≈ {formatBs(toNumber(item.price_usd) * dolarRate)} Bs.
                    </p>
                  </div>
                  
                  <div className="text-right border-l border-gray-800 pl-4">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">{t('label_stock')}</p>
                    <p className="text-white font-black text-lg">
                      {item.stock_mk}<span className="text-xs text-gray-500 ml-0.5">M</span>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => { 
                    setSelectedStock(item); 
                    setIsModalOpen(true); 
                  }}
                  disabled={toNumber(item.stock_mk) <= 0}
                  className="w-full py-4 bg-[#FBB03B]/10 text-[#FBB03B] border border-[#FBB03B]/30 rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] hover:bg-[#FBB03B] hover:text-[#0B0F19] transition-all duration-300 shadow-[inset_0_0_15px_rgba(251,176,59,0.05)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {toNumber(item.stock_mk) > 0 ? t('btn_buy') : 'Agotado'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <BuyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedStock={selectedStock}
        dolarRate={dolarRate}
        user={user}
        profile={profile}
      />
    </div>
  );
}