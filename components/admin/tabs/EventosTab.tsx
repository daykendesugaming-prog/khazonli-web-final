type EventItem = {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  status: string;
  description?: string | null;
  rules?: string | null;
  banner_url?: string | null;
  game_name?: string | null;
  mode_name?: string | null;
  prize?: string | null;
  entry_price_usd?: number | null;
  entry_price_bs?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  max_participants?: number | null;
  registration_mode?: string;
  phone_required?: boolean;
  requires_number_selection?: boolean;
  number_range_min?: number | null;
  number_range_max?: number | null;
  is_featured?: boolean;
};

type NewEvent = {
  title: string;
  slug: string;
  event_type: string;
  status: string;
  description: string;
  rules: string;
  banner_url: string;
  game_name: string;
  mode_name: string;
  prize: string;
  entry_price_usd: string;
  entry_price_bs: string;
  start_date: string;
  end_date: string;
  max_participants: string;
  registration_mode: string;
  phone_required: boolean;
  requires_number_selection: boolean;
  number_range_min: string;
  number_range_max: string;
  is_featured: boolean;
};

type Props = {
  events: EventItem[];
  newEvent: NewEvent;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  handleEventFieldChange: (field: string, value: any) => void;
  handleCreateEvent: () => void;
  handleUpdateEventStatus: (eventId: string, status: string) => void;
  openParticipantsModal: (event: any) => void;
  handleToggleFeatured: (event: any) => void;
  handleDeleteEvent: (eventId: string, title: string) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  supabase: any;
};

