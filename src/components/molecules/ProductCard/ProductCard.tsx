'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import PriceTag from '@/components/atoms/PriceTag/PriceTag';
import Button from '@/components/atoms/Button/Button';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon/WhatsAppIcon';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/producto/${product.id}`);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      showToast('Inicia sesión para realizar pedidos por WhatsApp', 'info');
      router.push('/login');
      return;
    }

    const url = getWhatsAppUrl(product, product.sizes?.[0] || 'Estándar', 1);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const badgeClass = String(product.badge).toLowerCase() === 'popular' ? 'badge-popular' : 'badge-nuevo';

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={`product-card-image cat-${product.category}`} style={{ position: 'relative' }}>
        <Image
          src={product.image || '/img/logo.png'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          style={{ objectFit: 'cover' }}
        />
        {product.badge && (
          <span className={`product-badge ${badgeClass}`}>{product.badge}</span>
        )}
      </div>

      <div className="product-card-info">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-price">
          <PriceTag priceUSD={product.price} />
        </div>

        <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
          <Button href={`/producto/${product.id}`} variant="outline" size="sm" style={{ flex: 1 }}>
            Ver Detalle
          </Button>
          <Button variant="whatsapp" size="sm" onClick={handleWhatsApp} title="Pedir por WhatsApp">
            <WhatsAppIcon size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
