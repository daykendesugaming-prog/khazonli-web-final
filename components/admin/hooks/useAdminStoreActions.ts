"use client";

import { supabase } from '../../../lib/supabase';
import { RatesState, ShowToast } from './types';

type UseAdminStoreActionsParams = {
  showToast: ShowToast;
  rates: RatesState;
  setRates: React.Dispatch<React.SetStateAction<RatesState>>;
  setStoreStatus: React.Dispatch<React.SetStateAction<string>>;
  loadProducts: () => Promise<void>;
  loadMetrics: () => Promise<void>;
};

export function useAdminStoreActions({
  showToast,
  rates,
  setRates,
  setStoreStatus,
  loadProducts,
  loadMetrics,
}: UseAdminStoreActionsParams) {
  const handleSaveRates = async () => {
    if (!rates.id) {
      const { data, error } = await supabase
        .from('exchange_rates')
        .insert([{ buy_rate: rates.buy, sell_rate: rates.sell }])
        .select()
        .single();

      if (error) {
        showToast('error', 'No se pudieron guardar las tasas', error.message);
        return;
      }

      if (data) {
        setRates({
          id: data.id,
          buy: data.buy_rate,
          sell: data.sell_rate,
        });
      }

      showToast(
        'success',
        'Tasas iniciales registradas',
        `Compra: ${rates.buy} Bs · Venta: ${rates.sell} Bs.`
      );
      await loadProducts();
      return;
    }

    const { error } = await supabase
      .from('exchange_rates')
      .update({ buy_rate: rates.buy, sell_rate: rates.sell })
      .eq('id', rates.id);

    if (error) {
      showToast('error', 'No se pudieron actualizar las tasas', error.message);
      return;
    }

    showToast(
      'success',
      'Tasas sincronizadas',
      `Compra: ${rates.buy} Bs · Venta: ${rates.sell} Bs. Panel y cálculos listos.`
    );

    await loadProducts();
    await loadMetrics();
  };

  const handleUpdateStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from('store_settings')
      .update({ status: newStatus })
      .eq('id', 1);

    if (error) {
      showToast('error', 'No se pudo actualizar el estado', error.message);
      return;
    }

    setStoreStatus(newStatus);
    showToast('success', 'Estado actualizado', `La estación ahora figura como ${newStatus}.`);
  };

  return {
    handleSaveRates,
    handleUpdateStatus,
  };
}