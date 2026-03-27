"use client";

import { supabase } from '../../../lib/supabase';
import { NewStockState, ShowToast } from './types';

type UseAdminStockActionsParams = {
  showToast: ShowToast;
  newStock: NewStockState;
  setNewStock: React.Dispatch<React.SetStateAction<NewStockState>>;
  loadStocks: () => Promise<void>;
  loadMetrics: () => Promise<void>;
};

export function useAdminStockActions({
  showToast,
  newStock,
  setNewStock,
  loadStocks,
  loadMetrics,
}: UseAdminStockActionsParams) {
  const handleSaveStock = async (stock: any) => {
    const { error } = await supabase
      .from('mmo_stock')
      .update({
        price_usd: parseFloat(stock.price_usd),
        stock_mk: parseFloat(stock.stock_mk),
        is_active: stock.is_active,
      })
      .eq('id', stock.id);

    if (error) {
      showToast('error', 'No se pudo actualizar el inventario', error.message);
      return;
    }

    showToast('success', 'Inventario actualizado', `${stock.server_name} quedó sincronizado.`);
    await loadMetrics();
  };

  const handleCreateStock = async () => {
    if (!newStock.game || !newStock.server_name) {
      showToast('info', 'Faltan datos del inventario', 'Debes indicar el juego y el servidor.');
      return;
    }

    const stockName = newStock.server_name;

    const { error } = await supabase.from('mmo_stock').insert([
      {
        game: newStock.game,
        server_name: newStock.server_name,
        price_usd: parseFloat(newStock.price_usd || '0'),
        stock_mk: parseFloat(newStock.stock_mk || '0'),
        is_active: true,
      },
    ]);

    if (error) {
      showToast('error', 'No se pudo crear el inventario', error.message);
      return;
    }

    setNewStock({ game: '', server_name: '', price_usd: '', stock_mk: '' });
    await loadStocks();
    showToast('success', 'Inventario creado', `${stockName} quedó registrado con stock inicial.`);
  };

  const handleDeleteStock = async (id: number) => {
    const { error } = await supabase.from('mmo_stock').delete().eq('id', id);

    if (error) {
      showToast('error', 'No se pudo eliminar el inventario', error.message);
      return;
    }

    await loadStocks();
    showToast('success', 'Inventario eliminado', 'El registro fue retirado del panel.');
  };

  return {
    handleSaveStock,
    handleCreateStock,
    handleDeleteStock,
  };
}