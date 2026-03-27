"use client";

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { isBsPayment, isZinliPayment } from '../utils/tiendaHelpers';

export function useTiendaOrder({
  currentUser,
  userProfile,
  rates,
}: {
  currentUser: any;
  userProfile: any;
  rates: { buy: number; sell: number };
}) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [walletAmount, setWalletAmount] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.whatsapp || '');
  const [walletReceiverEmail, setWalletReceiverEmail] = useState(userProfile?.zinli_email || '');

  const isWalletProduct =
    !!selectedVariant?.is_wallet || selectedProduct?.category === 'wallets';

  const paymentDetailLabel = () => {
    if (!selectedPayment) return 'Referencia o datos del pago';
    if (isZinliPayment(selectedPayment.name)) return 'Referencia o correo del pago';
    if (selectedPayment.name.toLowerCase().includes('binance')) {
      return 'Referencia o correo del pago';
    }
    return 'Referencia o datos del pago';
  };

  const paymentDetailPlaceholder = () => {
    if (!selectedPayment) return 'Ej: Ref 1234 / datos del pago';
    if (isZinliPayment(selectedPayment.name)) {
      return 'Ej: correo Zinli emisor / Ref 1234';
    }
    if (selectedPayment.name.toLowerCase().includes('binance')) {
      return 'Ej: tu-correo@binance.com / Ref 1234';
    }
    return 'Ej: Ref 1234 / datos del pago';
  };

  const resetModals = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setSelectedPayment(null);
    setWalletAmount('');
    setPaymentDetails('');
    setStep(1);
    setCustomerPhone(userProfile?.whatsapp || '');
    setWalletReceiverEmail(userProfile?.zinli_email || '');
  };

  const handleFinalOrder = async () => {
    if (!selectedPayment || !selectedProduct || !selectedVariant) return;

    if (!customerPhone.trim()) {
      alert(
        '⚠️ Por favor, ingresa tu número de WhatsApp para poder contactarte si hay algún problema con tu orden.'
      );
      return;
    }

    const isBs = isBsPayment(selectedPayment.name);
    const isZinli = isZinliPayment(selectedPayment.name);
    const amountBs = selectedVariant.is_wallet
      ? selectedVariant.calculated_bs
      : selectedVariant.price_usd * rates.buy;

    const amountToPayText = isBs
      ? `${amountBs.toFixed(2)} Bs`
      : `${selectedVariant.price_text} ${isZinli ? 'USD' : 'USDT'}`;

    if (isWalletProduct && isZinli && !walletReceiverEmail.trim()) {
      alert('⚠️ Para recargas por Zinli debes indicar el correo donde recibirás la recarga.');
      return;
    }

    let composedPaymentDetails = paymentDetails.trim();

    if (isWalletProduct && isZinli) {
      composedPaymentDetails = [
        paymentDetails.trim()
          ? `Referencia/Dato del pago: ${paymentDetails.trim()}`
          : null,
        walletReceiverEmail.trim()
          ? `Correo receptor Zinli: ${walletReceiverEmail.trim()}`
          : null,
      ]
        .filter(Boolean)
        .join(' | ');
    }

    let orderId = `TEMP-${Math.floor(Math.random() * 10000)}`;

    try {
      const { data, error } = await supabase
        .from('digital_orders')
        .insert([
          {
            product_name: selectedProduct.name,
            variant_name: selectedVariant.variant_name,
            price_text: selectedVariant.price_text,
            price_bs: amountBs,
            payment_method: selectedPayment.name,
            customer_phone: customerPhone.trim(),
            payment_details: composedPaymentDetails || null,
            status: 'pendiente',
            user_id: currentUser?.id || null,
          },
        ])
        .select()
        .single();

      if (data?.id) orderId = data.id;
      if (error) console.warn('Aviso BD:', error);
    } catch (e) {
      console.warn('Error de conexión BD:', e);
    }

    const extraWalletLine =
      isWalletProduct && isZinli && walletReceiverEmail.trim()
        ? `\n🔹 *Correo receptor Zinli:* ${walletReceiverEmail.trim()}`
        : '';

    const mensaje = `¡Hola Khazonli! 👋

Vengo a notificar el pago de mi *ORDEN #${orderId}*
--------------------------
🔹 *Servicio:* ${selectedProduct.name}
🔹 *Plan:* ${selectedVariant.variant_name}
🔹 *Monto enviado:* ${amountToPayText}
🔹 *Método usado:* ${selectedPayment.name}
🔹 *Referencia / dato del pago:* ${paymentDetails || 'No especificada'}${extraWalletLine}
🔹 *Mi número:* ${customerPhone}
--------------------------
_Te envío el comprobante por aquí._`;

    window.open(
      `https://wa.me/584124989220?text=${encodeURIComponent(mensaje)}`,
      '_blank'
    );

    resetModals();
  };

  return {
    selectedProduct,
    setSelectedProduct,
    selectedVariant,
    setSelectedVariant,
    step,
    setStep,
    selectedPayment,
    setSelectedPayment,
    isCopied,
    setIsCopied,
    walletAmount,
    setWalletAmount,
    paymentDetails,
    setPaymentDetails,
    customerPhone,
    setCustomerPhone,
    walletReceiverEmail,
    setWalletReceiverEmail,
    isWalletProduct,
    paymentDetailLabel,
    paymentDetailPlaceholder,
    resetModals,
    handleFinalOrder,
  };
}