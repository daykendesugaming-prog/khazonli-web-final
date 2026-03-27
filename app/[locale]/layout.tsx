import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ai/ChatBot'; // Importación confirmada

// 🟢 FUNCIÓN DE SEO DINÁMICO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
 
  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const locales = ['es', 'en', 'fr', 'pt-BR'];
  
  // Validar que el idioma sea permitido
  if (!locales.includes(locale)) notFound();

  // Obtener mensajes para las traducciones
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {/* Barra de navegación superior */}
      <Navbar /> 
      
      {/* Contenido principal de la página */}
      <main className="pt-24 min-h-screen">
        {children}
      </main>

      {/* 🤖 BOT DE IA (Modo Burbuja Flotante) */}
      {/* Aparecerá en la esquina inferior derecha en todas las páginas públicas */}
      <ChatBot mode="bubble" />
    </NextIntlClientProvider>
  );
}