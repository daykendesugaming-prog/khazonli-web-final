"use client";

import { supabase } from '../../../lib/supabase';
import { NewServerState, ShowToast } from './types';

type UseAdminMmoActionsParams = {
  showToast: ShowToast;
  newServer: NewServerState;
  setNewServer: React.Dispatch<React.SetStateAction<NewServerState>>;
  loadServers: () => Promise<void>;
  loadMetrics: () => Promise<void>;
};

export function useAdminMmoActions({
  showToast,
  newServer,
  setNewServer,
  loadServers,
  loadMetrics,
}: UseAdminMmoActionsParams) {
  const handleSaveServer = async (server: any) => {
    const { error } = await supabase
      .from('mmo_servers')
      .update({
        buy_rate: parseFloat(server.buy_rate),
        sell_rate: parseFloat(server.sell_rate),
        is_active: server.is_active,
      })
      .eq('server_name', server.server_name);

    if (error) {
      showToast('error', 'No se pudo actualizar el servidor', error.message);
      return;
    }

    showToast('success', 'Servidor actualizado', `${server.server_name} quedó sincronizado.`);
    await loadMetrics();
  };

  const handleCreateServer = async () => {
    if (!newServer.game || !newServer.name) {
      showToast('info', 'Faltan datos del servidor', 'Debes indicar el juego y el nombre del servidor.');
      return;
    }

    const serverName = newServer.name;

    const { error } = await supabase.from('mmo_servers').insert([
      {
        game: newServer.game,
        server_name: newServer.name,
        buy_rate: parseFloat(newServer.buy || '0'),
        sell_rate: parseFloat(newServer.sell || '0'),
        is_active: true,
      },
    ]);

    if (error) {
      showToast('error', 'No se pudo crear el servidor', error.message);
      return;
    }

    setNewServer({ game: '', name: '', buy: '', sell: '' });
    await loadServers();
    showToast('success', 'Servidor creado', `${serverName} fue añadido al mercado MMO.`);
  };

  const handleDeleteServer = async (serverName: string) => {
    const { error } = await supabase.from('mmo_servers').delete().eq('server_name', serverName);

    if (error) {
      showToast('error', 'No se pudo eliminar el servidor', error.message);
      return;
    }

    await loadServers();
    showToast('success', 'Servidor eliminado', `${serverName} salió del mercado MMO.`);
  };

  return {
    handleSaveServer,
    handleCreateServer,
    handleDeleteServer,
  };
}