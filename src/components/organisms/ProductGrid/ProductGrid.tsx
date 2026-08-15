import React from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/molecules/ProductCard/ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <div>
      {title && <h2 className="section-title">{title}</h2>}
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
