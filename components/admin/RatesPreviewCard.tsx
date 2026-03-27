"use client";

import { RefObject } from 'react';

type RatesPreviewCardProps = {
  cardRef: RefObject<HTMLDivElement | null>;
  activeServers: any[];
  rates: {
    buy: number;
    sell: number;
  };
  onDownload: () => void;
};

export default function RatesPreviewCard({
  cardRef,
  activeServers,
  rates,
  onDownload,
}: RatesPreviewCardProps) {
  return (
    <div className="bg-[#121826] border border-blue-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center sticky top-24">
      <h2 className="text-xs font-black uppercase mb-6 tracking-widest text-blue-400 italic">
        📸 Generador de Tasas
      </h2>

      <div className="w-full max-w-[320px] rounded-3xl overflow-hidden border-2 border-gray-800 shadow-2xl mb-6">
        <div
          ref={cardRef}
          // 🟢 CORRECCIÓN: h-fit permite que el contenedor crezca según la cantidad de servidores
          className="w-[320px] min-h-[540px] h-fit bg-[#0B0F19] relative p-6 flex flex-col justify-between"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A8FF]/10 blur-[50px] rounded-full pointer-events-none"></div>

          <div className="text-center relative z-10 mb-6">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              KHAZONLI<span className="text-[#00A8FF]">.ES</span>
            </h3>
            <p className="text-[#00A8FF] text-[8px] font-black uppercase tracking-[0.3em] mt-1">
              Compramos tus Kamas
            </p>
          </div>

          <div className="space-y-3 relative z-10 flex-1 mb-6">
            {activeServers.length > 0 ? (
              activeServers.map((s, index) => (
                <div
                  // 🟢 CORRECCIÓN: Llave doble a prueba de fallos para React
                  key={`server-${s.id || 'temp'}-${index}`}
                  className="bg-[#121826]/80 border border-gray-800 p-3 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <p className="text-[#00A8FF] text-[8px] font-black uppercase tracking-widest mb-0.5">
                      {s.game || 'Game'}
                    </p>
                    <p className="text-white font-black text-[10px] uppercase">
                      {s.server_name || 'Server'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-green-400 font-black text-xs">
                      ${s.buy_rate || '0.00'}
                    </p>
                    <p className="text-gray-500 text-[7px] font-bold">
                      ={((parseFloat(s.buy_rate) || 0) * (rates.buy || 0)).toFixed(2)} Bs
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[10px] text-gray-600">
                No hay servidores activos para mostrar.
              </p>
            )}
          </div>

          <div className="relative z-10 text-center border-t border-gray-800 pt-3">
            <p className="text-white text-[7px] font-black uppercase tracking-tighter">
              Banesco • Pago Móvil • Binance • Zinli
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onDownload}
        className="w-full py-5 bg-[#00A8FF] text-[#0B0F19] font-black uppercase rounded-2xl shadow-lg shadow-[#00A8FF]/20 hover:bg-blue-400 active:scale-95 transition-all text-[10px] tracking-widest"
      >
        Descargar Imagen PNG
      </button>
    </div>
  );
}