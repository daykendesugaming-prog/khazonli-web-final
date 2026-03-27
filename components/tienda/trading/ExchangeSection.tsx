"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

interface Props {
  routes: any[];
  user: any;
  profile: any;
}

const WHATSAPP_URL = 'https://wa.me/584124989220';

export default function ExchangeSection({ routes, user, profile }: Props) {
  const t = useTranslations('TradingBoard');
  const tCommon = useTranslations('common');

  // Estados de la ruta
  const [exchangeFrom, setExchangeFrom] = useState('');
  const [exchangeTo, setExchangeTo] = useState('');
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [exchangePhone, setExchangePhone] = useState(profile?.whatsapp || '');

  // Sincronizar con perfil si cambia
  useEffect(() => {
    if (profile?.whatsapp) setExchangePhone(profile.whatsapp);
  }, [profile]);

  // Carga inicial de servidores
  useEffect(() => {
    if (routes.length > 0 && !exchangeFrom) {
      setExchangeFrom(routes[0].server_from);
      setExchangeTo(routes[0].server_to);
    }
  }, [routes, exchangeFrom]);

  const toNumber = (val: any) => {
    const p = Number(val);
    return Number.isFinite(p) ? p : 0;
  };

  // Filtrado de rutas disponibles
  const availableRoutes = routes.filter((r) => r.server_from === exchangeFrom);
  const availableToServers = availableRoutes.map((r) => r.server_to);
  const currentRoute = availableRoutes.find((r) => r.server_to === exchangeTo);

  // Auto-ajuste si el destino ya no es válido para el nuevo origen
  useEffect(() => {
    if (availableToServers.length > 0 && !availableToServers.includes(exchangeTo)) {
      setExchangeTo(availableToServers[0]);
    }
  }, [availableToServers, exchangeTo]);

  const exchangeReceive = currentRoute?.mode === 'fijo' 
    ? toNumber(exchangeAmount) * toNumber(currentRoute.rate) 
    : 0;

  const handleTransaction = async () => {
    if (!currentRoute || !exchangePhone.trim()) {
      alert(tCommon('error'));
      return;
    }

    if (currentRoute.mode === 'fijo' && toNumber(exchangeAmount) <= 0) {
      alert("Por favor, indica una cantidad válida de Kamas.");
      return;
    }

    let orderId: string | number = `INT-${Math.floor(Date.now() / 1000)}`;

    try {
      const { data } = await supabase.from('digital_orders').insert([{
        product_name: 'Intercambio Kamas Dofus',
        variant_name: `${exchangeFrom} -> ${exchangeTo} | Entrega: ${exchangeAmount || 'Consulta'} MK`,
        price_text: currentRoute.mode === 'fijo' && exchangeAmount 
          ? `Recibe ${exchangeReceive.toFixed(2)} MK` 
          : 'Tasa por consulta',
        payment_method: 'Intercambio',
        customer_phone: exchangePhone.trim(),
        status: 'pendiente',
        user_id: user?.id || null,
      }]).select('id').single();

      if (data?.id) orderId = data.id;
    } catch (e) {
      console.error("Error en BD:", e);
    }

    const message = `¡Hola Khazonli! 👋\n\nVengo a *INTERCAMBIAR* Kamas Dofus.\n\n🆔 *TICKET:* ${orderId}\n📤 *ENTREGO EN:* ${exchangeFrom}\n📥 *RECIBO EN:* ${exchangeTo}\n💰 *CANTIDAD:* ${exchangeAmount || 'A consultar'} MK\n📞 *WHATSAPP:* ${exchangePhone}\n\n${
      currentRoute.mode === 'fijo' && exchangeAmount
        ? `Según la web, recibiría aproximadamente *${exchangeReceive.toFixed(2)} MK*.`
        : 'Solicito consultar disponibilidad y tasa actual para esta ruta.'
    }`;

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank');
    setExchangeAmount('');
  };

  return (
    <div className="max-w-4xl mx-auto py-4 animate-fade-in">
      

      {routes.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-bold uppercase tracking-widest border border-gray-800 rounded-2xl bg-[#121826]/50">
          No hay rutas de intercambio activas.
        </div>
      ) : (
        <div className="bg-[#121826] p-6 md:p-10 rounded-3xl border border-[#25D366]/30 shadow-[0_0_40px_rgba(37,211,102,0.1)] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#25D366]/10 rounded-full blur-3xl"></div>

          {/* 1. SELECTOR DE RUTAS */}
          <label className="block text-[10px] font-black text-[#25D366] uppercase mb-6 tracking-widest text-center">
            1. Selecciona tu Ruta de Intercambio
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
            {routes.map((route) => {
              const isSelected = exchangeFrom === route.server_from && exchangeTo === route.server_to;
              return (
                <button
                  key={route.id}
                  onClick={() => {
                    setExchangeFrom(route.server_from);
                    setExchangeTo(route.server_to);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#25D366]/20 border-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.2)] scale-105'
                      : 'bg-[#0B0F19] border-gray-800 text-gray-500 hover:border-[#25D366]/50 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] uppercase font-black">{route.server_from}</span>
                  <span className={`text-lg my-1 ${isSelected ? 'text-[#25D366]' : 'text-gray-700'}`}>⬇</span>
                  <span className="text-[10px] uppercase font-black">{route.server_to}</span>
                </button>
              );
            })}
          </div>

          {/* 2. CALCULADORA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 border-t border-gray-800 pt-8">
            <div className="bg-[#0B0F19] p-6 rounded-2xl border border-gray-800">
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">
                2. ¿Cuántos Kamas vas a entregar?
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Ej: 50"
                  value={exchangeAmount}
                  onChange={(e) => setExchangeAmount(e.target.value)}
                  className="w-full bg-transparent text-white text-3xl font-black outline-none"
                />
                <span className="text-gray-600 font-bold">MK</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#121826] to-[#0B0F19] p-6 rounded-2xl border border-[#25D366]/30 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Recibirás aproximadamente:
              </span>
              {!currentRoute ? (
                <span className="text-gray-600 text-sm font-bold italic">Selecciona una ruta</span>
              ) : currentRoute.mode === 'consulta' ? (
                <div className="animate-pulse">
                  <span className="text-xl font-black text-[#25D366] uppercase">Tasa por Consulta</span>
                  <p className="text-[9px] text-gray-500 mt-1 uppercase">Revisión manual requerida</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-black text-[#25D366]">
                    {exchangeAmount ? exchangeReceive.toFixed(2) : '0.00'}{' '}
                    <span className="text-lg text-[#25D366]/70 uppercase">MK</span>
                  </span>
                  <p className="text-[9px] text-gray-500 uppercase font-bold mt-2 tracking-widest">
                    Multiplicador: x{currentRoute.rate}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. CONTACTO */}
          <div className="mt-8 relative z-10">
            <label className="block text-[10px] font-black text-[#25D366] uppercase mb-3 tracking-widest ml-1">
              3. Tu WhatsApp para coordinar *
            </label>
            <input
              type="tel"
              placeholder={t('placeholder_phone')}
              value={exchangePhone}
              onChange={(e) => setExchangePhone(e.target.value)}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-[#25D366] transition-all"
            />
          </div>

          <button
            onClick={handleTransaction}
            disabled={!currentRoute || !exchangePhone.trim() || (currentRoute.mode === 'fijo' && !exchangeAmount)}
            className="w-full mt-8 py-5 bg-[#25D366] text-black font-black rounded-2xl hover:bg-green-400 disabled:opacity-30 transition-all uppercase text-xs tracking-[0.3em] shadow-lg shadow-[#25D366]/20 relative z-10"
          >
            {t('btn_swap')}
          </button>
        </div>
      )}
    </div>
  );
}