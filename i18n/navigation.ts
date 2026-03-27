import { createNavigation } from 'next-intl/navigation';

export const locales = ['es', 'en', 'fr', 'pt-BR'] as const;
export const defaultLocale = 'es'; // Definimos el idioma por defecto
export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter, getPathname } = 
  createNavigation({
    locales,
    defaultLocale, // <-- ESTO ES LO QUE FALTABA Y CAUSABA EL ERROR
    localePrefix
  });