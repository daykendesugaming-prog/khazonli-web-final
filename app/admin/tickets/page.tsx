"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function TicketsAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'digital_orders' },
        (payload) => {
          setOrders((current) => [payload.new, ...current]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'digital_orders' },
        (payload) => {
          setOrders((current) =>
            current.map((order) => (order.id === payload.new.id ? payload.new : order))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('digital_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando órdenes:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (id: string | number, newStatus: string) => {
    setOrders((current) => current.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));

    const { error } = await supabase
      .from('digital_orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar el estado. Revisa la conexión.');
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === 'todos' || o.status === filter;
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      o.id.toString().includes(searchLower) ||
      (o.customer_phone || '').toLowerCase().includes(searchLower) ||
      (o.product_name || '').toLowerCase().includes(searchLower) ||
      (o.payment_method || '').toLowerCase().includes(searchLower) ||
      (o.payment_details || '').toLowerCase().includes(searchLower) ||
      (o.variant_name || '').toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
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

  const isWalletOrder = (order: any) => {
    const product = String(order?.product_name || '').toLowerCase();
    const variant = String(order?.variant_name || '').toLowerCase();
    return product.includes('wallet') || product.includes('recarga') || variant.includes('recarga');
  };

  const getOrderTypeMeta = (order: any) => {
    const product = String(order?.product_name || '').toLowerCase();

    if (isP2POrder(order)) {
      return {
        label: 'P2P',
        badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
        title: 'text-purple-300',
      };
    }

    if (isWalletOrder(order)) {
      return {
        label: 'Wallet',
        badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        title: 'text-cyan-300',
      };
    }

    if (product.includes('venta mk')) {
      return {
        label: 'Venta',
        badge: 'bg-[#00A8FF]/10 text-[#00A8FF] border-[#00A8FF]/30',
        title: 'text-[#00A8FF]',
      };
    }

    if (product.includes('compra mk')) {
      return {
        label: 'Compra',
        badge: 'bg-[#FBB03B]/10 text-[#FBB03B] border-[#FBB03B]/30',
        title: 'text-[#FBB03B]',
      };
    }

    if (product.includes('intercambio')) {
      return {
        label: 'Intercambio',
        badge: 'bg-green-400/10 text-green-400 border-green-400/30',
        title: 'text-green-400',
      };
    }

    return {
      label: 'Orden',
      badge: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
      title: 'text-white',
    };
  };

  const formatTransactionAmount = (order: any) => {
    const hasPriceText = order?.price_text !== null && order?.price_text !== undefined && String(order.price_text).trim() !== '';
    const hasPriceBs = Number(order?.price_bs) > 0;

    if (!hasPriceText && !hasPriceBs) return null;

    return (
      <div className="space-y-1">
        {hasPriceText && (
          <p className="text-xs font-black text-green-400 break-words">
            {String(order.price_text).startsWith('$') ? order.price_text : `$${order.price_text}`}
          </p>
        )}
        {hasPriceBs && (
          <p className="text-[10px] font-bold text-gray-400">
            {Number(order.price_bs).toFixed(2)} Bs
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#00A8FF]">Gestor:</span> Tickets
            </h1>
            <p className="text-gray-400 mt-2 text-sm tracking-wide">
              Gestión centralizada de órdenes, recargas e historial de clientes.
            </p>
          </div>

          <Link
            href="/admin"
            className="px-6 py-3 bg-[#121826] border border-gray-800 hover:border-[#00A8FF]/50 rounded-xl font-bold uppercase text-xs transition-all shadow-lg"
          >
            ← Volver al Admin Principal
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#121826] p-4 rounded-2xl border border-gray-800 items-center">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['todos', 'pendiente', 'completado', 'cancelado'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 font-black uppercase text-[10px] md:text-xs rounded-xl transition-all ${
                  filter === f
                    ? 'bg-[#00A8FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,168,255,0.4)]'
                    : 'bg-[#0B0F19] text-gray-400 border border-gray-800 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full md:flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Buscar por WhatsApp, ID, Servicio, variante o referencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-[#00A8FF]/50 transition-colors"
            />
          </div>

          <button
            onClick={fetchOrders}
            className="px-4 py-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase shrink-0"
          >
            🔄 Recargar
          </button>
        </div>

        <div className="bg-[#121826] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B0F19] text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                  <th className="p-5 font-black">ID Ticket</th>
                  <th className="p-5 font-black">Cliente / Contacto</th>
                  <th className="p-5 font-black">Servicio / Detalles</th>
                  <th className="p-5 font-black">Transacción</th>
                  <th className="p-5 font-black">Estado</th>
                  <th className="p-5 font-black text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-gray-500 uppercase tracking-widest font-bold text-xs"
                    >
                      Cargando datos de tickets...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-gray-500 uppercase tracking-widest font-bold text-xs"
                    >
                      No hay tickets con esos criterios.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const meta = getOrderTypeMeta(order);

                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors align-top">
                        <td className="p-5">
                          <span className="font-mono text-xs text-gray-400 bg-[#0B0F19] px-2 py-1 rounded border border-gray-800">
                            #{order.id.toString().substring(0, 8)}
                          </span>
                          <p className="text-[9px] text-gray-600 mt-2 font-mono">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </td>

                        <td className="p-5">
                          {order.customer_phone ? (
                            <div>
                              <p className="font-black text-white text-sm tracking-wide mb-2 break-words">
                                {order.customer_phone}
                              </p>
                              <a
                                href={`https://wa.me/${String(order?.customer_phone || '').replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-[#25D366]/10 text-[#25D366] px-2 py-1 rounded border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black transition-colors"
                              >
                                💬 WhatsApp
                              </a>
                            </div>
                          ) : (
                            <span className="text-gray-600 text-xs italic">Invitado (Sin número)</span>
                          )}
                        </td>

                        <td className="p-5">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border tracking-[0.18em] ${meta.badge}`}
                            >
                              {meta.label}
                            </span>
                          </div>

                          <p className={`font-black text-sm uppercase ${meta.title}`}>
                            {order.product_name}
                          </p>

                          <p className="text-xs text-gray-300 font-medium mt-1 leading-relaxed">
                            {order.variant_name}
                          </p>

                          {isP2POrder(order) && (
                            <div className="mt-3 inline-block rounded-xl border border-purple-500/20 bg-purple-500/5 px-3 py-2">
                              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-purple-300">
                                Oferta negociable
                              </p>
                            </div>
                          )}
                        </td>

                        <td className="p-5">
                          <div className="space-y-3">
                            <div>
                              <p className="font-bold text-white text-xs uppercase mb-1">
                                {order.payment_method || 'Sin método'}
                              </p>
                              {formatTransactionAmount(order)}
                            </div>

                            {order.payment_details && (
                              <div className="bg-[#0B0F19] p-2 rounded-lg border border-gray-800">
                                <p className="text-[9px] text-gray-500 uppercase font-black mb-1 tracking-widest">
                                  Referencia / Detalles
                                </p>
                                <p className="text-[10px] text-gray-300 font-mono leading-relaxed break-words">
                                  {order.payment_details}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-5">
                          <span
                            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="p-5 text-right space-x-2 whitespace-nowrap">
                          {order.status !== 'completado' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completado')}
                              className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20"
                              title="Marcar como Completado"
                            >
                              ✓
                            </button>
                          )}

                          {order.status !== 'cancelado' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelado')}
                              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                              title="Cancelar Orden"
                            >
                              ✕
                            </button>
                          )}

                          {order.status !== 'pendiente' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'pendiente')}
                              className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-black rounded-lg transition-colors border border-yellow-500/20"
                              title="Marcar como Pendiente"
                            >
                              ⟳
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}