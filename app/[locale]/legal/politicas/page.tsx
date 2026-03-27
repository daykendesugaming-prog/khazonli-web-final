"use client";

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const content = {
  es: {
    t1: "1. Protección de Datos",
    p1: "En Khazonli utilizamos tecnología de cifrado y bases de datos seguras (Supabase) para garantizar que tu información personal nunca sea vulnerada.",
    t2: "2. Privacidad de Contacto",
    p2: "Tu número de WhatsApp y correo electrónico solo se utilizarán para gestionar tus pedidos. Khazonli no vende ni comparte bases de datos con terceros bajo ninguna circunstancia.",
    t3: "3. Transacciones Seguras",
    p3: "Recomendamos a todos nuestros clientes realizar operaciones únicamente a través de nuestros canales oficiales. **Khazonli jamás te pedirá tus contraseñas de juego ni claves de acceso bancario.**"
  },
  en: {
    t1: "1. Data Protection",
    p1: "At Khazonli, we use encryption technology and secure databases (Supabase) to ensure that your personal information is never compromised.",
    t2: "2. Contact Privacy",
    p2: "Your WhatsApp number and email will only be used to manage your orders. Khazonli does not sell or share databases with third parties under any circumstances.",
    t3: "3. Secure Transactions",
    p3: "We recommend all our clients to conduct operations only through our official channels. **Khazonli will never ask for your game passwords or bank access codes.**"
  },
  fr: {
    t1: "1. Protection des Données",
    p1: "Chez Khazonli, nous utilisons une technologie de cryptage et des bases de données sécurisées (Supabase) pour garantir que vos informations personnelles ne soient jamais compromises.",
    t2: "2. Confidentialité du Contact",
    p2: "Votre numéro WhatsApp et votre e-mail ne seront utilisés que pour gérer vos commandes. Khazonli ne vend ni ne partage de bases de données avec des tiers en aucune circonstance.",
    t3: "3. Transactions Sécurisées",
    p3: "Nous recommandons à tous nos clients d'effectuer des opérations uniquement via nos canaux officiels. **Khazonli ne vous demandera jamais vos mots de passe de jeu ou vos codes d'accès bancaires.**"
  },
  "pt-BR": {
    t1: "1. Proteção de Dados",
    p1: "Na Khazonli, utilizamos tecnologia de criptografia e bancos de dados seguros (Supabase) para garantir que suas informações pessoais nunca sejam vulneradas.",
    t2: "2. Privacidade de Contato",
    p2: "Seu número de WhatsApp e e-mail serão usados apenas para gerenciar seus pedidos. A Khazonli não vende nem compartilha bancos de dados com terceiros em nenhuma circunstância.",
    t3: "3. Transações Seguras",
    p3: "Recomendamos a todos os nossos clientes realizar operações apenas através dos nossos canais oficiais. **A Khazonli jamais pedirá suas senhas de jogo ou códigos de acesso bancário.**"
  }
};

export default function PoliticasPage() {
  const locale = useLocale() as keyof typeof content;
  const t = useTranslations('Legal');
  const c = content[locale] || content.es;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 md:p-24 pt-32">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-purple-500 text-sm font-bold uppercase tracking-widest hover:underline mb-8 inline-block">
          {t('back_home')}
        </Link>
        
        <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">
          {t('privacy_title').split(' ')[0]} <span className="text-purple-500">{t('privacy_title').split(' ')[1]}</span>
        </h1>

        <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
          <section>
            <h2 className="text-white font-bold uppercase mb-3 tracking-widest text-xs">{c.t1}</h2>
            <p>{c.p1}</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase mb-3 tracking-widest text-xs">{c.t2}</h2>
            <p>{c.p2}</p>
          </section>

          <section className="bg-purple-500/5 p-6 rounded-2xl border border-purple-500/20">
            <h2 className="text-purple-400 font-bold uppercase mb-3 tracking-widest text-xs">{c.t3}</h2>
            <p dangerouslySetInnerHTML={{ __html: c.p3 }}></p>
          </section>
        </div>
      </div>
    </div>
  );
}