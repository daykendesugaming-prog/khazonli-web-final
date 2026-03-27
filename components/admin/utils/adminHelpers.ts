export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const getOrderType = (order: any) => {
  const product = String(order?.product_name || '').toLowerCase();
  const variant = String(order?.variant_name || '').toLowerCase();

  if (product.startsWith('oferta p2p')) return 'p2p';
  if (product.includes('venta mk')) return 'sell';
  if (product.includes('compra mk')) return 'buy';
  if (product.includes('intercambio')) return 'exchange';
  if (product.includes('wallet') || product.includes('recarga') || variant.includes('recarga')) {
    return 'wallet';
  }

  return 'other';
};