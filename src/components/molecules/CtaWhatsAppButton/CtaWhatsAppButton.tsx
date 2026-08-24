'use client';

import React from 'react';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon/WhatsAppIcon';
import { getContactWhatsAppUrl } from '@/lib/whatsapp';

export default function CtaWhatsAppButton({ className }: { className?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getContactWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
    >
      <WhatsAppIcon size={20} /> Contactar por WhatsApp
    </button>
  );
}
