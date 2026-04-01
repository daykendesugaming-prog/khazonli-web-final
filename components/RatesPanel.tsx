"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function RatesPanel() {
  const [servers, setServers] = useState<any[]>([]);
  const [rates, setRates] = useState({ buy: 0, sell: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Cargar tasas de cambio
        const { data: ratesData } = await supabase
          .from('exchange_rates')
          .select('buy_rate, sell_rate')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (ratesData) {
          setRates({
            buy: ratesData.buy_rate || 0,
            sell: ratesData.sell_rate || 0
          });
        }

        // 2. Cargar servidores activos
        const { data: serversData } = await supabase
          .from('mmo_servers')
          .select('game, server_name, buy_rate, sell_rate, is_active')
          .eq('is_active', true);

        if (serversData) {
          const formattedServers = serversData.map((server, index) => ({
            id: server.server_name || `server-${index}`,
            name: server.server_name || 'Desconocido',
            version: server.game || 'Dofus',
            buy: server.buy_rate || '0.00',
            sell: server.sell_rate || '0.00',
            // Conversión a BS
            buy_bs: ((parseFloat(server.buy_rate) || 0) * (ratesData?.sell_rate || 0)).toFixed(2),
            sell_bs: ((parseFloat(server.sell_rate) || 0) * (ratesData?.buy_rate || 0)).toFixed(2)
          }));
          setServers(formattedServers);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // Revalidar cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <section className="w-full max-w-5xl mx-auto py-16 px-6">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A8FF] mx-auto"></div>
          <p className="text-gray-400 mt-4">Cargando tasas...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-5xl mx-auto py-16 px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide">Mercado Actual</h2>
          <p className="text-gray-400 mt-1">Tasas actualizadas en tiempo real</p>
          <p className="text-sm text-[#00A8FF] mt-2">
            💱 Tasa de cambio: Compra ${rates.buy} | Venta ${rates.sell}
          </p>
        </div>
        <div className="text-sm text-[#00A8FF] font-semibold bg-[#00A8FF]/10 px-3 py-1 rounded-md mt-4 md:mt-0">
          ● Estado: Comprando
        </div>
      </div>

      {/* Grid de Servidores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {servers.length > 0 ? (
          servers.map((server) => (
            <div 
              key={server.id} 
              className="bg-[#121826] border border-gray-800 rounded-xl p-5 hover:border-[#00A8FF]/50 hover:shadow-[0_0_15px_rgba(0,168,255,0.15)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{server.name}</h3>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{server.version}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-[#0B0F19] p-3 rounded border border-gray-800/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">Tú recibes:</span>
                    <span className="font-bold text-green-400">${server.buy}</span>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    ≈ {server.buy_bs} Bs
                  </div>
                </div>
                <div className="bg-[#0B0F19] p-3 rounded border border-gray-800/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">Tú pagas:</span>
                    <span className="font-bold text-white">${server.sell}</span>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    ≈ {server.sell_bs} Bs
                  </div>
                </div>
              </div>

              <button className="w-full mt-5 py-2 bg-transparent border border-gray-700 hover:border-[#00A8FF] hover:text-[#00A8FF] text-sm font-bold text-gray-300 rounded transition-colors">
                Negociar Ahora
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 border border-dashed border-gray-800 rounded-xl">
            <p className="text-gray-500">No hay servidores activos</p>
          </div>
        )}
      </div>
    </section>
  );
}