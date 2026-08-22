import { Product } from '@/types';

const DEFAULT_PHONE = '584243695379';

export function getWhatsAppUrl(product: Product, size?: string, quantity: number = 1): string {
  const phone = typeof window !== 'undefined'
    ? localStorage.getItem('subli_biz_whatsapp') || DEFAULT_PHONE
    : DEFAULT_PHONE;

  const sizeInfo = size && size !== 'Estándar' ? `, tamaño: ${size}` : '';
  const qtyInfo = quantity > 1 ? ` (Cantidad: ${quantity})` : '';

  const message = `Hola, quisiera información acerca del producto ${product.name}${sizeInfo}${qtyInfo}.`;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

export function getContactWhatsAppUrl(): string {
  const phone = typeof window !== 'undefined'
    ? localStorage.getItem('subli_biz_whatsapp') || DEFAULT_PHONE
    : DEFAULT_PHONE;

  const message = 'Hola, quisiera información acerca de los productos de Sublilove.';

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}
