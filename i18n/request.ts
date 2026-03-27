import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['es', 'en', 'fr', 'pt-BR'];

export default getRequestConfig(async (params: any) => {
  const locale = await params.requestLocale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});