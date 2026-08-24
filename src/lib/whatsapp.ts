import { Product } from '@/types';

export const DEFAULT_WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '584243695379';

export function getWhatsAppPhone(): string {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('subli_biz_whatsapp');
    if (cached && cached.trim()) return cached.trim().replace(/\D/g, '');
  }
  return DEFAULT_WHATSAPP_PHONE;
}

export function getWhatsAppUrl(product: Product, size?: string, quantity: number = 1): string {
  const phone = getWhatsAppPhone();
  const sizeInfo = size && size !== 'Estándar' ? `, tamaño: ${size}` : '';
  const qtyInfo = quantity > 1 ? ` (Cantidad: ${quantity})` : '';

  const message = `Hola, quisiera información acerca del producto ${product.name}${sizeInfo}${qtyInfo}.`;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

export function getContactWhatsAppUrl(): string {
  const phone = getWhatsAppPhone();
  const message = 'Hola, quisiera información acerca de los productos de Sublilove.';

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}
