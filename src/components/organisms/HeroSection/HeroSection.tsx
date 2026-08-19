'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button/Button';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon/WhatsAppIcon';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getContactWhatsAppUrl } from '@/lib/whatsapp';

export default function HeroSection() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleContactWhatsApp = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      showToast('Inicia sesión para contactar por WhatsApp', 'info');
      router.push('/login');
      return;
    }
    const url = getContactWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="hero">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="hero-content">
          <h1 className="hero-title">
            Diseños que <span className="text-accent">Inspiran</span>
          </h1>
          <p className="hero-subtitle">
            Transformamos tus ideas en productos únicos. Sublimación de alta calidad y papelería personalizada para hacer cada momento especial.
          </p>
          <div className="hero-cta">
            <Button href="/catalogo" variant="primary" size="lg">
              Ver Catálogo
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleContactWhatsApp}
              style={{ color: '#ffffff', borderColor: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
            >
              <WhatsAppIcon size={20} /> Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
