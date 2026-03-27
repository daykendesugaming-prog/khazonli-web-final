"use client";

export function useTiendaFilters(
  catalogProducts: any[],
  events: any[],
  activeCategory: string,
  searchQuery: string
) {
  const dynamicCategories = Array.from(
    new Set(catalogProducts.map((p) => p.category))
  ).filter(Boolean);

  const allCategories = ['mmo', ...dynamicCategories, 'eventos'];

  const currentCategoryProducts = catalogProducts.filter(
    (p) =>
      p.category === activeCategory &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.game_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.event_type || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    allCategories,
    currentCategoryProducts,
    filteredEvents,
  };
}