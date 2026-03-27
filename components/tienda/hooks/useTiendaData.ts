"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export function useTiendaData() {
  const [activeCategory, setActiveCategory] = useState('mmo');
  const [storeStatus, setStoreStatus] = useState('activo');
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);

  const [rates, setRates] = useState({ buy: 0, sell: 0 });
  const [payments, setPayments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const [customerPhone, setCustomerPhone] = useState('');
  const [walletReceiverEmail, setWalletReceiverEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (session) {
        setCurrentUser(session.user);

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          if (profile.whatsapp) setCustomerPhone(profile.whatsapp);
          if (profile.zinli_email) setWalletReceiverEmail(profile.zinli_email);
        }
      }

      const { data: sData } = await supabase
        .from('store_settings')
        .select('status')
        .eq('id', 1)
        .single();

      if (sData) setStoreStatus(sData.status);

      const { data: rData } = await supabase
        .from('exchange_rates')
        .select('buy_rate, sell_rate')
        .limit(1)
        .single();

      if (rData) setRates({ buy: rData.buy_rate, sell: rData.sell_rate });

      const { data: pData } = await supabase
        .from('digital_catalog')
        .select('*, product_variants(*)')
        .order('id');

      if (pData) setCatalogProducts(pData);

      const { data: payData } = await supabase
        .from('payment_methods')
        .select('*')
        .order('id');

      if (payData) setPayments(payData);

      const { data: eData } = await supabase
        .from('events')
        .select('*')
        .in('status', ['active', 'closed', 'finished'])
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (eData) setEvents(eData);
    };

    fetchData();

    const channel = supabase
      .channel('realtime-store')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'store_settings' },
        (payload) => setStoreStatus(payload.new.status)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
  };
}