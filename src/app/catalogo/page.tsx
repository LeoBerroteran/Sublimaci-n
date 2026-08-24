import React, { Suspense } from 'react';
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
    'Explora nuestro catálogo completo de productos de sublimación y papelería personalizada. Tazas, franelas, termos, libretas, agendas 2026, stickers y mucho más.',
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

interface CatalogPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogPage(props: CatalogPageProps) {
  const resolvedParams = props.searchParams ? await props.searchParams : {};
  const rawCat = resolvedParams.categoria || resolvedParams.cat || resolvedParams.category;
  const initialCategory = typeof rawCat === 'string' ? rawCat : undefined;

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
      <Suspense fallback={<div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Cargando catálogo...</div>}>
        <CatalogView initialProducts={products} initialCategory={initialCategory} />
      </Suspense>
    </>
  );
}
