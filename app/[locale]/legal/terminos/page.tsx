"use client";

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const content = {
  es: {
    t1: "1. Naturaleza del Servicio",
    p1: "Khazonli.es opera como una plataforma de intermediación para la compra y venta de bienes virtuales y servicios. Al usar nuestro sitio, declaras ser mayor de edad.",
    t2: "2. Irreversibilidad",
    p2: "Debido a la naturaleza intangible de los productos, toda transacción confirmada por el cliente es definitiva. No hay reembolsos tras el envío.",
    t3: "3. Responsabilidad de Datos",
    p3: "Es responsabilidad del usuario suministrar correctamente los datos de pago. Khazonli no se hace responsable por fondos enviados a destinos erróneos.",
    t4: "4. Tiempos de Procesamiento",
    p4: "Procesamos órdenes en 30-60 min, pero puede variar por fallas eléctricas, de internet o plataformas bancarias externas."
  },
  en: {
    t1: "1. Service Nature",
    p1: "Khazonli.es operates as an intermediary platform for buying and selling virtual goods and services. By using our site, you declare you are of legal age.",
    t2: "2. Irreversibility",
    p2: "Due to the intangible nature of the products, every transaction confirmed by the client is final. No refunds after shipping.",
    t3: "3. Data Responsibility",
    p3: "It is the user's sole responsibility to provide correct payment data. Khazonli is not responsible for funds sent to wrong destinations.",
    t4: "4. Processing Times",
    p4: "We process orders in 30-60 min, but this may vary due to power, internet, or external banking platform issues."
  },
  fr: {
    t1: "1. Nature du Service",
    p1: "Khazonli.es fonctionne comme une plateforme d'intermédiation pour l'achat et la vente de biens et services virtuels. En utilisant notre site, vous déclarez être majeur.",
    t2: "2. Irréversibilité",
    p2: "En raison de la nature intangible des produits, toute transaction confirmée par le client est définitive. Aucun remboursement après l'envoi.",
    t3: "3. Responsabilité des Données",
    p3: "Il est de la responsabilité de l'utilisateur de fournir correctement les données de paiement. Khazonli n'est pas responsable des fonds envoyés par erreur.",
    t4: "4. Délais de Traitement",
    p4: "Nous traitons les commandes en 30-60 min, mais cela peut varier en raison de pannes d'électricité, d'Internet ou de banques."
  },
  "pt-BR": {
    t1: "1. Natureza do Serviço",
    p1: "Khazonli.es opera como uma plataforma de intermediação para compra e venda de bens e serviços virtuais. Ao usar nosso site, você declara ser maior de idade.",
    t2: "2. Irreversibilidade",
    p2: "Devido à natureza intangível dos produtos, toda transação confirmada pelo cliente é definitiva. Não há reembolsos após o envio.",
    t3: "3. Responsabilidade de Dados",
    p3: "É responsabilidade do usuário fornecer corretamente os dados de pagamento. A Khazonli não se responsabiliza por fundos enviados a destinos errados.",
    t4: "4. Tempos de Processamento",
    p4: "Processamos pedidos em 30-60 min, mas pode variar por falhas elétricas, de internet ou plataformas bancárias externas."
  }
};

export default function TerminosPage() {
  const locale = useLocale() as keyof typeof content;
  const t = useTranslations('Legal');
  const c = content[locale] || content.es;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 md:p-24 pt-32">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-[#00A8FF] text-sm font-bold uppercase tracking-widest hover:underline mb-8 inline-block">
          {t('back_home')}
        </Link>
        
        <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">
          {t('terms_title').split(' ')[0]} <span className="text-[#00A8FF]">{t('terms_title').split(' ')[1]}</span>
        </h1>

        <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
          <section>
            <h2 className="text-white font-bold uppercase mb-3 tracking-widest text-xs">{c.t1}</h2>
            <p>{c.p1}</p>
          </section>

          <section className="bg-[#121826] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-[#00A8FF] font-bold uppercase mb-3 tracking-widest text-xs">{c.t2}</h2>
            <p className="text-gray-300 italic">"{c.p2}"</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase mb-3 tracking-widest text-xs">{c.t3}</h2>
            <p>{c.p3}</p>
          </section>

          <section>
            <h2 className="text-white font-bold uppercase mb-3 tracking-widest text-xs">{c.t4}</h2>
            <p>{c.p4}</p>
          </section>
        </div>
      </div>
    </div>
  );
}