"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStock: any;
  dolarRate: number;
  user: any;
  profile: any;
}

const WHATSAPP_URL = 'https://wa.me/584124989220';

export default function BuyModal({ 
  isOpen, 
  onClose, 
  selectedStock, 
  dolarRate, 
  user, 
  profile 
}: BuyModalProps) {
  const t = useTranslations('TradingBoard');
  const tCommon = useTranslations('common');
  const tBuyModal = useTranslations('BuyModal');

  // Estados internos
  const [buyPjName, setBuyPjName] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [buyPaymentMethod, setBuyPaymentMethod] = useState('Pago Móvil / Transferencia');
  const [buyPhone, setBuyPhone] = useState('');
  const [buyPaymentDetails, setBuyPaymentDetails] = useState('');

  // Sincronización con el perfil
  useEffect(() => {
    if (profile && isOpen) {
      setBuyPhone(profile.whatsapp || '');
      setBuyPaymentDetails(profile.pago_movil || '');
    }
  }, [profile, isOpen]);

  if (!isOpen || !selectedStock) return null;

  const toNumber = (val: any) => {
    const p = Number(val);
    return Number.isFinite(p) ? p : 0;
  };

  const formatBs = (val: number) =>
    val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Lógica de cálculo y validación
  const totalUsd = toNumber(buyAmount) * toNumber(selectedStock.price_usd);
  const totalBs = totalUsd * dolarRate;
  const isUsdPayment = ['Binance Pay', 'Zinli'].includes(buyPaymentMethod);
  const buyExceedsStock = toNumber(buyAmount) > toNumber(selectedStock.stock_mk);

  const handleTransaction = async () => {
    if (!buyPjName.trim() || toNumber(buyAmount) <= 0 || buyExceedsStock || !buyPhone.trim()) {
      alert(tCommon('error'));
      return;
    }

    let orderId: string | number = `COM-${Math.floor(Date.now() / 1000)}`;

    try {
      const { data, error } = await supabase.from('digital_orders').insert([{
        product_name: `Compra Kamas - ${selectedStock.game}`,
        variant_name: `${buyAmount} MK en ${selectedStock.server_name} (PJ: ${buyPjName.trim()})`,
        price_text: isUsdPayment ? totalUsd.toFixed(2) : null,
        price_bs: !isUsdPayment ? Number(totalBs.toFixed(2)) : null,
        payment_method: buyPaymentMethod,
        customer_phone: buyPhone.trim(),
        payment_details: buyPaymentDetails.trim() || 'A enviar por chat',
        status: 'pendiente',
        user_id: user?.id || null,
      }]).select('id').single();

      if (!error && data?.id) orderId = data.id;
    } catch (e) {
      console.error("Error BD:", e);
    }

    const message = `¡Hola Khazonli! 👋\n\nVengo a *COMPRAR* Kamas Dofus.\n\n🆔 *TICKET:* ${orderId}\n🎮 *JUEGO:* ${selectedStock.game}\n🌍 *SERVER:* ${selectedStock.server_name}\n👤 *PJ:* ${buyPjName.trim()}\n💰 *CANTIDAD:* ${buyAmount} MK\n💳 *MÉTODO DE PAGO:* ${buyPaymentMethod}\n📞 *WHATSAPP:* ${buyPhone.trim()}\n\n💵 *TOTAL A PAGAR:* ${
      isUsdPayment 
        ? `${totalUsd.toFixed(2)} ${buyPaymentMethod === 'Zinli' ? 'USD' : 'USDT'}` 
        : `${formatBs(totalBs)} Bs.`
    }`;

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121826] border border-[#FBB03B]/30 w-full max-w-md rounded-[30px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FBB03B] to-transparent"></div>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors p-2">✕</button>

        <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">
          {t('tab_buy')} <span className="text-[#FBB03B]">{selectedStock.server_name}</span>
        </h3>
        
        <div className="flex justify-between border-b border-gray-800 pb-4 mb-6">
          <p className="text-gray-500 text-[10px] font-bold uppercase">{t('label_price')} ${selectedStock.price_usd}</p>
          <p className="text-gray-500 text-[10px] font-bold uppercase">{t('label_stock')} {selectedStock.stock_mk}M</p>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <label className="text-[10px] font-black text-gray-600 uppercase ml-1">{t('placeholder_pj')}</label>
            <input 
              type="text" 
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-[#FBB03B]/50 mt-1 transition-all"
              placeholder={tBuyModal('placeholder_character')}
              value={buyPjName} 
              onChange={(e) => setBuyPjName(e.target.value)} 
            />
          </div>

          <div className="relative">
            <label className="text-[10px] font-black text-gray-600 uppercase ml-1">{tBuyModal('label_amount_mk')}</label>
            <input 
              type="number" 
              className={`w-full bg-[#0B0F19] border rounded-xl p-4 text-white outline-none mt-1 transition-all ${buyExceedsStock ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-gray-800 focus:border-[#FBB03B]/50'}`}
              placeholder={tBuyModal('placeholder_amount_mk')}
              value={buyAmount} 
              onChange={(e) => setBuyAmount(e.target.value)} 
            />
            {buyExceedsStock && <p className="text-[9px] text-red-500 font-bold uppercase mt-1 ml-2">{tBuyModal('error_exceeds_stock')}</p>}
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-600 uppercase ml-1">{tBuyModal('label_payment_method')}</label>
            <select 
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white outline-none mt-1 text-sm font-bold uppercase"
              value={buyPaymentMethod}
              onChange={(e) => setBuyPaymentMethod(e.target.value)}
            >
              <option value="Pago Móvil / Transferencia">{tBuyModal('option_payment_mobile')}</option>
              <option value="Binance Pay">{tBuyModal('option_binance')}</option>
              <option value="Zinli">{tBuyModal('option_zinli')}</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-600 uppercase ml-1">{tBuyModal('label_payment_ref')}</label>
            <input 
              type="text" 
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-[#FBB03B]/50 mt-1"
              placeholder={tBuyModal('placeholder_payment_ref')}
              value={buyPaymentDetails} 
              onChange={(e) => setBuyPaymentDetails(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-[#FBB03B] uppercase ml-1">{tBuyModal('label_whatsapp')}</label>
            <input 
              type="tel" 
              className="w-full bg-[#0B0F19] border border-[#FBB03B]/50 rounded-xl p-4 text-white outline-none focus:border-[#FBB03B] mt-1"
              placeholder={t('placeholder_phone')}
              value={buyPhone} 
              onChange={(e) => setBuyPhone(e.target.value)} 
            />
          </div>

          {toNumber(buyAmount) > 0 && !buyExceedsStock && (
            <div className={`p-5 rounded-2xl mt-6 border transition-all duration-500 ${isUsdPayment ? 'bg-[#FBB03B]/5 border-[#FBB03B]/30' : 'bg-[#00A8FF]/5 border-[#00A8FF]/30'}`}>
              <p className="text-gray-400 text-[10px] font-black uppercase mb-1 text-center tracking-widest">{tBuyModal('label_total_pay')}</p>
              <p className={`text-3xl font-black text-center ${isUsdPayment ? 'text-[#FBB03B]' : 'text-[#00A8FF]'}`}>
                {isUsdPayment 
                  ? `${totalUsd.toFixed(2)} ${buyPaymentMethod === 'Zinli' ? 'USD' : 'USDT'}` 
                  : `${formatBs(totalBs)} Bs.`}
              </p>
            </div>
          )}

          <button 
            onClick={handleTransaction}
            disabled={!buyPjName.trim() || !buyAmount || !buyPhone.trim() || buyExceedsStock}
            className="w-full mt-4 py-5 bg-[#FBB03B] text-[#0B0F19] font-black uppercase text-sm rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-lg shadow-[#FBB03B]/20 active:scale-95"
          >
            {t('btn_buy')}
          </button>
        </div>
      </div>
    </div>
  );
}