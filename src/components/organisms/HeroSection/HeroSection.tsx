'use client';

import React from 'react';
import Link from 'next/link';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon/WhatsAppIcon';
import { getContactWhatsAppUrl } from '@/lib/whatsapp';

export default function HeroSection() {
  const handleContactWhatsApp = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const url = getContactWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="hero">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ color: '#ffffff' }}>
            Diseños que Inspiran
          </h1>
          <p className="hero-subtitle">
            Transformamos tus ideas en productos únicos. Sublimación de alta calidad y papelería personalizada para hacer cada momento especial.
          </p>
          <div className="hero-cta">
            <Link href="/catalogo" className="hero-btn hero-btn-catalog">
              Ver Catálogo
            </Link>
            <button
              type="button"
              onClick={handleContactWhatsApp}
              className="hero-btn hero-btn-whatsapp"
            >
              <WhatsAppIcon size={20} /> Contactar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
