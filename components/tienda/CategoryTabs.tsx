"use client";

import Link from 'next/link';

type Props = {
  allCategories: string[];
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  setSearchQuery: (value: string) => void;
};

export default function CategoryTabs({
  allCategories,
  activeCategory,
  setActiveCategory,
  setSearchQuery,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 bg-[#121826]/50 p-2 rounded-2xl border border-gray-800/50 backdrop-blur-md">
      {allCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setActiveCategory(cat);
            setSearchQuery('');
          }}
          className={`px-6 py-2.5 font-black rounded-xl uppercase text-xs tracking-wider transition-all ${
            activeCategory === cat
              ? 'bg-[#00A8FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,168,255,0.4)]'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {cat === 'mmo' ? 'Mercado MMO' : cat}
        </button>
      ))}

      <Link
        href="/"
        className="text-gray-600 hover:text-white text-sm font-bold ml-auto pr-4 uppercase tracking-widest"
      >
        ← Volver
      </Link>
    </div>
  );
}