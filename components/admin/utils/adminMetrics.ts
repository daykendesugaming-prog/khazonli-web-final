import { getOrderType } from './adminHelpers';

export const calculateMetrics = (data: any[]) => {
  const next = {
    total: data.length,
    pending: 0,
    completed: 0,
    cancelled: 0,
    buyMk: 0,
    sellMk: 0,
    exchanges: 0,
    p2p: 0,
    wallet: 0,
    volumeBs: 0,
    volumeUsd: 0,
  };

  data.forEach((order) => {
    const status = String(order?.status || '').toLowerCase();
    const type = getOrderType(order);

    if (status === 'pendiente') next.pending += 1;
    else if (status === 'completado') next.completed += 1;
    else if (status === 'cancelado') next.cancelled += 1;

    if (type === 'buy') next.buyMk += 1;
    else if (type === 'sell') next.sellMk += 1;
    else if (type === 'exchange') next.exchanges += 1;
    else if (type === 'p2p') next.p2p += 1;
    else if (type === 'wallet') next.wallet += 1;

    const priceBs = Number(order?.price_bs || 0);
    next.volumeBs += Number.isFinite(priceBs) ? priceBs : 0;

    const rawText = String(order?.price_text || '')
      .replace(/[^0-9.,-]/g, '')
      .replace(',', '.');

    const priceUsd = Number(rawText || 0);
    next.volumeUsd += Number.isFinite(priceUsd) ? priceUsd : 0;
  });

  return {
    ...next,
    volumeBs: Number(next.volumeBs.toFixed(2)),
    volumeUsd: Number(next.volumeUsd.toFixed(2)),
  };
};