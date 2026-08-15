import { notFound } from 'next/navigation';
import ProductDetail from '@/components/organisms/ProductDetail/ProductDetail';
import { fetchProductById, fetchProducts } from '@/data/products';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <ProductDetail product={product} />
    </div>
  );
}
