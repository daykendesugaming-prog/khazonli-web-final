"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import LanguageSwitcher from './LanguageSwitcher'; // Importamos el selector que creaste

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const t = useTranslations('Navbar');

  useEffect(() => {
    // Revisar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="w-full border-b border-gray-800 bg-[#0B0F19]/95 backdrop-blur-md py-3 px-6 flex justify-between items-center fixed top-0 z-50">
      
      {/* LOGO */}
      <Link href="/" className="flex items-center group">
        <div className="relative h-10 w-48 md:w-64 transition-opacity group-hover:opacity-80">
          <Image 
            src="/letra 333.PNG" 
            alt="Khazonli Branding" 
            fill 
            className="object-contain object-left"
            priority
          />
        </div>
      </Link>
      
      {/* NAVEGACIÓN DERECHA */}
      <div className="flex items-center gap-3 md:gap-4">
        
        {/* 🌐 SELECTOR DE IDIOMAS (Añadido aquí) */}
        <LanguageSwitcher />

        {/* Enlace a Servicios Pro */}
        <Link 
          href="/servicios" 
          className="hidden md:inline-block text-[10px] font-black tracking-widest text-gray-400 hover:text-[#FBB03B] transition-all px-4 py-2 border border-gray-800 rounded-full hover:border-[#FBB03B]/40 uppercase"
        >
          {t('services')}
        </Link>
        
        {/* Botón Inteligente de Acceso */}
        {user ? (
          <Link 
            href="/perfil" 
            className="text-[10px] font-black tracking-widest text-[#0B0F19] bg-[#00A8FF] hover:bg-blue-400 transition-all px-4 py-2 border border-[#00A8FF] rounded-full uppercase shadow-[0_0_15px_rgba(0,168,255,0.3)] flex items-center gap-1.5"
          >
            <span className="text-xs">👤</span> {t('profile')}
          </Link>
        ) : (
          <Link 
            href="/login" 
            className="text-[9px] md:text-[10px] font-black tracking-widest text-[#00A8FF] hover:text-white transition-all px-4 py-2 border border-[#00A8FF]/30 bg-[#00A8FF]/10 rounded-full hover:bg-[#00A8FF] uppercase"
          >
            {t('login')}
          </Link>
        )}
      </div>
    </nav>
  );
}