"use client";

type VariantForm = {
  name: string;
  priceText: string;
  priceUsd: string;
};

type Props = {
  isOpen: boolean;
  variantForm: VariantForm;
  setVariantForm: (value: VariantForm) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function VariantModal({
  isOpen,
  variantForm,
  setVariantForm,
  onClose,
  onSave,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#121826] border border-[#00A8FF]/30 rounded-[30px] p-8 w-full max-w-sm shadow-[0_0_50px_rgba(0,168,255,0.1)] relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors"
        >
          ✕
        </button>

        <h3 className="text-[#00A8FF] font-black uppercase tracking-widest text-sm mb-6">
          Añadir Variante
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre Plan (Ej: 1 Pantalla)"
            value={variantForm.name}
            onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
            className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Precio ($4.50)"
              value={variantForm.priceText}
              onChange={(e) => setVariantForm({ ...variantForm, priceText: e.target.value })}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50"
            />

            <input
              type="number"
              step="0.01"
              placeholder="Valor ($)"
              value={variantForm.priceUsd}
              onChange={(e) => setVariantForm({ ...variantForm, priceUsd: e.target.value })}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50"
            />
          </div>

          <button
            onClick={onSave}
            className="w-full py-4 bg-[#00A8FF] text-[#0B0F19] font-black uppercase rounded-xl mt-4 shadow-lg shadow-[#00A8FF]/20 hover:bg-blue-400 active:scale-95 transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}