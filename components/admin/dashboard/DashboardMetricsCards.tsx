"use client";

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

type Props = {
  metrics: Metrics;
};

export default function DashboardMetricsCards({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <div className="bg-[#121826] border border-[#00A8FF]/20 rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Tickets</p>
        <p className="text-3xl font-black text-white mt-2">{metrics.total}</p>
      </div>

      <div className="bg-[#121826] border border-yellow-500/20 rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pendientes</p>
        <p className="text-3xl font-black text-yellow-400 mt-2">{metrics.pending}</p>
      </div>

      <div className="bg-[#121826] border border-green-500/20 rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Completados</p>
        <p className="text-3xl font-black text-green-400 mt-2">{metrics.completed}</p>
      </div>

      <div className="bg-[#121826] border border-red-500/20 rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cancelados</p>
        <p className="text-3xl font-black text-red-400 mt-2">{metrics.cancelled}</p>
      </div>

      <div className="bg-[#121826] border border-[#FBB03B]/20 rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Compras MK</p>
        <p className="text-3xl font-black text-[#FBB03B] mt-2">{metrics.buyMk}</p>
      </div>

      <div className="bg-[#121826] border border-[#00A8FF]/20 rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ventas MK</p>
        <p className="text-3xl font-black text-[#00A8FF] mt-2">{metrics.sellMk}</p>
      </div>

      <div className="bg-[#121826] border border-green-500/20 rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Intercambios</p>
        <p className="text-3xl font-black text-green-400 mt-2">{metrics.exchanges}</p>
      </div>

      <div className="bg-[#121826] border border-purple-500/20 rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ofertas P2P</p>
        <p className="text-3xl font-black text-purple-400 mt-2">{metrics.p2p}</p>
      </div>

      <div className="bg-[#121826] border border-cyan-500/20 rounded-2xl p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Wallet / Recargas</p>
        <p className="text-3xl font-black text-cyan-300 mt-2">{metrics.wallet}</p>
      </div>

      <div className="bg-[#121826] border border-gray-700 rounded-2xl p-5 md:col-span-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Volumen estimado Bs</p>
        <p className="text-3xl font-black text-white mt-2">{metrics.volumeBs.toFixed(2)} Bs</p>
      </div>

      <div className="bg-[#121826] border border-gray-700 rounded-2xl p-5 md:col-span-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Volumen estimado USD / USDT</p>
        <p className="text-3xl font-black text-white mt-2">${metrics.volumeUsd.toFixed(2)}</p>
      </div>
    </div>
  );
}