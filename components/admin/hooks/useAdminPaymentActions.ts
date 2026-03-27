"use client";

import { supabase } from '../../../lib/supabase';
import { PaymentFormState, ShowToast } from './types';

type UseAdminPaymentActionsParams = {
  showToast: ShowToast;
  paymentForm: PaymentFormState;
  setPaymentForm: React.Dispatch<React.SetStateAction<PaymentFormState>>;
  setIsPaymentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadPayments: () => Promise<void>;
};

export function useAdminPaymentActions({
  showToast,
  paymentForm,
  setPaymentForm,
  setIsPaymentModalOpen,
  loadPayments,
}: UseAdminPaymentActionsParams) {
  const handleSavePayment = async () => {
    if (!paymentForm.name || !paymentForm.details) {
      showToast('info', 'Método incompleto', 'Debes llenar el nombre y los datos del método de pago.');
      return;
    }

    const paymentName = paymentForm.name;

    const { error } = await supabase.from('payment_methods').insert([
      {
        name: paymentForm.name,
        details: paymentForm.details,
      },
    ]);

    if (error) {
      showToast('error', 'No se pudo guardar el método', error.message);
      return;
    }

    setIsPaymentModalOpen(false);
    setPaymentForm({ name: '', details: '' });
    await loadPayments();
    showToast('success', 'Método añadido', `${paymentName} quedó disponible en la tienda.`);
  };

  const handleDeletePayment = async (id: number) => {
    const { error } = await supabase.from('payment_methods').delete().eq('id', id);

    if (error) {
      showToast('error', 'No se pudo eliminar el método', error.message);
      return;
    }

    await loadPayments();
    showToast('success', 'Método eliminado', 'El método de pago fue retirado.');
  };

  return {
    handleSavePayment,
    handleDeletePayment,
  };
}