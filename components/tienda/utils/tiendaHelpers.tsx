"use client";

export const isBsPayment = (paymentName: string) =>
  ['pago movil', 'pago móvil', 'banesco', 'venezuela', 'bs', 'bolivares', 'bolívares'].some((kw) =>
    paymentName.toLowerCase().includes(kw)
  );

export const isZinliPayment = (paymentName: string) =>
  paymentName.toLowerCase().includes('zinli');

export const getEventStatusBadge = (status: string) => {
  if (status === 'active') return 'bg-green-400/10 text-green-400 border-green-400/30';
  if (status === 'closed') return 'bg-[#FBB03B]/10 text-[#FBB03B] border-[#FBB03B]/30';
  if (status === 'finished') return 'bg-red-500/10 text-red-500 border-red-500/30';
  return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
};

export const formatEventType = (type: string) => {
  if (type === 'sorteo') return 'Sorteo';
  if (type === 'torneo') return 'Torneo';
  return 'Especial';
};

export const renderIcon = (iconData: string, isModal: boolean = false) => {
  if (!iconData) return <span className={isModal ? 'text-6xl' : 'text-4xl'}>📦</span>;

  const cleanIcon = iconData.trim();

  if (cleanIcon.startsWith('http') || cleanIcon.startsWith('/') || cleanIcon.includes('.')) {
    return (
      <img
        src={cleanIcon}
        alt="Logo"
        className={`${
          isModal ? 'w-32 h-32' : 'w-50 h-50 md:w-50 md:h-50'
        } object-contain drop-shadow-2xl transition-transform duration-500`}
      />
    );
  }

  return <div className={isModal ? 'text-6xl' : 'text-5xl'}>{cleanIcon}</div>;
};