import type { Metadata } from 'next';
import CatalogView from '@/components/organisms/CatalogView/CatalogView';
import { fetchProducts } from '@/data/products';
import JsonLd from '@/components/atoms/JsonLd/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sublilove.com';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Catálogo Completo | Sublilove',
  description:
    'Explora nuestro catálogo completo de productos de sublimación y papelería personalizada. Tazas, franelas, termos, libretas, agendas, stickers y mucho más.',
  openGraph: {
    title: 'Catálogo de Productos | Sublilove',
    description:
      'Personaliza tus productos favoritos con Sublilove. Sublimación y papelería fina de alta calidad.',
    url: `${SITE_URL}/catalogo`,
    images: ['/img/logo.png'],
  },
  alternates: {
    canonical: `${SITE_URL}/catalogo`,
  },
};

export default async function CatalogPage() {
  const products = await fetchProducts();

  const catalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Catálogo de Productos | Sublilove',
    description: 'Explora nuestra colección completa de productos de sublimación y papelería personalizada.',
    url: `${SITE_URL}/catalogo`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/producto/${product.id}`,
        name: product.name,
      })),
    },
  };

  return (
    <>
      <JsonLd data={catalogSchema} />
      <CatalogView initialProducts={products} />
    </>
  );
}
