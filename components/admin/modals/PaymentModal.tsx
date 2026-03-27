"use client";

type PaymentForm = {
  name: string;
  details: string;
  currency?: string; // 🟢 NUEVO: Soporte para tipo de moneda
};

type Props = {
  isOpen: boolean;
  paymentForm: PaymentForm;
  setPaymentForm: (value: PaymentForm) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function PaymentModal({
  isOpen,
  paymentForm,
  setPaymentForm,
  onClose,
  onSave,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#121826] border border-green-500/30 rounded-[30px] p-8 w-full max-w-sm shadow-[0_0_50px_rgba(34,197,94,0.1)] relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors"
        >
          ✕
        </button>

        <h3 className="text-green-400 font-black uppercase tracking-widest text-sm mb-6">
          Añadir Método de Pago
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Banco o Billetera (Ej: Banesco, Zinli)"
            value={paymentForm.name}
            onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
            className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-green-500/50"
          />

          {/* 🟢 NUEVO: Selector de Moneda */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1">Moneda de Operación</label>
            <select
              value={paymentForm.currency || 'Bs'}
              onChange={(e) => setPaymentForm({ ...paymentForm, currency: e.target.value })}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-green-500/50 uppercase font-bold"
            >
              <option value="Bs">Bolívares (Bs)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </div>

          <textarea
            placeholder="Datos (Ej: 0412-123 CI: 123 o tu@correo.com)"
            value={paymentForm.details}
            onChange={(e) => setPaymentForm({ ...paymentForm, details: e.target.value })}
            className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-green-500/50 min-h-[100px]"
          />

          <button
            onClick={onSave}
            disabled={!paymentForm.name || !paymentForm.details}
            className="w-full py-4 bg-green-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-green-400 disabled:opacity-50 transition-all shadow-lg shadow-green-500/20 mt-2"
          >
            Guardar Método
          </button>
        </div>
      </div>
    </div>
  );
}