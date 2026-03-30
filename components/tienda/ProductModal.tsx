"use client";

import { useLocale, useTranslations } from 'next-intl';
import { isBsPayment, isZinliPayment, renderIcon } from '@/components/tienda/utils/tiendaHelpers';
import { useEffect } from 'react';

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
  selectedProduct,
  selectedVariant,
  setSelectedVariant,
  step,
  setStep,
  selectedPayment,
  setSelectedPayment,
  payments,
  userProfile,
  isWalletProduct,
  walletAmount,
  setWalletAmount,
  rates,
  resetModals,
  isCopied,
  setIsCopied,
  paymentDetails,
  setPaymentDetails,
  customerPhone,
  setCustomerPhone,
  walletReceiverEmail,
  setWalletReceiverEmail,
  paymentDetailLabel,
  paymentDetailPlaceholder,
  handleFinalOrder,
}: Props) {
  const t = useTranslations('Modals');
  const tTienda = useTranslations('Tienda');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const canNotify = Boolean(
    customerPhone?.trim() && // WhatsApp requerido
    paymentDetails?.trim() && // Detalles del pago
    selectedVariant && // Variante seleccionada
    selectedPayment && // Método de pago seleccionado
    (!isWalletProduct || !isZinliPayment(selectedPayment.name) || walletReceiverEmail?.trim()) // Email solo para Zinli
  );

  if (!selectedProduct) return null;
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('=== 🐛 PRODUCT MODAL DEBUG ===');
    console.log('Viewport:', window.innerWidth, 'x', window.innerHeight);

    // Verificar elementos fixed
    const fixedElements = document.querySelectorAll('.fixed');
    console.log('Found fixed elements:', fixedElements.length);

    fixedElements.forEach((el, index) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      console.log(`[${index}]`, {
        tag: el.tagName,
        className: el.className,
        zIndex: style.zIndex,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    });

    // Verificar nuestro modal específico
    const productModal = document.querySelector('.fixed.inset-0.z-\\[9999\\]');
    if (productModal) {
      const rect = productModal.getBoundingClientRect();
      console.log('ProductModal position:', {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      });
    }
  }, []);


  // Nombre dinámico desde DB si existe traducción
  const displayProductName = selectedProduct[`name_${locale}`] || selectedProduct.name;

  return (
    // ✅ CORRECCIÓN CRÍTICA: En móvil, usar CENTERING ABSOLUTO con safe padding
    // ANTES: flex items-end md:items-center
    // DESPUÉS: flex items-center justify-center p-4 (siempre centrado)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0F19]/95 animate-fade-in">


      {/* ✅ CORRECCIÓN CRÍTICA: Contenedor con altura máxima SEGURA y scroll externo */}
      {/* ANTES: max-h-[90dvh] md:max-h-[85vh] */}
      {/* DESPUÉS: max-h-[95dvh] (más seguro) y overflow en el contenedor padre */}
      <div className="bg-[#121826] w-[95vw] max-w-lg border border-gray-800 rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden transition-transform max-h-[85dvh] mx-auto my-4 md:w-[90vw] landscape-w-70vw landscape-max-h-75dvh">

        {/* 🟢 INDICADOR MÓVIL: Solo visible en móvil, posicionado correctamente */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-700 rounded-full md:hidden z-50"></div>

        {/* Cabecera con Icono - ALTURA FIJA para consistencia */}
        <div className="h-28 md:h-40 shrink-0 bg-gradient-to-br from-[#0B0F19] to-gray-900 flex items-center justify-center relative border-b border-gray-800/50">
          <div className="bg-[#121826] p-3 md:p-6 rounded-2xl border border-gray-800 shadow-2xl">
            {renderIcon(selectedProduct.icon, true)}
          </div>
          <button
            onClick={resetModals}
            className="absolute top-4 right-4 md:top-5 md:right-5 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-red-500 z-20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ✅ CORRECCIÓN CRÍTICA: Área de contenido con altura CALCULADA y scroll interno controlado */}
        {/* ANTES: flex-1 overflow-y-auto (sin límites) */}
        {/* DESPUÉS: flex-1 min-h-0 (permite shrink) + overflow-y-auto con límites */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className="p-6 md:p-10 text-center">
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
              {displayProductName}
            </h3>

            {step === 1 ? (
              selectedProduct.category === 'wallets' ? (
                /* CALCULADORA DE RECARGA */
                <div className="bg-[#0B0F19] border border-gray-800 p-4 md:p-8 rounded-3xl space-y-4 md:space-y-6 text-left animate-fade-in shadow-inner w-full max-w-[95vw] mx-auto">
                  <p className="text-[#00A8FF] text-xs font-black uppercase tracking-widest text-center">
                    {t('calculator_title')}
                  </p>

                  <div className="bg-[#121826] border border-gray-800 rounded-2xl p-4 flex items-center gap-4 focus-within:border-[#00A8FF]/50 transition-colors">
                    <span className="text-3xl font-black text-gray-500 pl-2">$</span>
                    <input
                      type="number"
                      placeholder={t('amount_placeholder')}
                      value={walletAmount}
                      onChange={(e) => setWalletAmount(e.target.value)}
                      className="w-full bg-transparent text-2xl md:text-4xl text-white font-black outline-none placeholder-gray-800"
                      min="1"
                    />
                  </div>

                  {(() => {
                    const amount = parseFloat(walletAmount) || 0;
                    const commissionPct = selectedProduct.product_variants[0]?.price_usd || 0;
                    const fee = amount * (commissionPct / 100);
                    const totalUsd = amount + fee;
                    const totalBs = totalUsd * rates.sell;

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

                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase px-3">
                          <span>{t('total_bs')}:</span>
                          <span className="text-gray-300">
                            {totalBs.toFixed(2)} Bs
                          </span>
                        </div>

                        <button
                          disabled={amount <= 0 || !selectedProduct.product_variants[0]}
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
                          className="w-full mt-8 py-4 bg-[#00A8FF] text-[#0B0F19] font-black uppercase text-sm rounded-xl hover:bg-blue-400 disabled:opacity-30 transition-all shadow-lg shadow-[#00A8FF]/20 active:scale-95"
                        >
                          {!selectedProduct.product_variants[0]
                            ? 'Admin: Set %'
                            : t('continue_payment')}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* LISTA DE VARIANTES/PLANES */
                <div className="space-y-3">
                  {selectedProduct.product_variants?.length > 0 ? (
                    selectedProduct.product_variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariant(v);
                          setStep(2);
                        }}
                        className="w-full bg-[#0B0F19] border border-gray-800 p-3 md:p-5 rounded-2xl flex justify-between items-center group hover:border-[#00A8FF]/50 transition-all hover:bg-white/5"
                      >
                        <div className="text-left flex-1 min-w-0 pr-2">
                          <p className="text-xs md:text-sm font-black text-white break-words">
                            {v[`variant_name_${locale}`] || v.variant_name}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end shrink-0">
                          <p className="text-lg md:text-xl font-black text-[#FBB03B]">
                            {v.price_text}{' '}
                            <span className="text-xs md:text-sm text-[#FBB03B]/70">USDT</span>
                          </p>
                          <p className="text-[8px] md:text-[10px] text-gray-500 font-bold tracking-wider">
                            ≈ {(v.price_usd * rates.buy).toFixed(2)} Bs
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest py-8">
                      {tCommon('loading')}
                    </p>
                  )}
                </div>
              )
            ) : (
              /* PASO 2: MÉTODOS DE PAGO */
              <div className="animate-fade-in space-y-4">
                {!selectedPayment ? (
                  <>
                    <p className="text-green-400 font-bold uppercase text-xs tracking-widest italic mb-4">
                      {t('how_to_pay')}
                    </p>

                    <div className="grid grid-cols-1 gap-3">
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
                            className="bg-[#0B0F19] border border-gray-800 p-5 md:p-6 rounded-2xl flex justify-between items-center hover:border-green-400 hover:bg-green-400/5 transition-all group shadow-lg"
                          >
                            <div className="text-left">
                              <span className="text-white text-sm md:text-base font-black uppercase block mb-1">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-gray-500 block truncate max-w-[200px]">
                                {p.details}
                              </span>
                            </div>
                            <span className="text-[10px] text-green-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest ml-4 shrink-0">
                              {t('select_method')} →
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">{tCommon('loading')}</p>
                      )}
                    </div>

                    <button
                      onClick={() => setStep(1)}
                      className="mt-6 text-[10px] md:text-xs text-gray-500 hover:text-white uppercase font-bold tracking-widest transition-colors py-2 px-4"
                    >
                      ← {tCommon('back')}
                    </button>
                  </>
                ) : (
                  /* DETALLE DEL PAGO SELECCIONADO */
                  <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-6 text-left relative overflow-hidden animate-fade-in">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                    <h4 className="text-green-400 font-black uppercase text-sm mb-2 mt-2">
                      {selectedPayment.name}
                    </h4>

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
                      {isCopied ? t('copied') : t('copy_data')}
                    </button>

                    <div className="space-y-4 mb-6 p-4 bg-[#121826] border border-gray-800 rounded-xl">
                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block">
                          {t('whatsapp_required')}
                        </label>
                        <input
                          type="tel"
                          placeholder="Ej: +58 412 1234567"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg p-3 text-lg md:text-sm text-white outline-none focus:border-[#25D366] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block">
                          {paymentDetailLabel()}
                        </label>
                        <input
                          type="text"
                          placeholder={paymentDetailPlaceholder()}
                          value={paymentDetails}
                          onChange={(e) => setPaymentDetails(e.target.value)}
                          className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg p-3 text-lg md:text-sm text-white outline-none focus:border-[#25D366] transition-colors"
                        />
                      </div>

                      {isWalletProduct && selectedPayment && isZinliPayment(selectedPayment.name) && (
                        <div>
                          <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block">
                            {tTienda('email_label')} Zinli <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="Ej: tu-correo@zinli.com"
                            value={walletReceiverEmail}
                            onChange={(e) => setWalletReceiverEmail(e.target.value)}
                            className="w-full bg-[#0B0F19] border border-gray-700 rounded-lg p-3 text-lg md:text-sm text-white outline-none focus:border-[#25D366] transition-colors"
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-6">
                      <p className="text-[10px] uppercase font-black text-gray-500 mb-1">
                        Monto a transferir:
                      </p>
                      <p className="text-2xl font-black text-white">
                        {isBsPayment(selectedPayment.name)
                          ? `≈ ${(selectedVariant.is_wallet ? selectedVariant.calculated_bs : selectedVariant.price_usd * rates.sell).toFixed(2)} Bs.`
                          : `${selectedVariant.price_text} ${isZinliPayment(selectedPayment.name) ? 'USD' : 'USDT'}`}
                      </p>
                    </div>

                    <button
                      onClick={handleFinalOrder}
                      disabled={!canNotify}
                      className={`
    w-full py-4 bg-[#25D366] text-black font-black uppercase text-sm 
    rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20 
    active:scale-95 
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:bg-[#25D366] disabled:active:scale-100
  `}
                    >
                      {t('notify_payment')}
                    </button>

                    <button
                      onClick={() => setSelectedPayment(null)}
                      className="w-full text-center mt-5 text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest transition-colors py-2"
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
    </div>
  );
}