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

type PaymentMethod = {
  id: number;
  name: string;
  details: string;
};

type Rates = {
  id: number | null;
  buy: number;
  sell: number;
};

type Props = {
  metrics: Metrics;
  storeStatus: string;
  rates: Rates;
  setRates: React.Dispatch<React.SetStateAction<Rates>>;
  payments: PaymentMethod[];
  onUpdateStatus: (status: string) => void;
  onSaveRates: () => void;
  onOpenPaymentModal: () => void;
  onDeletePayment: (id: number) => void;
};

import DashboardMetricsCards from '../dashboard/DashboardMetricsCards';

export default function DashboardTab({
  metrics,
  storeStatus,
  rates,
  setRates,
  payments,
  onUpdateStatus,
  onSaveRates,
  onOpenPaymentModal,
  onDeletePayment,
}: Props) {
  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardMetricsCards metrics={metrics} />

      <div className="bg-[#121826] border border-gray-800 rounded-3xl p-6">
        <h2 className="text-xs font-black text-white uppercase mb-4 tracking-widest">
          🚦 Disponibilidad del Sistema
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => onUpdateStatus('activo')}
            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${
              storeStatus === 'activo'
                ? 'bg-[#25D366] text-black shadow-[0_0_20px_rgba(37,211,102,0.4)]'
                : 'bg-[#0B0F19] text-gray-500 border border-gray-800 hover:border-[#25D366]/50'
            }`}
          >
            Online
          </button>

          <button
            onClick={() => onUpdateStatus('pausa')}
            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${
              storeStatus === 'pausa'
                ? 'bg-[#FBB03B] text-black shadow-[0_0_20px_rgba(251,176,59,0.4)]'
                : 'bg-[#0B0F19] text-gray-500 border border-gray-800 hover:border-[#FBB03B]/50'
            }`}
          >
            Pausa
          </button>

          <button
            onClick={() => onUpdateStatus('mantenimiento')}
            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs transition-all ${
              storeStatus === 'mantenimiento'
                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'bg-[#0B0F19] text-gray-500 border border-gray-800 hover:border-red-500/50'
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      <div className="bg-[#121826] border border-[#00A8FF]/20 rounded-3xl p-6">
        <h2 className="text-xs font-black text-white uppercase mb-6 tracking-widest text-center">
          💰 CONFIGURACIÓN DE DIVISAS
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-gray-500 text-[9px] font-bold uppercase block ml-2">
              Tasa Compra (Cálculos Bs)
            </label>
            <input
              type="number"
              step="0.01"
              value={rates.buy}
              onChange={(e) =>
                setRates((prev) => ({
                  ...prev,
                  buy: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white font-black text-xl text-center outline-none focus:border-[#00A8FF]/50 transition-colors"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-gray-500 text-[9px] font-bold uppercase block ml-2">
              Tasa Venta (Referencial)
            </label>
            <input
              type="number"
              step="0.01"
              value={rates.sell}
              onChange={(e) =>
                setRates((prev) => ({
                  ...prev,
                  sell: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white font-black text-xl text-center outline-none focus:border-[#00A8FF]/50 transition-colors"
            />
          </div>

          <button
            onClick={onSaveRates}
            className="bg-[#00A8FF] text-[#0B0F19] px-8 rounded-xl font-black uppercase text-xs shadow-lg shadow-[#00A8FF]/20 hover:bg-blue-400 hover:shadow-[#00A8FF]/40 active:scale-95 transition-all flex items-center justify-center"
          >
            Guardar Tasas
          </button>
        </div>
      </div>

      <div className="bg-[#121826] border border-green-500/20 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-black text-green-400 uppercase tracking-widest">
            💳 Métodos de Pago
          </h2>
          <button
            onClick={onOpenPaymentModal}
            className="bg-green-500 text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-green-500/20 hover:bg-green-400 active:scale-95 transition-all"
          >
            + Añadir
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payments.map((p) => (
            <div
              key={p.id}
              className="bg-[#0B0F19] border border-gray-800 p-4 rounded-2xl flex justify-between items-center"
            >
              <div>
                <p className="font-black text-white text-xs uppercase">{p.name}</p>
                <p className="text-[9px] text-gray-500">{p.details}</p>
              </div>

              <button
                onClick={() => onDeletePayment(p.id)}
                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}