'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon/WhatsAppIcon';
import { getContactWhatsAppUrl } from '@/lib/whatsapp';

export default function CtaWhatsAppButton({ className }: { className?: string }) {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showToast('Inicia sesión para contactar por WhatsApp', 'info');
      router.push('/login');
      return;
    }

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
