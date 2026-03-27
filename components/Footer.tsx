"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('Footer');

  const socialLinks = [
    { name: t('community'), icon: '💬', color: 'hover:bg-[#25D366]', link: 'https://chat.whatsapp.com/HTTT0c4E0wn29Xlm8kDGjs' },
    { name: 'Instagram', icon: '📸', color: 'hover:bg-[#E1306C]', link: 'https://www.instagram.com/khaz.onli/' },
    { name: 'Facebook', icon: '👥', color: 'hover:bg-[#1877F2]', link: 'https://www.facebook.com/khaz01' },
    { name: 'TikTok', icon: '🎵', color: 'hover:bg-white hover:text-black', link: 'https://www.tiktok.com/@khaz.onli' },
  ];

  return (
    <footer className="bg-[#0B0F19] border-t border-gray-800 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        <div className="text-center md:text-left">
          <h4 className="text-purple-500 font-black mb-6 uppercase tracking-[0.2em] text-[10px]">{t('pro_services')}</h4>
          <ul className="space-y-4 text-gray-500 text-sm font-bold">
            <li><Link href="/servicios" className="hover:text-purple-400 transition-colors">{t('web_dev')}</Link></li>
            <li><Link href="/servicios" className="hover:text-purple-400 transition-colors">{t('automation')}</Link></li>
            <li><Link href="/servicios" className="hover:text-purple-400 transition-colors">{t('bots')}</Link></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h4 className="text-gray-300 font-black mb-6 uppercase tracking-[0.2em] text-[10px]">{t('ecosystem')}</h4>
          <ul className="space-y-4 text-gray-500 text-sm font-bold">
            <li><Link href="/legal/terminos" className="hover:text-white transition-colors">{t('terms')}</Link></li>
            <li><Link href="/legal/politicas" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
            <li><Link href="/legal/soporte" className="hover:text-white transition-colors">{t('support')}</Link></li>
          </ul>
        </div>

        <div className="text-center md:text-right flex flex-col items-center md:items-end">
          <h4 className="text-[#00A8FF] font-black mb-8 uppercase tracking-[0.2em] text-[10px]">{t('connect')}</h4>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <div key={social.name} className="relative group">
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div className="bg-white text-black text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter whitespace-nowrap shadow-xl">
                    {social.name}
                  </div>
                  <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1"></div>
                </div>
                <a href={social.link} target="_blank" className={`w-12 h-12 flex items-center justify-center bg-[#121826] border border-gray-800 rounded-2xl text-xl transition-all duration-300 ${social.color} hover:border-transparent hover:-translate-y-1 shadow-lg`}>
                  {social.icon}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-900 text-center">
        <p className="text-gray-700 text-[9px] uppercase tracking-[0.5em] font-black italic">
          {t('rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}