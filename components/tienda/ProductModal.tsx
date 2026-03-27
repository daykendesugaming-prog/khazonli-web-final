"use client";

import { useLocale, useTranslations } from 'next-intl';
import { isBsPayment, isZinliPayment, renderIcon } from '@/components/tienda/utils/tiendaHelpers';

type Props = {
  selectedProduct: any;
  selectedVariant: any;
  setSelectedVariant: (value: any) => void;
  step: number;
  setStep: (value: number) => void;
  selectedPayment: any;
  setSelectedPayment: (value: any) => void;
  payments: any[];
  userProfile: any;
  isWalletProduct: boolean;
  walletAmount: string;
  setWalletAmount: (value: string) => void;
  rates: { buy: number; sell: number };
  resetModals: () => void;
  isCopied: boolean;
  setIsCopied: (value: boolean) => void;
  paymentDetails: string;
  setPaymentDetails: (value: string) => void;
  customerPhone: string;
  setCustomerPhone: (value: string) => void;
  walletReceiverEmail: string;
  setWalletReceiverEmail: (value: string) => void;
  paymentDetailLabel: () => string;
  paymentDetailPlaceholder: () => string;
  handleFinalOrder: () => void;
};

export default function ProductModal({
  selectedProduct, selectedVariant, setSelectedVariant,
  step, setStep, selectedPayment, setSelectedPayment,
  payments, userProfile, isWalletProduct,
  walletAmount, setWalletAmount, rates,
  resetModals, isCopied, setIsCopied,
  paymentDetails, setPaymentDetails,
  customerPhone, setCustomerPhone,
  walletReceiverEmail, setWalletReceiverEmail,
  paymentDetailLabel, paymentDetailPlaceholder,
  handleFinalOrder,
}: Props) {
  const t = useTranslations('Modals');
  const tTienda = useTranslations('Tienda');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  if (!selectedProduct) return null;

  const displayProductName = selectedProduct[`name_${locale}`] || selectedProduct.name;
  
  const toNumber = (val: any) => {
    const p = Number(val);
    return Number.isFinite(p) ? p : 0;
  };

  const formatBs = (val: number) =>
    val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    /* 📱 CORRECCIÓN DE ZOOM: items-end en móvil para que no se descentre */
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-[#0B0F19]/95 backdrop-blur-md p-0 md:p-4 animate-fade-in overflow-hidden">
      
      {/* 📱 CORRECCIÓN DE ANCHO: max-w-full md:max-w-md para que no empuje las paredes del navegador */}
      <div className="bg-[#121826] border-t border-x md:border border-gray-800 rounded-t-[30px] md:rounded-[40px] w-full max-w-full md:max-w-md relative overflow-hidden shadow-2xl max-h-[92vh] flex flex-col mx-0">
      {/* Cabecera con Icono: FIX h-16 en móvil para salvar la vista horizontal (Landscape) */}
        <div className="h-16 md:h-40 shrink-0 bg-gradient-to-br from-[#0B0F19] to-gray-900 flex items-center justify-center relative border-b border-gray-800">
          <div className="bg-[#121826] p-3 md:p-6 rounded-3xl border border-gray-800 shadow-2xl scale-50 md:scale-100 transition-transform">
            {renderIcon(selectedProduct.icon, true)}
          </div>
          <button
            onClick={resetModals}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-red-500 z-20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Contenido interno con scroll */}
      {/* FIX: p-4 en móvil (antes p-8) para no asfixiar el contenido interno y centrar bien */}
      <div className="p-4 md:p-10 text-center flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Título con break-words para evitar que nombres largos ensanchen el modal */}
          <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter mb-6 break-words px-2">
            {displayProductName}
          </h3>

          {step === 1 ? (
            selectedProduct.category === 'wallets' ? (
              /* --- CALCULADORA DE RECARGA (WALLY/ZINLI) --- */
              <div className="bg-[#0B0F19] border border-gray-800 p-5 md:p-8 rounded-3xl space-y-6 text-left animate-fade-in shadow-inner mx-1">
                <p className="text-[#00A8FF] text-[10px] font-black uppercase tracking-widest text-center">
                  {t('calculator_title')}
                </p>

                <div className="bg-[#121826] border border-gray-800 rounded-2xl p-3 flex items-center gap-3 focus-within:border-[#00A8FF]/50 transition-colors">
                  <span className="text-2xl font-black text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder={t('amount_placeholder')}
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    className="w-full bg-transparent text-3xl text-white font-black outline-none placeholder-gray-800 min-w-0"
                  />
                </div>

                {(() => {
                  const amount = parseFloat(walletAmount) || 0;
                  const commissionPct = selectedProduct.product_variants?.[0]?.price_usd || 0;
                  const fee = amount * (commissionPct / 100);
                  const totalUsd = amount + fee;
                  const totalBs = totalUsd * (rates?.sell || 0);

                  return (
                    <div className="pt-4 border-t border-gray-800 space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                        <span>{t('commission')} ({commissionPct}%):</span>
                        <span className="text-red-400">+ ${fee.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center text-sm font-black text-white uppercase mt-4 bg-gray-800/30 p-3 rounded-xl">
                        <span>{t('total_usd')}:</span>
                        <span className="text-[#FBB03B] text-xl">
                          ${totalUsd.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase px-1">
                        <span>Equivalente en Bs:</span>
                        <span className="text-gray-300">
                          {formatBs(totalBs)} Bs.
                        </span>
                      </div>

                      <button
                        disabled={amount <= 0 || !selectedProduct.product_variants?.[0]}
                        onClick={() => {
                          setSelectedVariant({
                            variant_name: `Recarga de $${amount.toFixed(2)}`,
                            price_usd: totalUsd,
                            price_text: totalUsd.toFixed(2),
                            is_wallet: true,
                            calculated_bs: totalBs,
                          });
                          setStep(2);
                        }}
                        className="w-full mt-6 py-4 bg-[#00A8FF] text-[#0B0F19] font-black uppercase text-sm rounded-xl hover:bg-blue-400 disabled:opacity-30 transition-all shadow-lg shadow-[#00A8FF]/20 active:scale-95"
                      >
                        {t('continue_payment')}
                      </button>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* --- LISTA DE VARIANTES/PLANES (GAMING / STREAMING) --- */
              <div className="space-y-2 px-1">
                {(selectedProduct.product_variants || []).length > 0 ? (
                  selectedProduct.product_variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setStep(2);
                      }}
                      className="w-full bg-[#0B0F19] border border-gray-800 p-4 md:p-5 rounded-2xl flex justify-between items-center group hover:border-[#00A8FF]/50 transition-all active:scale-[0.98]"
                    >
                      <div className="text-left pr-4 overflow-hidden">
                        <p className="text-sm font-black text-white leading-tight">
                          {v[`variant_name_${locale}`] || v.variant_name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-black text-[#FBB03B]">
                          ${v.price_text}
                        </p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                          ≈ {formatBs(toNumber(v.price_usd) * (rates?.sell || 0))} Bs.
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm font-bold uppercase py-10">
                    {tCommon('loading')}
                  </p>
                )}
              </div>
            )
          ) : (
            /* --- PASO 2: MÉTODOS DE PAGO Y DETALLES FINAL --- */
            <div className="animate-fade-in space-y-4 px-1">
              {!selectedPayment ? (
                <div className="grid gap-3 text-left">
                  <p className="text-green-400 text-[10px] font-black uppercase tracking-widest mb-2 italic text-center">
                    {t('how_to_pay')}
                  </p>
                  {payments.length > 0 ? (
                    payments.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPayment(p);
                          if (userProfile) {
                            if (userProfile.whatsapp) setCustomerPhone(userProfile.whatsapp);
                            if (isWalletProduct && isZinliPayment(p.name) && userProfile.zinli_email) {
                              setWalletReceiverEmail(userProfile.zinli_email);
                            }
                          }
                        }}
                        className="bg-[#0B0F19] border border-gray-800 p-4 rounded-2xl flex flex-col hover:border-green-400 transition-all active:scale-[0.98] shadow-lg"
                      >
                        <span className="text-white text-sm font-black uppercase">{p.name}</span>
                        <span className="text-[10px] text-gray-500 truncate max-w-full overflow-hidden">
                          {p.details}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">{tCommon('loading')}</p>
                  )}
                  
                  <button 
                    onClick={() => setStep(1)} 
                    className="mt-4 w-full text-center text-[10px] text-gray-600 font-bold uppercase hover:text-white transition-colors"
                  >
                    ← {tCommon('back')}
                  </button>
                </div>
              ) : (
                /* FORMULARIO FINAL DE DATOS Y WHATSAPP */
                <div className="bg-[#0B0F19] border border-green-500/20 p-5 md:p-7 rounded-3xl text-left relative overflow-hidden">
                  <h4 className="text-green-400 font-black uppercase text-sm mb-3">
                    {selectedPayment.name}
                  </h4>

                  <div className="bg-black/40 p-4 rounded-xl border border-gray-800 mb-4 overflow-x-hidden">
                    <p className="text-white text-[11px] font-mono leading-relaxed whitespace-pre-line break-words">
                      {selectedPayment.details}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPayment.details);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className={`w-full py-3 mb-6 text-[10px] font-black uppercase rounded-xl transition-all ${
                      isCopied ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-gray-800 text-white'
                    }`}
                  >
                    {isCopied ? t('copied') : t('copy_data')}
                  </button>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-[9px] uppercase font-black text-gray-500 mb-1 block ml-1">{t('whatsapp_required')}</label>
                      <input 
                        type="tel" 
                        placeholder="Ej: +58 412 1234567" 
                        className="w-full bg-[#121826] border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-green-500/50 mt-1 transition-all"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-black text-gray-500 mb-1 block ml-1">{paymentDetailLabel()}</label>
                      <input 
                        type="text" 
                        placeholder={paymentDetailPlaceholder()} 
                        className="w-full bg-[#121826] border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-green-500/50 mt-1 transition-all"
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                      />
                    </div>

                    {/* Lógica especial para Zinli/Wally receptor */}
                    {isWalletProduct && isZinliPayment(selectedPayment.name) && (
                      <div className="animate-fade-in mt-4">
                        <label className="text-[9px] uppercase font-black text-green-400 mb-1 block ml-1">Correo receptor Zinli/Wally *</label>
                        <input 
                          type="email" 
                          placeholder="tu-correo@ejemplo.com" 
                          className="w-full bg-[#121826] border border-green-500/30 rounded-xl p-3 text-white text-sm outline-none mt-1"
                          value={walletReceiverEmail}
                          onChange={(e) => setWalletReceiverEmail(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* RESULTADO FINAL DE PRECIO */}
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-6 text-center">
                    <p className="text-[9px] uppercase font-black text-gray-500 mb-1">Monto total a transferir:</p>
                    <p className="text-2xl font-black text-white">
                      {isBsPayment(selectedPayment.name)
                        ? `≈ ${formatBs(selectedVariant.is_wallet ? selectedVariant.calculated_bs : toNumber(selectedVariant.price_usd) * (rates?.sell || 0))} Bs.`
                        : `${selectedVariant.price_text} ${isZinliPayment(selectedPayment.name) ? 'USD' : 'USDT'}`
                      }
                    </p>
                  </div>

                  <button
                    onClick={handleFinalOrder}
                    className="w-full py-4 bg-[#25D366] text-[#0B0F19] font-black uppercase text-sm rounded-xl hover:bg-green-400 transition-all shadow-[0_10px_30px_rgba(37,211,102,0.3)] active:scale-95"
                  >
                    {t('notify_payment')}
                  </button>

                  <button 
                    onClick={() => setSelectedPayment(null)} 
                    className="w-full text-center mt-5 text-[10px] text-gray-600 font-bold uppercase tracking-widest hover:text-white transition-colors"
                  >
                    ← {t('change_method')}
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