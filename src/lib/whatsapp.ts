import { Product } from '@/types';

const DEFAULT_PHONE = '584243695379';

export function getWhatsAppUrl(product: Product, size: string, quantity: number): string {
  const phone = typeof window !== 'undefined'
    ? localStorage.getItem('subli_biz_whatsapp') || DEFAULT_PHONE
    : DEFAULT_PHONE;

  const message = `¡Hola! 👋 Me interesa el producto:\n\n` +
    `📦 *${product.name}*\n` +
    `📏 Tamaño: ${size}\n` +
    `🔢 Cantidad: ${quantity}\n\n` +
    `¿Podrían darme más información sobre disponibilidad y precio?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getContactWhatsAppUrl(): string {
  const phone = typeof window !== 'undefined'
    ? localStorage.getItem('subli_biz_whatsapp') || DEFAULT_PHONE
    : DEFAULT_PHONE;
  return `https://wa.me/${phone}`;
}
