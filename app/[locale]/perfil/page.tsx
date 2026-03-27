"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import NeonToast from '@/components/NeonToast';

export default function PerfilCliente() {
  const router = useRouter();
  const t = useTranslations('Perfil');
  const tCommon = useTranslations('common');
  const tTienda = useTranslations('Tienda');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const [pagoMovil, setPagoMovil] = useState('');
  const [binanceEmail, setBinanceEmail] = useState('');
  const [zinliEmail, setZinliEmail] = useState('');
  const [toast, setToast] = useState({
    open: false,
    type: 'success' as 'success' | 'error' | 'info',
    title: '',
    message: '',
  });
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    checkUser();

    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    setToast({ open: true, type, title, message });

    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 4200);
  };

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileData) {
      setUserProfile({ ...profileData, email: session.user.email, id: session.user.id });
      setPagoMovil(profileData.pago_movil || '');
      setBinanceEmail(profileData.binance_email || '');
      setZinliEmail(profileData.zinli_email || '');
    }

    const { data: ordersData, error: ordersError } = await supabase
      .from('digital_orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!ordersError && ordersData) {
      setOrders(ordersData);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSaveWallet = async () => {
    if (!userProfile?.id) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          pago_movil: pagoMovil,
          binance_email: binanceEmail,
          zinli_email: zinliEmail,
        })
        .eq('id', userProfile.id);

      if (error) {
        showToast('error', tCommon('error'), error.message);
        return;
      }

      setUserProfile((prev: any) =>
        prev
          ? {
              ...prev,
              pago_movil: pagoMovil,
              binance_email: binanceEmail,
              zinli_email: zinliEmail,
            }
          : prev
      );

      showToast(
        'success',
        tCommon('success'),
        t('wallet_sub')
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'completado':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'cancelado':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const isP2POrder = (order: any) =>
    typeof order?.product_name === 'string' &&
    order.product_name.toLowerCase().startsWith('oferta p2p');

  const getOrderAccent = (order: any) => {
    if (isP2POrder(order)) {
      return {
        badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
        border: 'border-purple-500/20',
        glow: 'shadow-[0_0_25px_rgba(168,85,247,0.10)]',
        title: 'text-purple-300',
        label: tTienda('p2p_offer'),
      };
    }

    const product = String(order?.product_name || '').toLowerCase();

    if (product.includes('venta mk')) {
      return {
        badge: 'bg-[#00A8FF]/10 text-[#00A8FF] border-[#00A8FF]/30',
        border: 'border-[#00A8FF]/20',
        glow: 'shadow-[0_0_25px_rgba(0,168,255,0.10)]',
        title: 'text-[#00A8FF]',
        label: 'Venta',
      };
    }

    if (product.includes('compra mk')) {
      return {
        badge: 'bg-[#FBB03B]/10 text-[#FBB03B] border-[#FBB03B]/30',
        border: 'border-[#FBB03B]/20',
        glow: 'shadow-[0_0_25px_rgba(251,176,59,0.10)]',
        title: 'text-[#FBB03B]',
        label: 'Compra',
      };
    }

    if (product.includes('intercambio')) {
      return {
        badge: 'bg-green-400/10 text-green-400 border-green-400/30',
        border: 'border-green-400/20',
        glow: 'shadow-[0_0_25px_rgba(74,222,128,0.10)]',
        title: 'text-green-400',
        label: 'Intercambio',
      };
    }

    return {
      badge: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
      border: 'border-gray-700',
      glow: '',
      title: 'text-white',
      label: t('order_id'),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A8FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      <NeonToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00A8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#00A8FF]">{t('title').split(' ')[0]}</span> {t('title').split(' ')[1]}
            </h1>
            <p className="text-gray-400 mt-2 text-sm tracking-wide">
              {t('subtitle')} <span className="text-white font-bold">{userProfile?.full_name}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-[#121826] border border-gray-800 hover:border-[#00A8FF]/50 rounded-xl font-bold uppercase text-xs transition-all shadow-lg"
            >
              {t('go_store')}
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl font-bold uppercase text-xs transition-all shadow-lg"
            >
              {t('logout')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#121826] border border-gray-800 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-[#00A8FF] font-black uppercase tracking-widest text-xs mb-4">
                {t('credentials')}
              </h2>
              <div className="space-y-4">
                <div className="bg-[#0B0F19] border border-gray-800/50 p-4 rounded-2xl">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1">
                    {tTienda('email_label') || 'Email'}
                  </p>
                  <p className="text-white font-bold text-sm truncate">{userProfile?.email}</p>
                </div>
                <div className="bg-[#0B0F19] border border-[#25D366]/20 p-4 rounded-2xl">
                  <p className="text-[10px] text-[#25D366] uppercase font-black mb-1">
                    {tTienda('whatsapp_label') || 'WhatsApp'}
                  </p>
                  <p className="text-white font-bold text-sm">{userProfile?.whatsapp}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#121826] border border-[#FBB03B]/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(251,176,59,0.05)]">
              <h2 className="text-[#FBB03B] font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                {t('wallet')}
              </h2>
              <p className="text-[10px] text-gray-400 mb-6 leading-relaxed">
                {t('wallet_sub')}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">
                    {t('wallet_pago_movil')}
                  </label>
                  <textarea
                    value={pagoMovil}
                    onChange={(e) => setPagoMovil(e.target.value)}
                    placeholder="Ej: Banesco 0412-1234567 V-12345678"
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-white text-xs outline-none focus:border-[#FBB03B]/50 min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">
                    {t('wallet_binance')}
                  </label>
                  <input
                    type="email"
                    value={binanceEmail}
                    onChange={(e) => setBinanceEmail(e.target.value)}
                    placeholder="tu-correo@binance.com"
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-white text-xs outline-none focus:border-[#FBB03B]/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">
                    {t('wallet_zinli')}
                  </label>
                  <input
                    type="email"
                    value={zinliEmail}
                    onChange={(e) => setZinliEmail(e.target.value)}
                    placeholder="tu-correo@zinli.com"
                    className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-white text-xs outline-none focus:border-[#FBB03B]/50"
                  />
                </div>

                <button
                  onClick={handleSaveWallet}
                  disabled={saving}
                  className="w-full py-3 bg-[#FBB03B] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-lg shadow-[#FBB03B]/20 mt-2"
                >
                  {saving ? tCommon('loading') : t('save_wallet')}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#121826] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl h-full">
              <div className="mb-6">
                <h2 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  {t('history')}
                  <span className="bg-[#00A8FF]/20 text-[#00A8FF] px-2 py-0.5 rounded-full text-[10px]">
                    {orders.length}
                  </span>
                </h2>
                <p className="text-gray-400 text-xs mt-2 tracking-wide">
                  {t('history_sub')}
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-20 border border-gray-800 border-dashed rounded-2xl bg-[#0B0F19]">
                  <span className="text-4xl block mb-4 opacity-50">🛍️</span>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                    {t('no_orders')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {orders.map((order) => {
                    const accent = getOrderAccent(order);
                    
                    return (
                      <div
                        key={order.id}
                        className={`bg-[#0B0F19] border rounded-2xl p-5 ${accent.border} ${accent.glow} transition-all`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[10px] text-[#00A8FF] bg-[#00A8FF]/10 px-2 py-1 rounded border border-[#00A8FF]/20">
                                #{order.id?.toString().substring(0, 8)}
                              </span>

                              <span
                                className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border tracking-[0.18em] ${accent.badge}`}
                              >
                                {accent.label}
                              </span>

                              <span
                                className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border tracking-[0.18em] ${getStatusColor(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </div>

                            <div>
                              <h4 className={`text-lg font-black uppercase tracking-[0.02em] ${accent.title}`}>
                                {order.product_name}
                              </h4>
                              <p className="text-sm text-gray-300 mt-1">{order.variant_name}</p>
                            </div>
                          </div>

                          <div className="md:text-right min-w-[120px] shrink-0">
                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                              {t('date')}
                            </p>
                            <p className="text-xs text-gray-300 font-semibold">
                              {order.created_at
                                ? new Date(order.created_at).toLocaleDateString()
                                : '...'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}