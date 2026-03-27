"use client";

import { slugify } from '../utils/adminHelpers';

type UseAdminFormHandlersParams = {
  servers: any[];
  setServers: React.Dispatch<React.SetStateAction<any[]>>;
  stocks: any[];
  setStocks: React.Dispatch<React.SetStateAction<any[]>>;
  routes: any[];
  setRoutes: React.Dispatch<React.SetStateAction<any[]>>;
  setNewEvent: React.Dispatch<React.SetStateAction<any>>;
};

export function useAdminFormHandlers({
  servers,
  setServers,
  stocks,
  setStocks,
  routes,
  setRoutes,
  setNewEvent,
}: UseAdminFormHandlersParams) {
  const handleServerInputChange = (index: number, field: string, value: any) => {
    const newServers = [...servers];
    newServers[index][field] = value;
    setServers(newServers);
  };

  const handleStockInputChange = (index: number, field: string, value: any) => {
    const newS = [...stocks];
    newS[index][field] = value;
    setStocks(newS);
  };

  const handleRouteInputChange = (index: number, field: string, value: any) => {
    const newR = [...routes];
    newR[index][field] = value;
    setRoutes(newR);
  };

  const handleEventFieldChange = (field: string, value: any) => {
    setNewEvent((prev: any) => {
      const updated = { ...prev, [field]: value };

      if (field === 'title') {
        updated.slug = slugify(value);
      }

      if (field === 'event_type' && value !== 'torneo') {
        updated.game_name = '';
        updated.mode_name = '';
        updated.entry_price_usd = '';
        updated.entry_price_bs = '';
        updated.max_participants = '';
      }

      if (field === 'event_type' && value !== 'sorteo') {
        updated.requires_number_selection = false;
        updated.number_range_min = '';
        updated.number_range_max = '';
      }

      if (field === 'requires_number_selection' && value === false) {
        updated.number_range_min = '';
        updated.number_range_max = '';
      }

      return updated;
    });
  };

  return {
    handleServerInputChange,
    handleStockInputChange,
    handleRouteInputChange,
    handleEventFieldChange,
  };
}