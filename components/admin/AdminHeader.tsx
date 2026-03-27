"use client";

import Link from 'next/link';

type AdminHeaderProps = {
  onLogout: () => void;
};

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121826] p-6 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
        ESTACIÓN DE MANDO <span className="text-[#00A8FF] text-xs ml-2">v3.2</span>
      </h2>

      <div className="flex gap-3 w-full md:w-auto">
        <Link
          href="/admin/tickets"
          className="flex-1 md:flex-none text-center px-4 py-3 md:py-2 bg-[#00A8FF]/10 text-[#00A8FF] border border-[#00A8FF]/30 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00A8FF] hover:text-[#0B0F19] transition-all shadow-[0_0_15px_rgba(0,168,255,0.1)]"
        >
          🎫 Ir a Bóveda de Tickets
        </Link>

        <button
          onClick={onLogout}
          className="px-4 py-3 md:py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold uppercase text-[10px] hover:bg-red-500/20 hover:border-red-500/40 transition-colors"
        >
          Salir
        </button>
      </div>
    </div>
  );
}