'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/atoms/Logo/Logo';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon/WhatsAppIcon';
import { InstagramIcon, FacebookIcon } from '@/components/atoms/SocialIcons/SocialIcons';
import { getContactWhatsAppUrl } from '@/lib/whatsapp';
import { MapPin } from 'lucide-react';

export default function Footer() {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getContactWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Column 1: Brand Info & Logo */}
          <div className="footer-section">
            <div style={{ marginBottom: '16px' }}>
              <Logo size="md" />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Transformamos tus ideas en productos únicos. Sublimación de alta calidad y papelería personalizada para cada ocasión.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul className="footer-links">
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/catalogo">Catálogo Completo</Link></li>
              <li><Link href="/catalogo?categoria=sublimacion">Sublimación</Link></li>
              <li><Link href="/catalogo?categoria=papeleria">Papelería</Link></li>
              <li><Link href="/faq">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="https://wa.me/584243695379"
                  onClick={handleWhatsAppClick}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <WhatsAppIcon size={18} color="#25D366" /> WhatsApp: +58 424-3695379
                </a>
              </li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)' }}>
                  <MapPin size={16} style={{ color: 'var(--accent)' }} /> Venezuela
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a
                href="https://www.instagram.com/subli_lover?igsh=MW5uOGV6dm1pemRsag=="
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon instagram"
                title="Instagram"
              >
                <InstagramIcon size={20} color="#ffffff" />
              </a>
              <a
                href="https://www.facebook.com/share/1D4XtomhZa/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon facebook"
                title="Facebook"
              >
                <FacebookIcon size={20} color="#ffffff" />
              </a>
              <a
                href="https://wa.me/584243695379"
                onClick={handleWhatsAppClick}
                className="social-icon whatsapp"
                title="WhatsApp Directo"
              >
                <WhatsAppIcon size={20} color="#ffffff" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ justifyContent: 'center' }}>
          <p>© 2026 Sublilove. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
