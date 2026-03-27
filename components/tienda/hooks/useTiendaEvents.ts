"use client";

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export function useTiendaEvents() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventRegisterLoading, setEventRegisterLoading] = useState(false);
  const [eventRegisterSuccess, setEventRegisterSuccess] = useState(false);
  const [eventParticipants, setEventParticipants] = useState<any[]>([]);
  const [eventForm, setEventForm] = useState({
    full_name: '',
    character_name: '',
    phone: '',
    selected_number: '',
    notes: '',
  });

  const handleOpenEvent = async (eventItem: any) => {
    setSelectedEvent(eventItem);
    setEventRegisterSuccess(false);
    setEventForm({
      full_name: '',
      character_name: '',
      phone: '',
      selected_number: '',
      notes: '',
    });
    setEventParticipants([]);

    const { data } = await supabase
      .from('event_registrations')
      .select('character_name, full_name, selected_number')
      .eq('event_id', eventItem.id)
      .order('created_at', { ascending: true });

    if (data) setEventParticipants(data);
  };

  const handleCloseEvent = () => {
    setSelectedEvent(null);
    setEventRegisterSuccess(false);
    setEventForm({
      full_name: '',
      character_name: '',
      phone: '',
      selected_number: '',
      notes: '',
    });
  };

  const handleRegisterEvent = async () => {
    if (!selectedEvent) return;
    if (selectedEvent.status !== 'active') {
      return alert('Las inscripciones para este evento no están activas.');
    }

    if (selectedEvent.registration_mode === 'login') {
      return alert('Este evento requiere registro con cuenta. Ese flujo lo activaremos después.');
    }

    if (!eventForm.full_name.trim()) {
      return alert('Debes ingresar tu nombre.');
    }

    if (selectedEvent.phone_required && !eventForm.phone.trim()) {
      return alert('Este evento requiere número de teléfono.');
    }

    if (selectedEvent.requires_number_selection && !eventForm.selected_number) {
      return alert('Debes seleccionar un número para participar.');
    }

    setEventRegisterLoading(true);

    const payload: any = {
      event_id: selectedEvent.id,
      full_name: eventForm.full_name.trim(),
      character_name: eventForm.character_name.trim() || null,
      phone: eventForm.phone.trim() || null,
      selected_number:
        selectedEvent.requires_number_selection && eventForm.selected_number
          ? parseInt(eventForm.selected_number)
          : null,
      notes: eventForm.notes.trim() || null,
      status: 'registered',
    };

    const { error } = await supabase
      .from('event_registrations')
      .insert([payload]);

    setEventRegisterLoading(false);

    if (error) {
      alert(`No se pudo registrar la participación: ${error.message}`);
      return;
    }

    setEventRegisterSuccess(true);
    setEventForm({
      full_name: '',
      character_name: '',
      phone: '',
      selected_number: '',
      notes: '',
    });

    handleOpenEvent(selectedEvent);
  };

  return {
    selectedEvent,
    eventRegisterLoading,
    eventRegisterSuccess,
    eventParticipants,
    eventForm,
    setEventForm,
    handleOpenEvent,
    handleCloseEvent,
    handleRegisterEvent,
  };
}