"use client";

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image'; // ⭐ NUEVO IMPORT
import { renderIcon } from '@/components/tienda/utils/tiendaHelpers';

type Props = {
  item: any;
  storeStatus: string;
  onSelect: (item: any) => void;
};

export default function ProductCard({ item, storeStatus, onSelect }: Props) {
  const locale = useLocale();
  const t = useTranslations('Tienda');

  // Lógica para descripciones y etiquetas dinámicas desde la DB
  const displayDescription = item[`description_${locale}`] || item.description;
  const displayTag = item[`tag_${locale}`] || item.tag;

  return (
    <div
      key={item.id}
      onClick={() => storeStatus === 'activo' && onSelect(item)}
      className={`bg-[#0B0F19] border border-gray-800 rounded-3xl h-48 flex flex-col items-center justify-center transition-all group relative cursor-pointer p-4 ${
        storeStatus === 'activo'
          ? 'hover:border-[#00A8FF]/50 hover:scale-105 hover:bg-[#121826] hover:shadow-[0_0_25px_rgba(0,168,255,0.1)]'
          : 'opacity-40 grayscale cursor-not-allowed'
      }`}
    >
      {displayDescription && (
        <div
          className="absolute top-3 left-3 z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="group/tooltip relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0B0F19] border border-gray-700 text-gray-400 hover:text-[#00A8FF] hover:border-[#00A8FF]/50 transition-colors cursor-help shadow-lg">
            <span className="text-xs font-black italic">i</span>

            <div className="absolute bottom-full left-0 mb-2 w-64 p-4 bg-[#0B0F19] border border-[#00A8FF]/50 rounded-xl shadow-[0_0_20px_rgba(0,168,255,0.25)] opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 pointer-events-none z-[100]">
              <p className="text-sm text-gray-300 leading-relaxed font-medium normal-case tracking-wide text-left whitespace-pre-wrap">
                {displayDescription}
              </p>
              <div className="absolute top-full left-3 border-[6px] border-transparent border-t-[#00A8FF]/50"></div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 group-hover:scale-110 transition-transform duration-300 flex-1 flex items-center justify-center w-full">
        {item.icon && item.icon.startsWith('http') ? (
          // ⭐ NUEVO: Contenedor con proporción fija para imágenes URL
          <div className="relative w-full h-24 aspect-square overflow-hidden rounded-lg">
            <Image
              src={item.icon}
              alt={item.name || 'Producto'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          // ⭐ EXISTENTE: Iconos emoji/texto
          renderIcon(item.icon)
        )}
      </div>

      {displayTag && (
        <span className="absolute bottom-3 right-3 bg-gray-900/80 text-gray-400 text-[8px] font-black uppercase px-2 py-1 rounded-md border border-gray-800 z-10">
          {displayTag}
        </span>
      )}
    </div>
  );
}