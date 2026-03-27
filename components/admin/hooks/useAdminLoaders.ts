"use client";

import { supabase } from '../../../lib/supabase';

type Metrics = {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  buyMk: number;
  sellMk: number;
  exchanges: number;
  p2p: number;
  wallet: number;
  volumeBs: number;
  volumeUsd: number;
};

type UseAdminLoadersParams = {
  setServers: React.Dispatch<React.SetStateAction<any[]>>;
  setStocks: React.Dispatch<React.SetStateAction<any[]>>;
  setRoutes: React.Dispatch<React.SetStateAction<any[]>>;
  setRates: React.Dispatch<
    React.SetStateAction<{ id: number | null; buy: number; sell: number }>
  >;
  setStoreStatus: React.Dispatch<React.SetStateAction<string>>;
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  setPayments: React.Dispatch<React.SetStateAction<any[]>>;
  setEvents: React.Dispatch<React.SetStateAction<any[]>>;
  setMetrics: React.Dispatch<React.SetStateAction<Metrics>>;
  getOrderType: (order: any) => string;
};

export function useAdminLoaders({
  setServers,
  setStocks,
  setRoutes,
  setRates,
  setStoreStatus,
  setProducts,
  setPayments,
  setEvents,
  setMetrics,
  getOrderType,
}: UseAdminLoadersParams) {
  const loadServers = async () => {
    const { data } = await supabase.from('mmo_servers').select('*').order('server_name');
    if (data) setServers(data);
  };

  const loadStocks = async () => {
    const { data } = await supabase.from('mmo_stock').select('*').order('server_name');
    if (data) setStocks(data);
  };

  const loadRoutes = async () => {
    const { data } = await supabase.from('exchange_routes').select('*').order('id');
    if (data) setRoutes(data);
  };

  const loadRates = async () => {
    const { data } = await supabase.from('exchange_rates').select('*').limit(1).single();
    if (data) {
      setRates({
        id: data.id,
        buy: data.buy_rate || 0,
        sell: data.sell_rate || 0,
      });
    }
  };

  const loadStoreStatus = async () => {
    const { data } = await supabase
      .from('store_settings')
      .select('status')
      .eq('id', 1)
      .single();
    if (data) setStoreStatus(data.status);
  };

  const loadProducts = async () => {
    const { data } = await supabase
      .from('digital_catalog')
      .select('*, product_variants(*)')
      .order('id', { ascending: false });
    if (data) setProducts(data);
  };

  const loadPayments = async () => {
    const { data } = await supabase.from('payment_methods').select('*').order('id');
    if (data) setPayments(data);
  };

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setEvents(data);
  };

  const loadMetrics = async () => {
    const { data, error } = await supabase.from('digital_orders').select('*');
    if (error || !data) return;

    const next: Metrics = {
      total: data.length,
      pending: 0,
      completed: 0,
      cancelled: 0,
      buyMk: 0,
      sellMk: 0,
      exchanges: 0,
      p2p: 0,
      wallet: 0,
      volumeBs: 0,
      volumeUsd: 0,
    };

    data.forEach((order) => {
      const status = String(order?.status || '').toLowerCase();
      const type = getOrderType(order);

      if (status === 'pendiente') next.pending += 1;
      else if (status === 'completado') next.completed += 1;
      else if (status === 'cancelado') next.cancelled += 1;

      if (type === 'buy') next.buyMk += 1;
      else if (type === 'sell') next.sellMk += 1;
      else if (type === 'exchange') next.exchanges += 1;
      else if (type === 'p2p') next.p2p += 1;
      else if (type === 'wallet') next.wallet += 1;

      // 🟢 CORRECCIÓN: Solo se suma al volumen financiero si la orden está completada
      if (status === 'completado') {
        const priceBs = Number(order?.price_bs || 0);
        next.volumeBs += Number.isFinite(priceBs) ? priceBs : 0;

        const rawText = String(order?.price_text || '')
          .replace(/[^0-9.,-]/g, '')
          .replace(',', '.');

        const priceUsd = Number(rawText || 0);
        next.volumeUsd += Number.isFinite(priceUsd) ? priceUsd : 0;
      }
    });

    setMetrics({
      ...next,
      volumeBs: Number(next.volumeBs.toFixed(2)),
      volumeUsd: Number(next.volumeUsd.toFixed(2)),
    });
  };

  const refreshDashboardData = async () => {
    await Promise.all([
      loadServers(),
      loadStocks(),
      loadRoutes(),
      loadRates(),
      loadStoreStatus(),
      loadProducts(),
      loadPayments(),
      loadEvents(),
      loadMetrics(),
    ]);
  };

  return {
    loadServers,
    loadStocks,
    loadRoutes,
    loadRates,
    loadStoreStatus,
    loadProducts,
    loadPayments,
    loadEvents,
    loadMetrics,
    refreshDashboardData,
  };
}