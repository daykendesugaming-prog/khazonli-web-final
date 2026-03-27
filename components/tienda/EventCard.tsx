"use client";

import { formatEventType, getEventStatusBadge } from './utils/tiendaHelpers';

export default function EventCard({
  ev,
  onOpen,
}: {
  ev: any;
  onOpen: (ev: any) => void;
}) {
  return (
    <button
      key={ev.id}
      onClick={() => onOpen(ev)}
      className="text-left bg-[#121826] border border-gray-800 hover:border-[#00A8FF]/40 rounded-[28px] overflow-hidden transition-all duration-300 shadow-lg hover:shadow-[0_0_28px_rgba(0,168,255,0.12)] group flex flex-col"
    >
      {ev.banner_url && (
        <div className="w-full h-32 md:h-40 relative border-b border-gray-800/50 overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
          <img
            src={ev.banner_url}
            alt="Banner"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-6 relative z-10 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-[9px] uppercase font-black px-2.5 py-1 rounded-full bg-[#00A8FF]/10 text-[#00A8FF] border border-[#00A8FF]/20 tracking-[0.18em]">
              {formatEventType(ev.event_type)}
            </span>
            <span
              className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-full border tracking-[0.18em] ${getEventStatusBadge(
                ev.status
              )}`}
            >
              {ev.status === 'active'
                ? 'Activo'
                : ev.status === 'closed'
                ? 'Cerrado'
                : 'Finalizado'}
            </span>
          </div>

          {ev.is_featured && (
            <span className="text-[9px] uppercase font-black px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 tracking-[0.18em]">
              Destacado
            </span>
          )}
        </div>

        <h3 className="text-xl font-black text-gray-100 uppercase tracking-[0.015em] leading-tight mb-3 flex-1">
          {ev.title}
        </h3>

        <div className="space-y-2 mb-5">
          {ev.game_name && (
            <p className="text-sm text-gray-300">
              <span className="text-[#FBB03B] font-black uppercase mr-2">
                Juego:
              </span>
              {ev.game_name}
            </p>
          )}
          {ev.prize && (
            <p className="text-sm text-gray-300">
              <span className="text-[#00A8FF] font-black uppercase mr-2">
                Premio:
              </span>
              {ev.prize}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-800 flex items-center justify-between mt-auto">
          <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-gray-500">
            Ver detalle
          </div>
          <div className="text-[#00A8FF] font-black text-sm tracking-[0.18em]">
            →
          </div>
        </div>
      </div>
    </button>
  );
}