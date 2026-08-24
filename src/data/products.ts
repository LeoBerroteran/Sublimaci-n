import { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Taza Personalizada', category: 'sublimacion', description: 'Taza de cerámica con impresión sublimada de alta calidad. Colores vibrantes que no se desvanecen con el uso y lavado. Perfecta para regalos personalizados.', price: 8, materials: 'Cerámica blanca AAA, tinta de sublimación premium', sizes: ['11oz Standard', '15oz Grande'], printArea: 'Área envolvente completa: 20cm x 9cm', icon: '☕', image: '/img/taza_personalizada.jpg', featured: true, badge: 'Popular' },
  { id: 2, name: 'Camiseta Sublimada', category: 'sublimacion', description: 'Camiseta deportiva con sublimación total. Tejido transpirable ideal para uso diario o deportivo. Tu diseño cubrirá toda la prenda.', price: 15, materials: 'Poliéster 100% dry-fit, tinta eco-solvente', sizes: ['S', 'M', 'L', 'XL', 'XXL'], printArea: 'Sublimación completa frontal y espalda: 28cm x 40cm', icon: '👕', image: '/img/camiseta_sublimada.jpg', featured: true, badge: null },
  { id: 3, name: 'Mouse Pad Personalizado', category: 'sublimacion', description: 'Mouse pad con base antideslizante y superficie ultra suave. Impresión a full color que mantiene la precisión del mouse.', price: 6, materials: 'Base de caucho antideslizante, superficie de microfibra', sizes: ['20x24cm Estándar', '25x30cm Grande', '30x80cm XL Gamer'], printArea: 'Superficie completa del pad', icon: '🖱️', image: '/img/mousepad_personalizado.jpg', featured: false, badge: 'Nuevo' },
  { id: 4, name: 'Cojín Personalizado', category: 'sublimacion', description: 'Cojín decorativo con tu foto o diseño favorito. Relleno hipoalergénico de alta densidad para máxima comodidad.', price: 12, materials: 'Tela peluche suave, relleno de fibra siliconada', sizes: ['35x35cm', '40x40cm', '45x45cm'], printArea: 'Una cara completa con opción de reverso', icon: '🛋️', image: '/img/cojin_personalizado.jpg', featured: false, badge: null },
  { id: 5, name: 'Gorra Sublimada', category: 'sublimacion', description: 'Gorra deportiva con sublimación en panel frontal. Estructura semi-rígida con visera curva y ajuste trasero.', price: 10, materials: 'Poliéster sublimable, visera de PVC', sizes: ['Talla única ajustable'], printArea: 'Panel frontal completo: 12cm x 8cm', icon: '🧢', image: '/img/gorra_sublimada.jpg', featured: false, badge: null },
  { id: 6, name: 'Termo Personalizado', category: 'sublimacion', description: 'Termo de acero inoxidable con doble pared para mantener la temperatura. Diseño personalizado que perdura.', price: 14, materials: 'Acero inoxidable 304, doble pared al vacío', sizes: ['350ml Compacto', '500ml Estándar', '750ml Grande'], printArea: 'Área envolvente: 18cm x 7cm', icon: '🧴', image: '/img/termo_personalizado.jpg', featured: true, badge: 'Popular' },
  { id: 7, name: 'Cuaderno Personalizado', category: 'papeleria', description: 'Cuaderno con portada personalizada en alta resolución. Hojas de papel bond de alta calidad para una escritura suave.', price: 7, materials: 'Pasta dura laminada, 100 hojas papel bond 90gr', sizes: ['A5 (15x21cm)', 'A4 (21x29cm)', 'Carta (22x28cm)'], printArea: 'Portada y contraportada completas', icon: '📓', image: '/img/cuaderno_personalizado.jpg', featured: true, badge: null },
  { id: 8, name: 'Agenda 2026', category: 'papeleria', description: 'Agenda anual con diseño personalizado. Incluye calendario, planificador mensual y semanal, páginas de notas y directorio.', price: 12, materials: 'Pasta dura premium con acabado mate, papel bond 90gr', sizes: ['A5 (15x21cm)', 'A4 (21x29cm)'], printArea: 'Portada, contraportada y lomo', icon: '📅', image: '/img/agenda_personalizada.jpg', featured: true, badge: 'Nuevo' },
  { id: 9, name: 'Pack de Stickers', category: 'papeleria', description: 'Stickers personalizados impresos en vinil de alta calidad. Resistentes al agua y a la intemperie. Ideales para decorar, etiquetar y regalar.', price: 4, materials: 'Vinil adhesivo brillante, laminado UV', sizes: ['5x5cm (pack 10-15)', '7x7cm (pack 8-12)', '10x10cm (pack 5-8)'], printArea: 'Superficie completa del sticker', icon: '🏷️', image: '/img/pack_stickers.jpg', featured: false, badge: null },
  { id: 10, name: 'Tarjetas Personalizadas', category: 'papeleria', description: 'Tarjetas de presentación, invitación o agradecimiento con diseño a full color. Impresión premium en ambas caras.', price: 5, materials: 'Cartulina opalina 250gr, acabado satinado', sizes: ['9x5cm (25-50 uds)', '9x5cm (50-100 uds)', '14x9cm (25-50 uds)'], printArea: 'Ambas caras a full color', icon: '🎴', image: '/img/tarjetas_personalizadas.jpg', featured: false, badge: null },
  { id: 11, name: 'Sobres Personalizados', category: 'papeleria', description: 'Sobres para correspondencia o packaging con tu marca. Impresión de alta calidad en papel bond premium.', price: 6, materials: 'Papel bond premium 120gr', sizes: ['Carta (24x10.5cm)', 'Oficio (25x11cm)', 'A4 (23x11cm)'], printArea: 'Solapa superior y frente completo', icon: '✉️', image: '/img/sobres_personalizados.jpg', featured: false, badge: null },
  { id: 12, name: 'Planner Semanal', category: 'papeleria', description: 'Planificador semanal con diseño personalizado. Espiral metálico resistente y hojas de alta calidad para organizar tu semana.', price: 9, materials: 'Papel bond 90gr, espiral metálico doble-O', sizes: ['A5 (15x21cm)', 'A4 (21x29cm)'], printArea: 'Portada completa y separadores', icon: '📋', image: '/img/planner_semanal.jpg', featured: false, badge: 'Popular' },
];

