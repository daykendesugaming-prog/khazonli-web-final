"use client";

type Props = {
  isOpen: boolean;
  registrations: any[];
  selectedEventForParticipants: any;
  onClose: () => void;
  onCopyList: () => void;
};

export default function EventParticipantsModal({
  isOpen,
  registrations,
  selectedEventForParticipants,
  onClose,
  onCopyList,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#121826] border border-cyan-500/30 rounded-[30px] p-8 w-full max-w-3xl shadow-[0_0_50px_rgba(34,211,238,0.1)] relative max-h-[80vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors text-xl"
        >
          ✕
        </button>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-cyan-400 font-black uppercase tracking-widest text-sm mb-1">
              Lista de Participantes ({registrations.length})
            </h3>
            <p className="text-white text-xl font-black uppercase">
              {selectedEventForParticipants?.title}
            </p>
          </div>

          <button
            onClick={onCopyList}
            className="bg-gray-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-700 transition-colors"
          >
            📋 Copiar Lista
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {registrations.length === 0 ? (
            <div className="text-center py-10 border border-gray-800 rounded-2xl bg-[#0B0F19]">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                Nadie se ha registrado aún.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-white">
              <thead className="text-gray-500 uppercase tracking-widest font-black border-b border-gray-800">
                <tr>
                  <th className="pb-4 pl-2">#</th>
                  <th className="pb-4">Personaje / Nombre</th>
                  <th className="pb-4 text-center">Nº Elegido</th>
                  <th className="pb-4 text-right pr-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, index) => (
                  <tr key={reg.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                    <td className="py-4 pl-2 text-gray-500 font-black">{index + 1}</td>
                    <td className="py-4 font-bold">
                      {reg.character_name || reg.full_name || 'Sin Nombre'}
                    </td>
                    <td className="py-4 text-center text-cyan-400 font-black text-sm">
                      {reg.selected_number || '-'}
                    </td>
                    <td className="py-4 text-right pr-2">
                      {reg.phone ? (
                        <button
                          onClick={() => window.open(`https://wa.me/${reg.phone.replace(/\D/g, '')}`, '_blank')}
                          className="bg-[#25D366]/10 text-[#25D366] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-[#25D366] hover:text-black transition-all"
                        >
                          💬 WhatsApp
                        </button>
                      ) : (
                        <span className="text-gray-600 text-[10px] uppercase font-bold">
                          Sin Teléfono
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}