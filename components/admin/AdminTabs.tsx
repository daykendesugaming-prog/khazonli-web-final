"use client";

type AdminTab = 'dashboard' | 'mmo' | 'catalogo' | 'eventos';

type AdminTabsProps = {
  activeTab: AdminTab;
  onChange: (tab: AdminTab) => void;
};

export default function AdminTabs({ activeTab, onChange }: AdminTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 bg-[#121826] p-2 rounded-2xl border border-gray-800 sticky top-4 z-50 shadow-xl">
      <button
        onClick={() => onChange('dashboard')}
        className={`flex-1 py-3 px-4 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${
          activeTab === 'dashboard'
            ? 'bg-[#00A8FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,168,255,0.4)]'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        ⚙️ General
      </button>

      <button
        onClick={() => onChange('mmo')}
        className={`flex-1 py-3 px-4 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${
          activeTab === 'mmo'
            ? 'bg-[#FBB03B] text-[#0B0F19] shadow-[0_0_15px_rgba(251,176,59,0.4)]'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        ⚔️ Mercado MMO
      </button>

      <button
        onClick={() => onChange('catalogo')}
        className={`flex-1 py-3 px-4 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${
          activeTab === 'catalogo'
            ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        📦 Catálogo
      </button>

      <button
        onClick={() => onChange('eventos')}
        className={`flex-1 py-3 px-4 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${
          activeTab === 'eventos'
            ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        🎉 Eventos
      </button>
    </div>
  );
}