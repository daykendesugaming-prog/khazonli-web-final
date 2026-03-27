"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

// RUTAS ABSOLUTAS
import P2POfferForm from '@/components/P2POfferForm';
import SellSection from '@/components/tienda/trading/SellSection';
import BuySection from '@/components/tienda/trading/BuySection';
import ExchangeSection from '@/components/tienda/trading/ExchangeSection';

// DEFINICIÓN DE TIPOS PROFESIONAL
interface TradingDataState {
  servers: any[];
  stocks: any[];
  routes: any[];
  rates: { buy: number; sell: number };
  userProfile: any | null;
  currentUser: any | null;
}

export default function TradingBoard() {
  const t = useTranslations('TradingBoard');
  const [activeTab, setActiveTab] = useState<'vender' | 'comprar' | 'intercambiar'>('vender');
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<TradingDataState>({
    servers: [],
    stocks: [],
    routes: [],
    rates: { buy: 0, sell: 0 },
    userProfile: null,
    currentUser: null
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [
          { data: sessionData },
          { data: serverData },
          { data: stockData },
          { data: routeData },
          { data: ratesData }
        ] = await Promise.all([
          supabase.auth.getSession(),
          supabase.from('mmo_servers').select('*').eq('is_active', true),
          supabase.from('mmo_stock').select('*').eq('is_active', true),
          supabase.from('exchange_routes').select('*').eq('is_active', true),
          supabase.from('exchange_rates').select('*').limit(1).single(),
        ]);

        let profile = null;
        if (sessionData.session) {
          const { data: p } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();
          profile = p;
        }

        // 🟢 CORRECCIÓN TÉCNICA: Mapeamos los datos de la DB a los nombres que usan los componentes hijos
        setData({
          servers: (serverData || []).map(s => ({
            id: s.id,
            game: s.game,
            server: s.server_name, // De 'server_name' (DB) a 'server' (Componente)
            rate: String(s.buy_rate) // De 'buy_rate' (DB) a 'rate' (Componente)
          })),
          stocks: stockData || [],
          routes: routeData || [],
          rates: { 
            buy: ratesData?.buy_rate || 0, 
            sell: ratesData?.sell_rate || 0 
          },
          userProfile: profile,
          currentUser: sessionData.session?.user || null
        });

      } catch (err) {
        console.error("Error cargando TradingBoard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-4">
      {/* SELECTOR DE PESTAÑAS - ESTILO GAMER NEÓN */}
      <div className="flex flex-col md:flex-row bg-[#121826] rounded-t-xl border-b border-gray-800 overflow-hidden shadow-2xl">
        <button 
          onClick={() => setActiveTab('vender')} 
          className={`flex-1 py-5 font-black uppercase text-xs tracking-widest transition-all ${
            activeTab === 'vender' 
            ? 'bg-[#00A8FF] text-[#0B0F19] shadow-[0_0_20px_rgba(0,168,255,0.4)]' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          {t('tab_sell')}
        </button>
        <button 
          onClick={() => setActiveTab('intercambiar')} 
          className={`flex-1 py-5 font-black uppercase text-xs tracking-widest transition-all ${
            activeTab === 'intercambiar' 
            ? 'bg-[#25D366] text-black shadow-[0_0_20px_rgba(37,211,102,0.4)]' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          {t('tab_swap')}
        </button>
        <button 
          onClick={() => setActiveTab('comprar')} 
          className={`flex-1 py-5 font-black uppercase text-xs tracking-widest transition-all ${
            activeTab === 'comprar' 
            ? 'bg-[#FBB03B] text-[#0B0F19] shadow-[0_0_20px_rgba(251,176,59,0.4)]' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          {t('tab_buy')}
        </button>
      </div>

      <div className="bg-[#0B0F19] border border-t-0 border-gray-800 rounded-b-xl p-6 md:p-10 shadow-2xl relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* TÍTULOS SEO DINÁMICOS CON 'KAMAS' */}
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-[0.04em]">
                {activeTab === 'vender' ? t('title_sell') : activeTab === 'comprar' ? t('title_buy') : t('title_swap')}{' '}
                <span className={
                  activeTab === 'vender' ? 'text-[#00A8FF]' : 
                  activeTab === 'comprar' ? 'text-[#FBB03B]' : 'text-[#25D366]'
                }>
                  {t('currency')}
                </span>
              </h2>
              <p className="text-gray-500 mt-3 text-sm italic">
                {activeTab === 'vender' ? t('subtitle_sell') : activeTab === 'comprar' ? t('subtitle_buy') : t('subtitle_swap')}
              </p>
            </div>

            {/* RENDERIZADO DE SECCIONES MODULARES */}
            {activeTab === 'vender' && (
              <SellSection 
                servers={data.servers} 
                dolarRate={data.rates.buy} 
                user={data.currentUser} 
                profile={data.userProfile} 
              />
            )}
            
            {activeTab === 'comprar' && (
              <BuySection 
                stocks={data.stocks} 
                dolarRate={data.rates.buy} 
                user={data.currentUser} 
                profile={data.userProfile} 
              />
            )}
            
            {activeTab === 'intercambiar' && (
              <ExchangeSection 
                routes={data.routes} 
                user={data.currentUser} 
                profile={data.userProfile} 
              />
            )}

            {/* FORMULARIO P2P SIEMPRE VISIBLE AL FINAL */}
            <div className="mt-16 border-t border-gray-800 pt-10">
              <P2POfferForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}