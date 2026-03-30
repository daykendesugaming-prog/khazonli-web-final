"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // 🟢 RUTAS ABSOLUTAS

// 🛡️ CACHÉ GLOBAL (SINGLETON): El Santo Grial contra el Data Leak.
// Estas variables viven fuera del componente. Si 10 componentes usan el hook, 
// la base de datos se consulta SOLO UNA VEZ.
let globalStoreData: any = null;
let fetchPromise: Promise<any> | null = null;

export function useTiendaData() {
  const [activeCategory, setActiveCategory] = useState('mmo');
  const[storeStatus, setStoreStatus] = useState('activo');
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [rates, setRates] = useState({ buy: 0, sell: 0 });
  const [payments, setPayments] = useState<any[]>([]);
  const[events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const[userProfile, setUserProfile] = useState<any>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [walletReceiverEmail, setWalletReceiverEmail] = useState('');

  // Nuevo estado para saber si la data inicial sigue cargando
  const [isLoading, setIsLoading] = useState(!globalStoreData);

  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones de estado si el componente se desmonta

    const loadData = async () => {
      // 1. Si los datos ya están en caché (RAM), los inyectamos sin llamar a Supabase
      if (globalStoreData) {
        setStoreStatus(globalStoreData.storeStatus);
        setRates(globalStoreData.rates);
        setCatalogProducts(globalStoreData.catalogProducts);
        setPayments(globalStoreData.payments);
        setEvents(globalStoreData.events);
        setIsLoading(false);
        checkUserSession(); // La sesión sí debe verificarse siempre
        return;
      }

      // 2. Si no hay caché y otra instancia no está cargando, iniciamos la promesa
      if (!fetchPromise) {
        fetchPromise = fetchAllStoreData();
      }

      try {
        const data = await fetchPromise;
        if (!isMounted) return;

        // Guardamos en la caché global para futuros renders
        globalStoreData = data;

        setStoreStatus(data.storeStatus);
        setRates(data.rates);
        setCatalogProducts(data.catalogProducts);
        setPayments(data.payments);
        setEvents(data.events);
        setIsLoading(false);

        checkUserSession();
      } catch (error) {
        console.error("Error crítico cargando tienda:", error);
        setIsLoading(false);
      }
    };

    // Función que descarga TODO en paralelo (súper rápido)
    const fetchAllStoreData = async () => {
      const[
        { data: sData },
        { data: rData },
        { data: pData },
        { data: payData },
        { data: eData }
      ] = await Promise.all([
        supabase.from('store_settings').select('status').eq('id', 1).single(),
        supabase.from('exchange_rates').select('buy_rate, sell_rate').order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('digital_catalog').select('*, product_variants(*)').order('id'),
        supabase.from('payment_methods').select('*').order('id'),
        supabase.from('events').select('*').in('status', ['active', 'closed', 'finished']).order('is_featured', { ascending: false }).order('created_at', { ascending: false })
      ]);

      return {
        storeStatus: sData?.status || 'activo',
        rates: rData ? { buy: rData.buy_rate, sell: rData.sell_rate } : { buy: 0, sell: 0 },
        catalogProducts: pData ||[],
        payments: payData || [],
        events: eData ||[]
      };
    };

    // Función exclusiva de sesión (aislada de los datos pesados)
    const checkUserSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (session && isMounted) {
        setCurrentUser(session.user);
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && isMounted) {
          setUserProfile(profile);
          if (profile.whatsapp) setCustomerPhone(profile.whatsapp);
          if (profile.zinli_email) setWalletReceiverEmail(profile.zinli_email);
        }
      }
    };

    loadData();

    // Sincronización Realtime (solo del estado de la tienda, no de todos los datos)
    const channel = supabase
      .channel('realtime-store')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'store_settings' },
        (payload) => {
          if (isMounted && payload.new.status) {
            setStoreStatus(payload.new.status);
            // Actualizamos la caché también
            if (globalStoreData) globalStoreData.storeStatus = payload.new.status;
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  },[]); // Array de dependencias vacío, blindado por el isMounted y el Caché Global

  return {
    activeCategory,
    setActiveCategory,
    storeStatus,
    catalogProducts,
    rates,
    payments,
    events,
    searchQuery,
    setSearchQuery,
    currentUser,
    userProfile,
    customerPhone,
    setCustomerPhone,
    walletReceiverEmail,
    setWalletReceiverEmail,
    isLoading // 🟢 Nuevo valor devuelto útil para UI
  };
}