"use client";

import { supabase } from '@/lib/supabase';
import { translateText } from '@/lib/translate';
import { NewEventState, ShowToast } from './types';

type UseAdminEventActionsParams = {
  showToast: ShowToast;
  newEvent: NewEventState;
  setNewEvent: React.Dispatch<React.SetStateAction<NewEventState>>;
  loadEvents: () => Promise<void>;
  setRegistrations: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedEventForParticipants: React.Dispatch<React.SetStateAction<any>>;
  setIsParticipantsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useAdminEventActions({
  showToast,
  newEvent,
  setNewEvent,
  loadEvents,
  setRegistrations,
  setSelectedEventForParticipants,
  setIsParticipantsModalOpen,
}: UseAdminEventActionsParams) {
  
  const resetEventForm = () => {
    setNewEvent({
      title: '',
      slug: '',
      event_type: 'sorteo',
      status: 'draft',
      description: '',
      rules: '',
      banner_url: '',
      game_name: '',
      mode_name: '',
      prize: '',
      entry_price_usd: '',
      entry_price_bs: '',
      start_date: '',
      end_date: '',
      max_participants: '',
      registration_mode: 'form',
      phone_required: false,
      requires_number_selection: false,
      number_range_min: '',
      number_range_max: '',
      is_featured: false,
    });
  };

  const handleCreateEvent = async () => {
    // 1. VALIDACIONES ORIGINALES
    if (!newEvent.title.trim()) {
      showToast('info', 'Falta el nombre del evento', 'Debes indicar un título para el evento.');
      return;
    }
    if (!newEvent.slug.trim()) {
      showToast('info', 'Falta el slug', 'Debes indicar o generar el slug del evento.');
      return;
    }
    if (newEvent.event_type === 'torneo' && !newEvent.game_name.trim()) {
      showToast('info', 'Falta el juego del torneo', 'Debes indicar a qué juego pertenece el torneo.');
      return;
    }
    if (newEvent.event_type === 'sorteo' && newEvent.requires_number_selection && (!newEvent.number_range_min || !newEvent.number_range_max)) {
      showToast('info', 'Falta el rango numérico', 'Debes definir el número mínimo y máximo del sorteo.');
      return;
    }

    showToast('info', 'IA Traduciendo...', 'Generando versiones internacionales del evento.');

    try {
      // 2. TRADUCCIÓN DINÁMICA CON IA
      const [tEn, tFr, tPt] = await Promise.all([
        translateText(newEvent.title, 'en'),
        translateText(newEvent.title, 'fr'),
        translateText(newEvent.title, 'pt'),
      ]);

      const [dEn, dFr, dPt] = await Promise.all([
        translateText(newEvent.description || '', 'en'),
        translateText(newEvent.description || '', 'fr'),
        translateText(newEvent.description || '', 'pt'),
      ]);

      const [rEn, rFr, rPt] = await Promise.all([
        translateText(newEvent.rules || '', 'en'),
        translateText(newEvent.rules || '', 'fr'),
        translateText(newEvent.rules || '', 'pt'),
      ]);

      const [gEn, gFr, gPt] = await Promise.all([
        translateText(newEvent.game_name || '', 'en'),
        translateText(newEvent.game_name || '', 'fr'),
        translateText(newEvent.game_name || '', 'pt'),
      ]);

      const [pEn, pFr, pPt] = await Promise.all([
        translateText(newEvent.prize || '', 'en'),
        translateText(newEvent.prize || '', 'fr'),
        translateText(newEvent.prize || '', 'pt'),
      ]);

      // 3. PAYLOAD COMBINADO (Original + Traducciones)
      const payload = {
        title: newEvent.title.trim(),
        title_en: tEn, title_fr: tFr, title_pt: tPt,
        slug: newEvent.slug.trim(),
        event_type: newEvent.event_type,
        status: newEvent.status,
        description: newEvent.description || null,
        description_en: dEn, description_fr: dFr, description_pt: dPt,
        rules: newEvent.rules || null,
        rules_en: rEn, rules_fr: rFr, rules_pt: rPt,
        banner_url: newEvent.banner_url || null,
        game_name: newEvent.game_name || null,
        game_name_en: gEn, game_name_fr: gFr, game_name_pt: gPt,
        mode_name: newEvent.mode_name || null,
        prize: newEvent.prize || null,
        prize_en: pEn, prize_fr: pFr, prize_pt: pPt,
        entry_price_usd: newEvent.entry_price_usd ? parseFloat(newEvent.entry_price_usd) : 0,
        entry_price_bs: newEvent.entry_price_bs ? parseFloat(newEvent.entry_price_bs) : 0,
        start_date: newEvent.start_date || null,
        end_date: newEvent.end_date || null,
        max_participants: newEvent.max_participants ? parseInt(newEvent.max_participants) : null,
        registration_mode: newEvent.registration_mode,
        phone_required: newEvent.phone_required,
        requires_number_selection: newEvent.event_type === 'sorteo' ? newEvent.requires_number_selection : false,
        number_range_min: newEvent.event_type === 'sorteo' && newEvent.requires_number_selection && newEvent.number_range_min ? parseInt(newEvent.number_range_min) : null,
        number_range_max: newEvent.event_type === 'sorteo' && newEvent.requires_number_selection && newEvent.number_range_max ? parseInt(newEvent.number_range_max) : null,
        is_featured: newEvent.is_featured,
      };

      const { error } = await supabase.from('events').insert([payload]);

      if (error) throw error;

      resetEventForm();
      await loadEvents();
      showToast('success', 'Evento Creado', `${payload.title} ha sido publicado y traducido.`);
    } catch (err: any) {
      showToast('error', 'Error al crear', err?.message || 'Error inesperado');
    }
  };

  const handleUpdateEventStatus = async (eventId: string, status: string) => {
    const { error } = await supabase.from('events').update({ status }).eq('id', eventId);
    if (error) {
      showToast('error', 'No se pudo actualizar el estado', error.message);
      return;
    }
    await loadEvents();
    showToast('success', 'Estado actualizado', `El evento ahora figura como ${status}.`);
  };

  const handleToggleFeatured = async (event: any) => {
    const nextFeatured = !event.is_featured;
    const { error } = await supabase.from('events').update({ is_featured: nextFeatured }).eq('id', event.id);
    if (error) {
      showToast('error', 'No se pudo actualizar el destacado', error.message);
      return;
    }
    await loadEvents();
    showToast('success', nextFeatured ? 'Evento destacado' : 'Evento normalizado', event.title);
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) {
      showToast('error', 'No se pudo eliminar el evento', error.message);
      return;
    }
    await loadEvents();
    showToast('success', 'Evento eliminado', `${title} fue retirado.`);
  };

  const openParticipantsModal = async (event: any) => {
    setSelectedEventForParticipants(event);
    const { data, error } = await supabase.from('event_registrations').select('*').eq('event_id', event.id).order('created_at', { ascending: false });
    if (error) {
      showToast('error', 'Error al cargar participantes', error.message);
    } else if (data) {
      setRegistrations(data);
      setIsParticipantsModalOpen(true);
    }
  };

  return {
    handleCreateEvent,
    handleUpdateEventStatus,
    handleToggleFeatured,
    handleDeleteEvent,
    openParticipantsModal,
  };
}