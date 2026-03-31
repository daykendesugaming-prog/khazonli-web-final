"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServer: any;
  dolarRate: number;
  user: any;
  profile: any;
}

const WHATSAPP_URL = 'https://wa.me/584124989220';

export default function SellModal({
  isOpen,
  onClose,
  selectedServer,
  dolarRate,
  user,
  profile
}: SellModalProps) {
  const tSellModal = useTranslations('SellModal');
  const t = useTranslations('TradingBoard');
  const tCommon = useTranslations('common');

  // Estados internos
  const [pjName, setPjName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pago Móvil / Transferencia');
  const [sellPhone, setSellPhone] = useState('');
  const [sellPaymentDetails, setSellPaymentDetails] = useState('');

  // Sincronización automática con el perfil
  useEffect(() => {
    if (profile && isOpen) {
      setSellPhone(profile.whatsapp || '');
      setSellPaymentDetails(profile.pago_movil || '');
    }
  }, [profile, isOpen]);

  if (!isOpen || !selectedServer) return null;

  const toNumber = (val: any) => {
    const p = Number(val);
    return Number.isFinite(p) ? p : 0;
  };

  const formatBs = (val: number) =>
    val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Cálculos de conversión
  const totalUsd = toNumber(amount) * toNumber(selectedServer.rate);
  const totalBs = totalUsd * dolarRate;

  const handleTransaction = async () => {
    if (!pjName.trim() || toNumber(amount) <= 0 || !sellPhone.trim()) {
      alert(tCommon('error'));
      return;
    }

    let orderId: string | number = `VEN-${Math.floor(Date.now() / 1000)}`;

    try {
      const { data, error } = await supabase.from('digital_orders').insert([{
        product_name: `Venta Kamas - ${selectedServer.game}`,
        variant_name: `${amount} MK en ${selectedServer.server} (PJ: ${pjName.trim()})`,
        price_text: paymentMethod === 'Binance Pay' ? totalUsd.toFixed(2) : null,
        price_bs: paymentMethod !== 'Binance Pay' ? Number(totalBs.toFixed(2)) : null,
        payment_method: paymentMethod,
        customer_phone: sellPhone.trim(),
        payment_details: sellPaymentDetails.trim() || null,
        status: 'pendiente',
        user_id: user?.id || null,
      }]).select('id').single();

      if (!error && data?.id) orderId = data.id;
    } catch (e) {
      console.error("Error en registro BD:", e);
    }

    // Mensaje de WhatsApp optimizado para SEO
    const message = `¡Hola Khazonli! 👋\n\nVengo a *VENDER* Kamas Dofus.\n\n🆔 *TICKET:* ${orderId}\n🎮 *JUEGO:* ${selectedServer.game}\n🌍 *SERVER:* ${selectedServer.server}\n👤 *PJ:* ${pjName.trim()}\n💰 *CANTIDAD:* ${amount} MK\n💳 *RECIBO POR:* ${paymentMethod}\n📋 *DATOS DE PAGO:* ${sellPaymentDetails.trim() || 'Ver chat'}\n\n💵 *MONTO A RECIBIR:* ${paymentMethod === 'Binance Pay'
        ? `${totalUsd.toFixed(2)} USDT`
        : `${formatBs(totalBs)} Bs.`
      }`;

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121826] border border-[#00A8FF]/30 w-full max-w-md rounded-[30px] p-8 shadow-[0_0_50px_rgba(0,168,255,0.1)] relative overflow-hidden">
        {/* Línea de brillo superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00A8FF] to-transparent"></div>

        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors p-2">✕</button>

        <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">
          {tSellModal('title_sell_in')} <span className="text-[#00A8FF]">{selectedServer.server}</span>
        </h3>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">
          {t('label_rate')} ${selectedServer.rate} USDT / MK
        </p>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Inputs de Formulario */}
          <div>
            <label className="text-[10px] font-black text-gray-600 uppercase ml-1">{t('placeholder_pj')}</label>
            <input
              type="text"
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-[#00A8FF]/50 mt-1 transition-all"
              placeholder={tSellModal('placeholder_game_name')}
              value={pjName}
              onChange={(e) => setPjName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-600 uppercase ml-1">{tSellModal('label_sell_amount')}</label>
            <input
              type="number"
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-[#00A8FF]/50 mt-1 transition-all"
              placeholder={tSellModal('placeholder_example_amount')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-600 uppercase ml-1">{tSellModal('label_receive_method')}</label>
            <select
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white outline-none mt-1 text-xs font-bold uppercase"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Pago Móvil / Transferencia">Pago Móvil / Transferencia (Bs)</option>
              <option value="Binance Pay">Binance Pay (USDT)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-600 uppercase ml-1">{tSellModal('label_bank_details')}</label>

            <textarea
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-[#00A8FF]/50 mt-1 text-xs min-h-[80px]"
              placeholder={tSellModal('placeholder_bank_details')}
              value={sellPaymentDetails}
              onChange={(e) => setSellPaymentDetails(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-[#00A8FF] uppercase ml-1">{tSellModal('label_contact_whatsapp')}</label>
            <input
              type="tel"
              className="w-full bg-[#0B0F19] border border-[#00A8FF]/50 rounded-xl p-4 text-white outline-none focus:border-[#00A8FF] mt-1"
              placeholder={t('placeholder_phone')}
              value={sellPhone}
              onChange={(e) => setSellPhone(e.target.value)}
            />
          </div>

          {/* CUADRO DE RESULTADO EN BOLÍVARES O USDT */}
          {toNumber(amount) > 0 && (
            <div className={`p-5 rounded-2xl mt-6 border transition-all duration-500 ${paymentMethod === 'Binance Pay'
                ? 'bg-[#FBB03B]/5 border-[#FBB03B]/30'
                : 'bg-[#00A8FF]/5 border-[#00A8FF]/30'
              }`}>
              <p className="text-gray-400 text-[10px] font-black uppercase mb-1 tracking-widest text-center">
                {tSellModal('label_total_receive')}
              </p>
              <p className={`text-3xl font-black text-center ${paymentMethod === 'Binance Pay' ? 'text-[#FBB03B]' : 'text-[#00A8FF]'
                }`}>
                {paymentMethod === 'Binance Pay'
                  ? `${totalUsd.toFixed(2)} USDT`
                  : `${formatBs(totalBs)} Bs.`}
              </p>
            </div>
          )}

          <button
            onClick={handleTransaction}
            disabled={!pjName.trim() || !amount || !sellPhone.trim()}
            className="w-full mt-4 py-5 bg-[#00A8FF] text-[#0B0F19] font-black uppercase text-sm rounded-xl hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#00A8FF]/20 active:scale-95"
          >
            {t('btn_sell')}
          </button>
        </div>
      </div>
    </div>
  );
}