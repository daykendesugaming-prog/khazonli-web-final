import { supabase } from '../../../lib/supabase';

export const fetchServers = async () => {
  return await supabase.from('mmo_servers').select('*').order('server_name');
};

export const fetchStocks = async () => {
  return await supabase.from('mmo_stock').select('*').order('server_name');
};

export const fetchRoutes = async () => {
  return await supabase.from('exchange_routes').select('*').order('id');
};

export const fetchRates = async () => {
  return await supabase.from('exchange_rates').select('*').limit(1).single();
};

export const fetchStoreStatus = async () => {
  return await supabase.from('store_settings').select('status').eq('id', 1).single();
};

export const fetchProducts = async () => {
  return await supabase
    .from('digital_catalog')
    .select('*, product_variants(*)')
    .order('id', { ascending: false });
};

export const fetchPayments = async () => {
  return await supabase.from('payment_methods').select('*').order('id');
};

export const fetchEvents = async () => {
  return await supabase.from('events').select('*').order('created_at', { ascending: false });
};

export const fetchOrders = async () => {
  return await supabase.from('digital_orders').select('*');
};