export default function EventosTab({
  events,
  newEvent,
  uploading,
  setUploading,
  handleEventFieldChange,
  handleCreateEvent,
  handleUpdateEventStatus,
  openParticipantsModal,
  handleToggleFeatured,
  handleDeleteEvent,
  showToast,
  supabase,
}: Props) {
  return (
    <div className="bg-[#121826] border border-cyan-500/20 rounded-3xl p-6 animate-fade-in">
      <h2 className="text-xs font-black text-cyan-400 uppercase mb-6 tracking-widest">
        🎉 EVENTOS, SORTEOS Y TORNEOS
      </h2>

      <div className="bg-[#0B0F19] p-6 rounded-2xl border border-gray-800 mb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nombre del evento"
            value={newEvent.title}
            onChange={(e) => handleEventFieldChange('title', e.target.value)}
            className="md:col-span-2 bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
          />
          <input
            type="text"
            placeholder="slug-auto"
            value={newEvent.slug}
            onChange={(e) => handleEventFieldChange('slug', e.target.value)}
            className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
          />
          <select
            value={newEvent.event_type}
            onChange={(e) => handleEventFieldChange('event_type', e.target.value)}
            className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
          >
            <option value="sorteo">Sorteo</option>
            <option value="torneo">Torneo</option>
            <option value="especial">Especial</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newEvent.status}
            onChange={(e) => handleEventFieldChange('status', e.target.value)}
            className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
          >
            <option value="draft">Borrador</option>
            <option value="active">Activo</option>
            <option value="closed">Cerrado</option>
            <option value="finished">Finalizado</option>
          </select>

          <select
            value={newEvent.registration_mode}
            onChange={(e) => handleEventFieldChange('registration_mode', e.target.value)}
            className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
          >
            <option value="form">Formulario</option>
            <option value="login">Solo Login</option>
            <option value="both">Ambos</option>
          </select>

          <input
            type="datetime-local"
            value={newEvent.start_date}
            onChange={(e) => handleEventFieldChange('start_date', e.target.value)}
            className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
          />

          <input
            type="datetime-local"
            value={newEvent.end_date}
            onChange={(e) => handleEventFieldChange('end_date', e.target.value)}
            className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Premio"
            value={newEvent.prize}
            onChange={(e) => handleEventFieldChange('prize', e.target.value)}
            className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
          />

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Banner URL (Sube imagen o pega link)"
              value={newEvent.banner_url}
              onChange={(e) => handleEventFieldChange('banner_url', e.target.value)}
              className="w-full bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
            />

            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl transition-colors shrink-0 flex items-center justify-center min-w-[100px] text-xs font-black uppercase">
              {uploading ? '⏳ Subiendo...' : '🖼️ Subir'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  try {
                    setUploading(true);
                    if (!e.target.files || e.target.files.length === 0) return;

                    const file = e.target.files[0];
                    const fileName = `banner_${Math.random()}.${file.name.split('.').pop()}`;

                    const { error: uploadError } = await supabase.storage
                      .from('productos')
                      .upload(fileName, file);

                    if (uploadError) {
                      showToast('error', 'No se pudo subir el banner', uploadError.message);
                      return;
                    }

                    const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
                    handleEventFieldChange('banner_url', data.publicUrl);
                    showToast('success', 'Banner subido', 'La imagen del evento quedó cargada correctamente.');
                  } finally {
                    setUploading(false);
                  }
                }}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {newEvent.event_type === 'torneo' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Juego"
              value={newEvent.game_name}
              onChange={(e) => handleEventFieldChange('game_name', e.target.value)}
              className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-[#FBB03B]/50"
            />
            <input
              type="text"
              placeholder="Modalidad"
              value={newEvent.mode_name}
              onChange={(e) => handleEventFieldChange('mode_name', e.target.value)}
              className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-[#FBB03B]/50"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Inscripción USD"
              value={newEvent.entry_price_usd}
              onChange={(e) => handleEventFieldChange('entry_price_usd', e.target.value)}
              className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-[#FBB03B]/50"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Inscripción Bs"
              value={newEvent.entry_price_bs}
              onChange={(e) => handleEventFieldChange('entry_price_bs', e.target.value)}
              className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-[#FBB03B]/50"
            />
            <input
              type="number"
              placeholder="Cupos máx."
              value={newEvent.max_participants}
              onChange={(e) => handleEventFieldChange('max_participants', e.target.value)}
              className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-[#FBB03B]/50"
            />
          </div>
        )}

        {newEvent.event_type === 'sorteo' && (
          <div className="bg-[#121826] border border-cyan-500/20 rounded-2xl p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <label className="flex items-center gap-3 text-sm text-white font-bold">
                <input
                  type="checkbox"
                  checked={newEvent.phone_required}
                  onChange={(e) => handleEventFieldChange('phone_required', e.target.checked)}
                  className="accent-cyan-400"
                />
                Teléfono obligatorio
              </label>

              <label className="flex items-center gap-3 text-sm text-white font-bold">
                <input
                  type="checkbox"
                  checked={newEvent.requires_number_selection}
                  onChange={(e) =>
                    handleEventFieldChange('requires_number_selection', e.target.checked)
                  }
                  className="accent-cyan-400"
                />
                Requiere selección de número
              </label>

              <label className="flex items-center gap-3 text-sm text-white font-bold">
                <input
                  type="checkbox"
                  checked={newEvent.is_featured}
                  onChange={(e) => handleEventFieldChange('is_featured', e.target.checked)}
                  className="accent-cyan-400"
                />
                Destacar evento
              </label>
            </div>

            {newEvent.requires_number_selection && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Número mínimo"
                  value={newEvent.number_range_min}
                  onChange={(e) => handleEventFieldChange('number_range_min', e.target.value)}
                  className="bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
                />
                <input
                  type="number"
                  placeholder="Número máximo"
                  value={newEvent.number_range_max}
                  onChange={(e) => handleEventFieldChange('number_range_max', e.target.value)}
                  className="bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-cyan-500/50"
                />
              </div>
            )}
          </div>
        )}

        {newEvent.event_type !== 'sorteo' && (
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center gap-3 text-sm text-white font-bold">
              <input
                type="checkbox"
                checked={newEvent.phone_required}
                onChange={(e) => handleEventFieldChange('phone_required', e.target.checked)}
                className="accent-cyan-400"
              />
              Teléfono obligatorio
            </label>

            <label className="flex items-center gap-3 text-sm text-white font-bold">
              <input
                type="checkbox"
                checked={newEvent.is_featured}
                onChange={(e) => handleEventFieldChange('is_featured', e.target.checked)}
                className="accent-cyan-400"
              />
              Destacar evento
            </label>
          </div>
        )}

        <textarea
          placeholder="Descripción del evento"
          value={newEvent.description}
          onChange={(e) => handleEventFieldChange('description', e.target.value)}
          className="w-full bg-[#121826] border border-gray-800 rounded-xl p-4 text-sm outline-none focus:border-cyan-500/50 h-28"
        />

        <textarea
          placeholder="Reglas del evento"
          value={newEvent.rules}
          onChange={(e) => handleEventFieldChange('rules', e.target.value)}
          className="w-full bg-[#121826] border border-gray-800 rounded-xl p-4 text-sm outline-none focus:border-cyan-500/50 h-32"
        />

        <div className="flex justify-end">
          <button
            onClick={handleCreateEvent}
            className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-black uppercase text-xs shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 active:scale-95 transition-all"
          >
            Crear Evento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-bold uppercase tracking-widest border border-gray-800 rounded-2xl bg-[#0B0F19]/50">
            No hay eventos creados todavía.
          </div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2 w-full md:w-auto flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-white text-lg font-black uppercase">{ev.title}</h3>
                    <span className="text-[9px] uppercase font-black px-2 py-1 rounded bg-cyan-500/10 text-cyan-400">
                      {ev.event_type}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-black px-2 py-1 rounded ${
                        ev.status === 'active'
                          ? 'bg-green-500/10 text-green-400'
                          : ev.status === 'closed'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : ev.status === 'finished'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}
                    >
                      {ev.status}
                    </span>
                    {ev.is_featured && (
                      <span className="text-[9px] uppercase font-black px-2 py-1 rounded bg-purple-500/10 text-purple-400">
                        destacado
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    /{ev.slug}
                  </p>

                  {ev.game_name && (
                    <p className="text-sm text-gray-300">
                      <span className="text-[#FBB03B] font-black uppercase mr-2">Juego:</span>
                      {ev.game_name}
                    </p>
                  )}

                  {ev.mode_name && (
                    <p className="text-sm text-gray-300">
                      <span className="text-[#FBB03B] font-black uppercase mr-2">Modalidad:</span>
                      {ev.mode_name}
                    </p>
                  )}

                  {ev.prize && (
                    <p className="text-sm text-gray-300">
                      <span className="text-cyan-400 font-black uppercase mr-2">Premio:</span>
                      {ev.prize}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-1">
                    {ev.start_date && <span>Inicio: {new Date(ev.start_date).toLocaleString()}</span>}
                    {!!ev.entry_price_usd && ev.entry_price_usd > 0 && (
                      <span>USD: ${ev.entry_price_usd}</span>
                    )}
                    {!!ev.entry_price_bs && ev.entry_price_bs > 0 && (
                      <span>Bs: {ev.entry_price_bs}</span>
                    )}
                    {ev.max_participants && <span>Cupos: {ev.max_participants}</span>}
                  </div>

                  {ev.requires_number_selection && (
                    <p className="text-xs text-cyan-400 font-bold uppercase">
                      Sorteo numérico: {ev.number_range_min} al {ev.number_range_max}
                    </p>
                  )}

                  {ev.banner_url && (
                    <div className="mt-3 w-full max-w-sm h-24 rounded-xl overflow-hidden border border-gray-800/50 relative">
                      <img
                        src={ev.banner_url}
                        alt="Banner"
                        className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:min-w-[180px]">
                  <select
                    value={ev.status}
                    onChange={(e) => handleUpdateEventStatus(ev.id, e.target.value)}
                    className="bg-[#121826] border border-gray-800 rounded-xl p-3 text-xs text-white font-bold uppercase outline-none focus:border-cyan-500/50"
                  >
                    <option value="draft">Borrador</option>
                    <option value="active">Activo</option>
                    <option value="closed">Cerrado</option>
                    <option value="finished">Finalizado</option>
                  </select>

                  <button
                    onClick={() => openParticipantsModal(ev)}
                    className="py-3 rounded-xl font-black uppercase text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white transition-all"
                  >
                    👁️ Ver Participantes
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(ev)}
                    className={`py-3 rounded-xl font-black uppercase text-[10px] transition-all ${
                      ev.is_featured
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'
                    }`}
                  >
                    {ev.is_featured ? 'Quitar Destacado' : 'Destacar Evento'}
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(ev.id, ev.title)}
                    className="py-3 rounded-xl font-black uppercase text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Eliminar Evento
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}