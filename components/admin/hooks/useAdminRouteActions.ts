"use client";

import { supabase } from '../../../lib/supabase';
import { NewRouteState, ShowToast } from './types';

type UseAdminRouteActionsParams = {
  showToast: ShowToast;
  newRoute: NewRouteState;
  setNewRoute: React.Dispatch<React.SetStateAction<NewRouteState>>;
  loadRoutes: () => Promise<void>;
  loadMetrics: () => Promise<void>;
};

export function useAdminRouteActions({
  showToast,
  newRoute,
  setNewRoute,
  loadRoutes,
  loadMetrics,
}: UseAdminRouteActionsParams) {
  const handleSaveRoute = async (route: any) => {
    const { error } = await supabase
      .from('exchange_routes')
      .update({
        mode: route.mode,
        rate: parseFloat(route.rate || '0'),
        is_active: route.is_active,
      })
      .eq('id', route.id);

    if (error) {
      showToast('error', 'No se pudo actualizar la ruta', error.message);
      return;
    }

    showToast('success', 'Ruta actualizada', `${route.server_from} → ${route.server_to} quedó sincronizada.`);
    await loadMetrics();
  };

  const handleCreateRoute = async () => {
    if (!newRoute.server_from || !newRoute.server_to) {
      showToast('info', 'Faltan datos de la ruta', 'Debes indicar el origen y el destino.');
      return;
    }

    const from = newRoute.server_from;
    const to = newRoute.server_to;

    const { error } = await supabase.from('exchange_routes').insert([
      {
        server_from: newRoute.server_from,
        server_to: newRoute.server_to,
        mode: newRoute.mode,
        rate: parseFloat(newRoute.rate || '0'),
        is_active: true,
      },
    ]);

    if (error) {
      showToast('error', 'No se pudo crear la ruta', error.message);
      return;
    }

    setNewRoute({ server_from: '', server_to: '', mode: 'fijo', rate: '' });
    await loadRoutes();
    showToast('success', 'Ruta creada', `${from} → ${to} ya está disponible.`);
  };

  const handleDeleteRoute = async (id: number) => {
    const { error } = await supabase.from('exchange_routes').delete().eq('id', id);

    if (error) {
      showToast('error', 'No se pudo eliminar la ruta', error.message);
      return;
    }

    await loadRoutes();
    showToast('success', 'Ruta eliminada', 'La ruta de intercambio fue retirada.');
  };

  return {
    handleSaveRoute,
    handleCreateRoute,
    handleDeleteRoute,
  };
}