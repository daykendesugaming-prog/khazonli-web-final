"use client";

type ConfirmModalProps = {
  isOpen: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  isOpen,
  message,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#121826] border border-red-500/50 rounded-3xl p-8 w-full max-w-sm shadow-[0_0_80px_rgba(239,68,68,0.2)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>

        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <span className="text-red-500 text-2xl">⚠️</span>
        </div>

        <h3 className="text-white font-black uppercase text-lg mb-2 tracking-widest">
          Advertencia
        </h3>

        <p className="text-gray-400 text-sm font-medium mb-8">{message}</p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-[#0B0F19] text-gray-400 font-bold uppercase rounded-xl border border-gray-800 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-red-500 text-white font-black uppercase rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}