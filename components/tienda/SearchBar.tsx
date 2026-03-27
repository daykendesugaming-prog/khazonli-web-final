"use client";

type Props = {
  activeCategory: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export default function SearchBar({
  activeCategory,
  searchQuery,
  setSearchQuery,
}: Props) {
  if (activeCategory === 'mmo') return null;

  return (
    <div className="relative max-w-5xl mx-auto">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
        🔍
      </span>
      <input
        type="text"
        placeholder={`Buscar en ${activeCategory.toUpperCase()}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-[#121826] border border-gray-800 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-[#00A8FF]/50 transition-all shadow-2xl"
      />
    </div>
  );
}