export function mapDbProductToProduct(row: Record<string, unknown>): Product {
  const rawSizes = row.sizes;
  const sizesArray = Array.isArray(rawSizes) && rawSizes.length > 0 ? (rawSizes as string[]) : ['Estándar'];

  return {
    id: String(row.id || ''),
    name: String(row.name || 'Producto sin nombre'),
    category: (row.category === 'papeleria' ? 'papeleria' : 'sublimacion') as Product['category'],
    description: String(row.description || ''),
    price: Number(row.base_price ?? row.price ?? 0),
    base_price: Number(row.base_price ?? 0),
    discount_price: Number(row.discount_price ?? 0),
    materials: String(row.materials || ''),
    sizes: sizesArray,
    printArea: String(row.print_area || row.printArea || ''),
    print_area: String(row.print_area || row.printArea || ''),
    icon: String(row.icon || (row.category === 'papeleria' ? '📓' : '☕')),
    image: String(row.image || (row.category === 'papeleria' ? '/img/cuaderno_personalizado.jpg' : '/img/taza_personalizada.jpg')),
    featured: Boolean(row.featured),
    badge: row.badge ? String(row.badge) : null,
    creation_date: row.creation_date ? String(row.creation_date) : undefined,
    update_date: row.update_date ? String(row.update_date) : undefined,
    deleted: Boolean(row.deleted),
  };
}

let cachedProducts: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 30 * 1000; // 30 seconds

export function invalidateProductsCache() {
  cachedProducts = null;
  lastFetchTime = 0;
}

export async function fetchProducts(forceRefresh = false): Promise<Product[]> {
  const now = Date.now();
  if (!forceRefresh && cachedProducts && (now - lastFetchTime < CACHE_TTL)) {
    return cachedProducts;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('deleted', false)
      .order('creation_date', { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped = data.map((item: Record<string, unknown>) => mapDbProductToProduct(item));
      cachedProducts = mapped;
      lastFetchTime = now;
      return mapped;
    }
  } catch (err) {
    console.error('Error fetching products from DB:', err);
  }

  if (cachedProducts) {
    return cachedProducts;
  }
  return PRODUCTS;
}

export async function fetchProductById(id: string | number): Promise<Product | undefined> {
  const all = await fetchProducts();
  const found = all.find((p) => String(p.id) === String(id));
  if (found) return found;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('id', id)
      .eq('deleted', false)
      .maybeSingle();

    if (!error && data) {
      return mapDbProductToProduct(data as Record<string, unknown>);
    }
  } catch (err) {
    console.error('Error fetching product by ID from DB:', err);
  }

  return PRODUCTS.find((p) => String(p.id) === String(id));
}

export function getProductById(id: string | number): Product | undefined {
  if (cachedProducts) {
    const found = cachedProducts.find((p) => String(p.id) === String(id));
    if (found) return found;
  }
  return PRODUCTS.find((p) => String(p.id) === String(id));
}

export function getProductsByCategory(category: Product['category']): Product[] {
  const list = cachedProducts || PRODUCTS;
  return list.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  const list = cachedProducts || PRODUCTS;
  return list.filter((p) => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return cachedProducts || PRODUCTS;
  const list = cachedProducts || PRODUCTS;
  return list.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}
