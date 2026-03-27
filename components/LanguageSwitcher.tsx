"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation'; // Este import es vital
import { useParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const languages = [
    { code: 'es', name: 'ES' },
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
    { code: 'pt-BR', name: 'PT' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    // router.replace ahora funciona con la nueva configuración
    router.replace(
      // @ts-ignore
      { pathname, params },
      { locale: newLocale }
    );
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#121826]/80 border border-gray-800 p-1 rounded-full backdrop-blur-md">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-2.5 py-1 text-[10px] font-black rounded-full transition-all duration-300 ${
            locale === lang.code
              ? 'bg-[#00A8FF] text-white shadow-[0_0_15px_rgba(0,168,255,0.4)] scale-105'
              : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}