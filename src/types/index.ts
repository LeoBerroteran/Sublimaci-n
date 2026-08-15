// ============================================================
// Types for Subli Love E-Commerce
// ============================================================

export interface Product {
  id: string | number;
  name: string;
  category: 'sublimacion' | 'papeleria' | string;
  description: string;
  price: number;
  base_price?: number;
  discount_price?: number;
  materials: string;
  sizes: string[];
  printArea?: string;
  print_area?: string;
  icon: string;
  image: string;
  featured: boolean;
  badge: 'Popular' | 'Nuevo' | null | string;
  creation_date?: string;
  update_date?: string;
  deleted?: boolean;
}

export interface User {
  id?: string;
  name: string;
  last_name?: string;
  email: string;
  mail?: string;
  password?: string;
  role: 'admin' | 'cliente';
  creation_date?: string;
  update_date?: string;
  deleted?: boolean;
}

export type Currency = 'USD' | 'BS';

export interface CurrencyState {
  current: Currency;
  rate: number;
  rateSource: 'api' | 'manual';
  lastUpdate: string | null;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface BusinessInfo {
  name: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
}

export interface FAQItem {
  q: string;
  a: string;
}
