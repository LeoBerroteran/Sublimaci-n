import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetail from '@/components/organisms/ProductDetail/ProductDetail';
import { fetchProductById, fetchProducts } from '@/data/products';
import JsonLd from '@/components/atoms/JsonLd/JsonLd';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sublilove.com';

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const title = `${product.name} | Sublilove`;
  const description = product.description || `Compra ${product.name} personalizado en Sublilove. Alta calidad en sublimación y papelería.`;
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${SITE_URL}${product.image || '/img/logo.png'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/producto/${product.id}`,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/producto/${product.id}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${SITE_URL}${product.image || '/img/logo.png'}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [imageUrl],
    sku: `PROD-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Sublilove',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/producto/${product.id}`,
      priceCurrency: 'USD',
      price: Number(product.price || 0).toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Sublilove',
      },
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <ProductDetail product={product} />
      </div>
    </>
  );
}
