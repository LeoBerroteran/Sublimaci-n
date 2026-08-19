'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import Button from '@/components/atoms/Button/Button';
import PriceTag from '@/components/atoms/PriceTag/PriceTag';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon/WhatsAppIcon';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Estándar');

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuantity((prev) => prev + 1);
  };

  const handleOrderWhatsApp = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!isLoggedIn) {
      showToast('Inicia sesión para realizar pedidos por WhatsApp', 'info');
      router.push('/login');
      return;
    }

    const whatsappUrl = getWhatsAppUrl(product, selectedSize, quantity);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="product-detail-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Link
        href="/catalogo"
        className="btn btn-outline btn-sm"
        style={{
          marginBottom: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>

      <div className="product-detail">
        <div
          className={`product-detail-image cat-${product.category}`}
          style={{ position: 'relative', width: '100%', minHeight: '380px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}
        >
          <Image
            src={product.image || '/img/logo.png'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--dark)', margin: '8px 0 16px' }}>{product.name}</h1>
          <div className="product-detail-price" style={{ marginBottom: '24px' }}>
            <PriceTag priceUSD={product.price} />
          </div>

          <p className="product-detail-description">{product.description}</p>

          <div className="product-specs">
            <h3>Especificaciones</h3>
            {product.materials && (
              <div className="spec-item">
                <span className="spec-label">Materiales:</span>
                <span className="spec-value">{product.materials}</span>
              </div>
            )}
            {(product.printArea || product.print_area) && (
              <div className="spec-item">
                <span className="spec-label">Área de Impresión:</span>
                <span className="spec-value">{product.printArea || product.print_area}</span>
              </div>
            )}
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="size-select" style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--dark)' }}>
                Tamaño:
              </label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--neutral-dark)',
                  backgroundColor: 'var(--white)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              >
                {product.sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: 600, color: 'var(--dark)', fontSize: '1rem' }}>Cantidad:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={handleDecrease}
                aria-label="Disminuir cantidad"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '2px solid var(--neutral-dark)',
                  backgroundColor: 'var(--white)',
                  color: 'var(--dark)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  outline: 'none',
                }}
              >
                <Minus size={18} />
              </button>

              <span
                style={{
                  minWidth: '56px',
                  height: '42px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--neutral-dark)',
                  backgroundColor: 'var(--white)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: 'var(--dark)',
                  userSelect: 'none',
                }}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label="Aumentar cantidad"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '2px solid var(--neutral-dark)',
                  backgroundColor: 'var(--white)',
                  color: 'var(--dark)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  outline: 'none',
                }}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div style={{ marginTop: '28px' }}>
            <Button
              variant="whatsapp"
              size="lg"
              fullWidth
              onClick={handleOrderWhatsApp}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <WhatsAppIcon size={22} /> Pedir por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
