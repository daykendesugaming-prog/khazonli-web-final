"use client";

import { useLocale, useTranslations } from 'next-intl';
import { formatEventType, getEventStatusBadge } from '@/components/tienda/utils/tiendaHelpers';

type Props = {
  selectedEvent: any;
  eventRegisterLoading: boolean;
  eventRegisterSuccess: boolean;
  eventParticipants: any[];
  eventForm: any;
  setEventForm: (value: any) => void;
  handleCloseEvent: () => void;
  handleRegisterEvent: () => void;
};

export default function EventModal({
  selectedEvent,
  eventRegisterLoading,
  eventRegisterSuccess,
  eventParticipants,
  eventForm,
  setEventForm,
  handleCloseEvent,
  handleRegisterEvent,
}: Props) {
  const t = useTranslations('Modals');
  const tTienda = useTranslations('Tienda');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  if (!selectedEvent) return null;

  // Lógica dinámica para contenido desde Supabase
  const displayTitle = selectedEvent[`title_${locale}`] || selectedEvent.title;
  const displayDesc = selectedEvent[`description_${locale}`] || selectedEvent.description;
  const displayRules = selectedEvent[`rules_${locale}`] || selectedEvent.rules;
  const displayGame = selectedEvent[`game_name_${locale}`] || selectedEvent.game_name;
  const displayMode = selectedEvent[`mode_name_${locale}`] || selectedEvent.mode_name;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B0F19]/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#121826] border border-gray-800 rounded-[36px] w-full max-w-4xl relative overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={handleCloseEvent}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors z-20"
        >
          ✕
        </button>

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-[10px] uppercase font-black px-3 py-1.5 rounded-full bg-[#00A8FF]/10 text-[#00A8FF] border border-[#00A8FF]/20 tracking-[0.18em]">
              {formatEventType(selectedEvent.event_type)}
            </span>
            <span
              className={`text-[10px] uppercase font-black px-3 py-1.5 rounded-full border tracking-[0.18em] ${getEventStatusBadge(
                selectedEvent.status
              )}`}
            >
              {selectedEvent.status === 'active'
                ? tTienda('status_active')
                : selectedEvent.status === 'closed'
                ? tTienda('status_closed')
                : tTienda('status_finished')}
            </span>
            {selectedEvent.is_featured && (
              <span className="text-[10px] uppercase font-black px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 tracking-[0.18em]">
                {tTienda('featured')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
                  {displayTitle}
                </h3>

                {selectedEvent.banner_url && (
                  <div className="mb-6 w-full max-h-[300px] rounded-2xl overflow-hidden border border-gray-800/50 shadow-xl">
                    <img
                      src={selectedEvent.banner_url}
                      alt="Banner Evento"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {displayDesc && (
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line mt-4">
                    {displayDesc}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedEvent.start_date && (
                  <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.18em] mb-2">
                      {t('event_start_date')}
                    </p>
                    <p className="text-white font-bold">
                      {new Date(selectedEvent.start_date).toLocaleString(locale)}
                    </p>
                  </div>
                )}

                {selectedEvent.prize && (
                  <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.18em] mb-2">
                      {tTienda('prize')}
                    </p>
                    <p className="text-[#00A8FF] font-black">
                      {selectedEvent.prize}
                    </p>
                  </div>
                )}

                {displayGame && (
                  <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.18em] mb-2">
                      {tTienda('game')}
                    </p>
                    <p className="text-white font-bold">{displayGame}</p>
                  </div>
                )}

                {displayMode && (
                  <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.18em] mb-2">
                      {t('event_mode')}
                    </p>
                    <p className="text-white font-bold">{displayMode}</p>
                  </div>
                )}

                {(selectedEvent.entry_price_usd > 0 || selectedEvent.entry_price_bs > 0) && (
                  <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.18em] mb-2">
                      {t('event_entry')}
                    </p>
                    <div className="space-y-1">
                      {selectedEvent.entry_price_usd > 0 && (
                        <p className="text-green-400 font-black">
                          ${selectedEvent.entry_price_usd} USD
                        </p>
                      )}
                      {selectedEvent.entry_price_bs > 0 && (
                        <p className="text-gray-300 font-bold">
                          Bs. {selectedEvent.entry_price_bs}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedEvent.max_participants && (
                  <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.18em] mb-2">
                      {t('event_max_capacity') || 'Cupos máximos'}
                    </p>
                    <p className="text-white font-bold">
                      {selectedEvent.max_participants}
                    </p>
                  </div>
                )}
              </div>

              {displayRules && (
                <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-6">
                  <h4 className="text-white font-black uppercase tracking-[0.18em] text-sm mb-4">
                    {t('event_rules')}
                  </h4>
                  <div className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">
                    {displayRules}
                  </div>
                </div>
              )}

              <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-6">
                <h4 className="text-[#00A8FF] font-black uppercase tracking-[0.18em] text-sm mb-4">
                  {t('event_participants')} ({eventParticipants.length})
                </h4>

                {eventParticipants.length === 0 ? (
                  <div className="text-center py-6 border border-gray-800/50 rounded-2xl">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                      {tTienda('no_participants')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {eventParticipants.map((p, idx) => (
                      <div
                        key={idx}
                        className="bg-[#121826] border border-gray-800/50 rounded-xl p-3 flex justify-between items-center shadow-inner"
                      >
                        <span
                          className="text-xs text-white font-bold truncate pr-2"
                          title={p.character_name || p.full_name}
                        >
                          {p.character_name || p.full_name}
                        </span>

                        {p.selected_number && (
                          <span className="text-cyan-400 font-black text-[10px] bg-cyan-400/10 px-2 py-1 rounded">
                            #{p.selected_number}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-6 sticky top-6">
                <h4 className="text-white font-black uppercase tracking-[0.18em] text-sm mb-4">
                  {t('event_registration')}
                </h4>

                {selectedEvent.status !== 'active' ? (
                  <div className="text-center py-6">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                      {selectedEvent.status === 'closed'
                        ? tTienda('status_closed')
                        : tTienda('status_finished')}
                    </p>
                  </div>
                ) : selectedEvent.registration_mode === 'login' ? (
                  <div className="text-center py-6">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                      {t('event_login_mode') || 'Registro con cuenta próximamente'}
                    </p>
                  </div>
                ) : eventRegisterSuccess ? (
                  <div className="bg-green-400/10 border border-green-400/20 rounded-2xl p-5 text-center">
                    <p className="text-green-400 font-black uppercase tracking-widest text-xs mb-2">
                      {tCommon('success')}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {t('event_success_msg')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={t('name_placeholder')}
                      value={eventForm.full_name}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, full_name: e.target.value })
                      }
                      className="w-full bg-[#121826] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50"
                    />

                    {(selectedEvent.event_type === 'torneo' ||
                      selectedEvent.event_type === 'especial') && (
                      <input
                        type="text"
                        placeholder={t('char_name_placeholder')}
                        value={eventForm.character_name}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            character_name: e.target.value,
                          })
                        }
                        className="w-full bg-[#121826] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50"
                      />
                    )}

                    <input
                      type="text"
                      placeholder={tTienda('whatsapp_label')}
                      value={eventForm.phone}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, phone: e.target.value })
                      }
                      className="w-full bg-[#121826] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50"
                    />

                    {selectedEvent.requires_number_selection && (
                      <input
                        type="number"
                        placeholder={`${t('select_number')} (${selectedEvent.number_range_min} - ${selectedEvent.number_range_max})`}
                        value={eventForm.selected_number}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            selected_number: e.target.value,
                          })
                        }
                        min={selectedEvent.number_range_min || undefined}
                        max={selectedEvent.number_range_max || undefined}
                        className="w-full bg-[#121826] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50"
                      />
                    )}

                    <textarea
                      placeholder={t('notes_placeholder')}
                      value={eventForm.notes}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, notes: e.target.value })
                      }
                      className="w-full bg-[#121826] border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-[#00A8FF]/50 h-24"
                    />

                    <button
                      onClick={handleRegisterEvent}
                      disabled={eventRegisterLoading}
                      className="w-full py-4 bg-[#00A8FF] text-[#0B0F19] font-black uppercase text-sm tracking-widest rounded-xl hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#00A8FF]/20"
                    >
                      {eventRegisterLoading ? tCommon('loading') : t('enroll')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}