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

  const formatBs = (val: number) =>
    val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    /* 🟢 MEJORA 1: items-end para móvil (Bottom Sheet) y md:items-center para PC */
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-[#0B0F19]/95 backdrop-blur-md p-0 md:p-4 animate-fade-in">
      
      {/* 🟢 MEJORA 2: rounded-t para móvil y max-h-[95vh] para que no se salga nunca */}
      <div className="bg-[#121826] border border-gray-800 rounded-t-[32px] md:rounded-[40px] w-full max-w-lg relative overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
        
        {/* Cabecera: Más pequeña en móvil (h-32) para dar aire */}
        <div className="h-32 md:h-40 shrink-0 bg-gradient-to-br from-[#0B0F19] to-gray-900 flex items-center justify-center relative border-b border-gray-800/50">
          <div className="bg-[#121826] p-4 md:p-6 rounded-3xl border border-gray-800 shadow-2xl scale-90 md:scale-100">
            {renderIcon(selectedProduct.icon, true)}
          </div>
          <button
            onClick={resetModals}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-red-500 z-20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 🟢 MEJORA 3: flex-1 y overflow-y-auto para permitir scroll con el dedo */}
        <div className="p-6 md:p-10 text-center flex-1 overflow-y-auto custom-scrollbar">
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-6">
            {displayProductName}
          </h3>

          {step === 1 ? (
            selectedProduct.category === 'wallets' ? (
              <div className="bg-[#0B0F19] border border-gray-800 p-5 md:p-8 rounded-3xl space-y-6 text-left animate-fade-in shadow-inner">
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
                    className="w-full bg-transparent text-4xl text-white font-black outline-none placeholder-gray-800"
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
                          {formatBs(totalBs)} Bs.
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
              <div className="space-y-3">
                {selectedProduct.product_variants?.length > 0 ? (
                  selectedProduct.product_variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setStep(2);
                      }}
                      className="w-full bg-[#0B0F19] border border-gray-800 p-4 md:p-5 rounded-2xl flex justify-between items-center group hover:border-[#00A8FF]/50 transition-all hover:bg-white/5"
                    >
                      <div className="text-left">
                        <p className="text-sm font-black text-white">
                          {v[`variant_name_${locale}`] || v.variant_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-[#FBB03B]">
                          ${v.price_text}
                        </p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase">
                          ≈ {formatBs(v.price_usd * rates.sell)} Bs.
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm font-bold uppercase py-8">
                    {tCommon('loading')}
                  </p>
                )}
              </div>
            )
          ) : (
            <div className="animate-fade-in space-y-4">
              {!selectedPayment ? (
                <>
                  <p className="text-green-400 font-bold uppercase text-[10px] tracking-widest italic mb-4">
                    {t('how_to_pay')}
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {payments.map((p: any) => (
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
                        className="bg-[#0B0F19] border border-gray-800 p-4 rounded-2xl flex flex-col text-left hover:border-green-400 transition-all"
                      >
                        <span className="text-white text-sm font-black uppercase">{p.name}</span>
                        <span className="text-[10px] text-gray-500 truncate max-w-xs">{p.details}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="mt-6 text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest transition-colors"
                  >
                    ← {tCommon('back')}
                  </button>
                </>
              ) : (
                <div className="bg-[#0B0F19] border border-green-500/30 p-5 md:p-6 rounded-3xl text-left relative overflow-hidden animate-fade-in">
                  <h4 className="text-green-400 font-black uppercase text-sm mb-3">
                    {selectedPayment.name}
                  </h4>

                  <div className="bg-[#121826] p-4 rounded-xl border border-gray-800 mb-4">
                    <p className="text-white text-[11px] font-mono leading-relaxed whitespace-pre-line">
                      {selectedPayment.details}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPayment.details);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className={`w-full py-3 mb-6 font-black uppercase text-[10px] rounded-xl transition-all shadow-lg ${isCopied
                        ? 'bg-green-500 text-black'
                        : 'bg-gray-800 text-white'
                      }`}
                  >
                    {isCopied ? t('copied') : t('copy_data')}
                  </button>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-[10px] uppercase font-black text-gray-500 mb-1 block ml-1">{t('whatsapp_required')}</label>
                      <input
                        type="tel"
                        placeholder="Ej: +58 412 1234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#121826] border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-green-500/50"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-gray-500 mb-1 block ml-1">{paymentDetailLabel()}</label>
                      <input
                        type="text"
                        placeholder={paymentDetailPlaceholder()}
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                        className="w-full bg-[#121826] border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-green-500/50"
                      />
                    </div>

                    {isWalletProduct && selectedPayment && isZinliPayment(selectedPayment.name) && (
                      <div className="animate-fade-in">
                        <label className="text-[10px] uppercase font-black text-green-400 mb-1 block ml-1">{tTienda('email_label')} Zinli/Wally *</label>
                        <input
                          type="email"
                          placeholder="tu-correo@ejemplo.com"
                          value={walletReceiverEmail}
                          onChange={(e) => setWalletReceiverEmail(e.target.value)}
                          className="w-full bg-[#121826] border border-green-500/30 rounded-xl p-3 text-white text-sm outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-6 text-center">
                    <p className="text-[10px] uppercase font-black text-gray-500 mb-1">Monto a transferir:</p>
                    <p className="text-2xl font-black text-white">
                      {isBsPayment(selectedPayment.name)
                        ? `≈ ${formatBs(selectedVariant.is_wallet ? selectedVariant.calculated_bs : selectedVariant.price_usd * rates.sell)} Bs.`
                        : `${selectedVariant.price_text} ${isZinliPayment(selectedPayment.name) ? 'USD' : 'USDT'}`}
                    </p>
                  </div>

                  <button
                    onClick={handleFinalOrder}
                    className="w-full py-4 bg-[#25D366] text-[#0B0F19] font-black uppercase text-sm rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20 active:scale-95"
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