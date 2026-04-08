"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStock: any;
  dolarRate: number;
  user: any;
  profile: any;
  translations: {
    t: any;
    tCommon: any;
    tBuyModal: any;
  };
}

// Tipos para métodos de pago dinámicos
interface PaymentMethod {
  id: number;
  name: string;
  details: string;
  is_active: boolean;
  currency: string;
  icon: string;
  created_at: string;
}

const WHATSAPP_URL = 'https://wa.me/584124989220';

export default function BuyModal({
  isOpen,
  onClose,
  selectedStock,
  dolarRate,
  user,
  profile,
  translations
}: BuyModalProps) {
  const { t, tCommon, tBuyModal } = translations;

  // Estados para el flujo de 2 pasos
  const [step, setStep] = useState(1); // 1: Cantidad, 2: Pago
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Estados originales
  const [buyPjName, setBuyPjName] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [buyPhone, setBuyPhone] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');

  // Cargar métodos de pago dinámicos
  useEffect(() => {
    if (!isOpen) return;

    const loadPaymentMethods = async () => {
      setLoadingPayments(true);
      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('id, name, details, is_active, currency, icon, created_at')
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Filtrar solo métodos activos
        const activeMethods = data?.filter(p => p.is_active !== false) || [];
        setPaymentMethods(activeMethods);
      } catch (error) {
        console.error('Error cargando métodos de pago:', error);
      } finally {
        setLoadingPayments(false);
      }
    };

    loadPaymentMethods();
  }, [isOpen]);

  if (!isOpen || !selectedStock) return null;

  const toNumber = (val: any) => {
    const p = Number(val);
    return Number.isFinite(p) ? p : 0;
  };

  const formatBs = (val: number) =>
    val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Lógica de cálculo
  const totalUsd = toNumber(buyAmount) * toNumber(selectedStock.price_usd);
  const totalBs = totalUsd * dolarRate;
  const buyExceedsStock = toNumber(buyAmount) > toNumber(selectedStock.stock_mk);

  // Validación para avanzar al paso 2
  const canGoToStep2 = buyPjName.trim() &&
    toNumber(buyAmount) > 0 &&
    !buyExceedsStock;

  // Validación para finalizar
  const canFinalize = canGoToStep2 &&
    selectedPayment &&
    buyPhone.trim() &&
    paymentDetails.trim();

  // Helper: determinar si es BS basado en currency
  const isBsCurrency = (currency: string) => 
    currency === 'BS' || currency === 'VES' || currency === 'Bs' || currency === 'Bs.';

  // Helper: determinar si es Zinli basado en nombre y currency
  const isZinliMethod = (name: string, currency: string) => 
    currency === 'USD' && name.toLowerCase().includes('zinli');

  const handleFinalOrder = async () => {
    if (!canFinalize) {
      alert(tCommon('error'));
      return;
    }

    let orderId: string | number = `COM-${Math.floor(Date.now() / 1000)}`;

    const isBs = isBsCurrency(selectedPayment.currency);
    const isZinli = isZinliMethod(selectedPayment.name, selectedPayment.currency);

    try {
      const { data, error } = await supabase.from('digital_orders').insert([{
        product_name: `Compra Kamas - ${selectedStock.game}`,
        variant_name: `${buyAmount} MK en ${selectedStock.server_name} (PJ: ${buyPjName.trim()})`,
        price_text: isBs ? null : totalUsd.toFixed(2),
        price_bs: isBs ? Number(totalBs.toFixed(2)) : null,
        payment_method: selectedPayment.name,
        customer_phone: buyPhone.trim(),
        payment_details: paymentDetails.trim(),
        status: 'pendiente',
        user_id: user?.id || null,
      }]).select('id').single();

      if (!error && data?.id) orderId = data.id;
    } catch (e) {
      console.error("Error BD:", e);
    }

    const message = `¡Hola Khazonli! 👋\n\nVengo a *COMPRAR* Kamas Dofus.\n\n🆔 *TICKET:* ${orderId}\n🎮 *JUEGO:* ${selectedStock.game}\n🌍 *SERVER:* ${selectedStock.server_name}\n👤 *PJ:* ${buyPjName.trim()}\n💰 *CANTIDAD:* ${buyAmount} MK\n💳 *MÉTODO DE PAGO:* ${selectedPayment.name}\n📞 *WHATSAPP:* ${buyPhone.trim()}\n\n💵 *TOTAL A PAGAR:* ${
      isBs 
        ? `${formatBs(totalBs)} Bs.`
        : `${totalUsd.toFixed(2)} ${isZinli ? 'USD' : 'USDT'}`
    }`;

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  // Función auxiliar para determinar placeholder
  const getPaymentDetailPlaceholder = () => {
    if (!selectedPayment) return '';
    
    const isBs = isBsCurrency(selectedPayment.currency);
    const isZinli = isZinliMethod(selectedPayment.name, selectedPayment.currency);
    
    if (isZinli) return 'Ej: tu-correo@zinli.com';
    if (!isBs) return 'Ej: tu-correo@binance.com';
    return 'Ej: Ref 1234 o nombre del titular';
  };

  // Función para calcular el total dinámico
  const getTotalDisplay = () => {
    if (!selectedPayment) {
      return {
        amount: totalUsd.toFixed(2),
        currency: 'USDT',
        colorClass: 'text-[#FBB03B]',
        bgClass: 'bg-[#FBB03B]/5 border-[#FBB03B]/30'
      };
    }
    
    const isBs = isBsCurrency(selectedPayment.currency);
    const isZinli = isZinliMethod(selectedPayment.name, selectedPayment.currency);
    
    if (isBs) {
      return {
        amount: formatBs(totalBs),
        currency: 'Bs.',
        colorClass: 'text-[#00A8FF]',
        bgClass: 'bg-[#00A8FF]/5 border-[#00A8FF]/30'
      };
    } else if (isZinli) {
      return {
        amount: totalUsd.toFixed(2),
        currency: 'USD',
        colorClass: 'text-[#FBB03B]',
        bgClass: 'bg-[#FBB03B]/5 border-[#FBB03B]/30'
      };
    } else {
      return {
        amount: totalUsd.toFixed(2),
        currency: 'USDT',
        colorClass: 'text-[#FBB03B]',
        bgClass: 'bg-[#FBB03B]/5 border-[#FBB03B]/30'
      };
    }
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
          {step === 1 ? (
            /* PASO 1: CANTIDAD Y PERSONAJE */
            <div className="animate-fade-in">
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

              <div className="relative mt-4">
                <label className="text-[10px] font-black text-gray-600 uppercase ml-1">{tBuyModal('label_amount_mk')}</label>
                <input
                  type="number"
                  className={`w-full bg-[#0B0F19] border rounded-xl p-4 text-white outline-none mt-1 transition-all ${buyExceedsStock ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-gray-800 focus:border-[#FBB03B]/50'}`}
                  placeholder={tBuyModal('placeholder_amount_mk')}
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                />
                {buyExceedsStock && (
                  <p className="text-[9px] text-red-500 font-bold uppercase mt-1 ml-2">
                    {tBuyModal('error_exceeds_stock')}
                  </p>
                )}
              </div>

              {toNumber(buyAmount) > 0 && !buyExceedsStock && (
                (() => {
                  const total = getTotalDisplay();
                  return (
                    <div className={`p-5 rounded-2xl mt-6 border ${total.bgClass}`}>
                      <p className="text-gray-400 text-[10px] font-black uppercase mb-1 text-center tracking-widest">
                        {tBuyModal('label_total_pay')}
                      </p>
                      <p className={`text-3xl font-black text-center ${total.colorClass}`}>
                        {total.amount} {total.currency}
                      </p>
                    </div>
                  );
                })()
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!canGoToStep2}
                className="w-full mt-6 py-4 bg-[#FBB03B] text-[#0B0F19] font-black uppercase text-sm rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-lg shadow-[#FBB03B]/20 active:scale-95"
              >
                {t('btn_buy')} →
              </button>
            </div>
          ) : (
            /* PASO 2: MÉTODO DE PAGO */
            <div className="animate-fade-in">
              {!selectedPayment ? (
                /* LISTA DE MÉTODOS DE PAGO */
                <>
                  <p className="text-green-400 font-bold uppercase text-xs tracking-widest italic mb-4">
                    {tBuyModal('label_payment_method')}
                  </p>

                  {loadingPayments ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FBB03B] mx-auto"></div>
                      <p className="mt-3 text-gray-500 text-xs uppercase font-bold tracking-widest">
                        {tCommon('loading')}
                      </p>
                    </div>
                  ) : paymentMethods.length === 0 ? (
                    <div className="text-center py-8 text-red-500 text-xs uppercase font-bold">
                      {tBuyModal('no_payment_methods')}
                    </div>
                  ) : (
                    <>
                      {paymentMethods.map((p, idx) => (
                        <button
                          key={p.id || idx}
                          className="group flex items-center w-full px-4 py-3 mb-2 bg-[#121826] border border-gray-800 rounded-xl hover:bg-[#1a2233] transition-all"
                          onClick={() => setSelectedPayment({
                            id: p.id,
                            name: p.name,
                            details: p.details,
                            currency: p.currency
                          })}
                        >
                          <div className="text-left">
                            <span className="text-white text-sm font-black uppercase block mb-1">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-gray-500 block truncate max-w-[200px]">
                              {p.details.split('\n')[0]}
                            </span>
                          </div>
                          <span className="text-[10px] text-green-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest ml-4 shrink-0">
                            Seleccionar →
                          </span>
                        </button>
                      ))}

                      <button
                        onClick={() => setStep(1)}
                        className="w-full mt-6 text-center text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest transition-colors py-2"
                      >
                        ← {tCommon('back')}
                      </button>
                    </>
                  )}
                </>
              ) : (
                /* DETALLE DEL PAGO SELECCIONADO */
                <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>

                  <h4 className="text-green-400 font-black uppercase text-sm mb-2 mt-2">
                    {selectedPayment.name}
                  </h4>

                  {/* DATOS PARA COPIAR */}
                  <div className="bg-[#121826] p-4 rounded-xl border border-gray-800 mb-4">
                    <p className="text-gray-300 text-sm whitespace-pre-line font-mono break-words">
                      {selectedPayment.details}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPayment.details);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2500);
                    }}
                    className={`w-full py-3 mb-6 font-black uppercase text-xs rounded-xl transition-all shadow-lg ${isCopied
                      ? 'bg-green-500 text-black shadow-green-500/20'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                  >
                    {isCopied ? '✅ COPIADO' : '📋 Copiar Datos de Pago'}
                  </button>

                  {/* FORMULARIO DE CONTACTO */}
                  <div className="space-y-4 mb-6 p-4 bg-[#121826] border border-gray-800 rounded-xl">
                    <div>
                      <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block">
                        {tBuyModal('label_whatsapp')}
                      </label>
                      <input
                        type="tel"
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-[#25D366] transition-colors"
                        placeholder={t('placeholder_phone')}
                        value={buyPhone}
                        onChange={(e) => setBuyPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block">
                        {isZinliMethod(selectedPayment.name, selectedPayment.currency) ? 'Correo Zinli' :
                          isBsCurrency(selectedPayment.currency) ? 'Referencia de pago' : 'Correo/Código'}
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-[#25D366] transition-colors"
                        placeholder={getPaymentDetailPlaceholder()}
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                      />
                    </div>
                  </div>

                                    {/* RESUMEN DEL PAGO */}
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-6">
                    <p className="text-[10px] uppercase font-black text-gray-500 mb-1">
                      Monto a transferir:
                    </p>
                    <p className="text-2xl font-black text-white">
                      {isBsCurrency(selectedPayment.currency)
                        ? `≈ ${formatBs(totalBs)} Bs.`
                        : `${totalUsd.toFixed(2)} ${isZinliMethod(selectedPayment.name, selectedPayment.currency) ? 'USD' : 'USDT'}`}
                    </p>
                  </div>

                  {/* BOTÓN FINAL */}
                  <button
                    onClick={handleFinalOrder}
                    disabled={!canFinalize}
                    className="w-full py-4 bg-[#25D366] text-black font-black uppercase text-sm rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💬 Ya pagué, notificar
                  </button>

                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="w-full text-center mt-5 text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest transition-colors py-2"
                  >
                    ← Cambiar método
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}