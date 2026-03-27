"use client";

export type ShowToast = (
  type: 'success' | 'error' | 'info',
  title: string,
  message: string
) => void;

export type RatesState = {
  id: number | null;
  buy: number;
  sell: number;
};

export type NewServerState = {
  game: string;
  name: string;
  buy: string;
  sell: string;
};

export type NewStockState = {
  game: string;
  server_name: string;
  price_usd: string;
  stock_mk: string;
};

export type NewRouteState = {
  server_from: string;
  server_to: string;
  mode: string;
  rate: string;
};

export type PaymentFormState = {
  name: string;
  details: string;
};

export type NewProductState = {
  name: string;
  category: string;
  description: string;
  icon: string;
  tag: string;
};

export type VariantFormState = {
  name: string;
  priceText: string;
  priceUsd: string;
};

export type NewEventState = {
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