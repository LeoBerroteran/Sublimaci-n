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
import { ArrowLeft, Plus, Minus, ChevronDown } from 'lucide-react';

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
    const whatsappUrl = getWhatsAppUrl(product, selectedSize, quantity);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="product-detail-container" style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      <Link
        href="/catalogo"
        className="btn btn-outline btn-sm"
        style={{
          marginBottom: '20px',
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
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1/1',
            minHeight: '260px',
            maxHeight: '460px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            margin: '0 auto',
          }}
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

        <div className="product-detail-info" style={{ width: '100%' }}>
          <span className="product-detail-category">{product.category}</span>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.3rem)',
              color: 'var(--dark)',
              margin: '8px 0 16px',
              lineHeight: 1.2,
              wordBreak: 'break-word',
            }}
          >
            {product.name}
          </h1>

          <div className="product-detail-price" style={{ marginBottom: '20px' }}>
            <PriceTag priceUSD={product.price} />
          </div>

          <p className="product-detail-description" style={{ lineHeight: 1.6, color: 'var(--text)' }}>
            {product.description}
          </p>

          <div className="product-specs">
            <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem', color: 'var(--dark)' }}>Especificaciones</h3>
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
            <div style={{ marginBottom: '22px' }}>
              <label
                htmlFor="size-select"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  marginBottom: '8px',
                  color: 'var(--dark)',
                }}
              >
                <span>Tamaño:</span>
              </label>
              <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 44px 13px 18px',
                    borderRadius: 'var(--radius-sm)',
                    border: '2px solid var(--neutral-dark)',
                    backgroundColor: 'var(--white)',
                    color: 'var(--text)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px var(--shadow)',
                    transition: 'all 0.25s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(169, 115, 130, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--neutral-dark)';
                    e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow)';
                  }}
                >
                  {product.sizes.map((s) => (
                    <option
                      key={s}
                      value={s}
                      style={{
                        backgroundColor: 'var(--white)',
                        color: 'var(--text)',
                        padding: '10px',
                      }}
                    >
                      {s}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--primary)',
                  }}
                >
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          )}

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
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
                  boxShadow: '0 2px 6px var(--shadow)',
                  outline: 'none',
                }}
              >
                <Minus size={18} />
              </button>

              <span
                style={{
                  minWidth: '52px',
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
                  boxShadow: '0 2px 6px var(--shadow)',
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
