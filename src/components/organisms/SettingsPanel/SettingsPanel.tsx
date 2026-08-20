'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/useToast';
import FormField from '@/components/molecules/FormField/FormField';
import Button from '@/components/atoms/Button/Button';

export default function SettingsPanel() {
  const { rate, lastUpdate } = useCurrency();
  const { showToast } = useToast();
  const [bizName, setBizName] = useState('Subli & Papelería');
  const [whatsapp, setWhatsapp] = useState('584243695379');
  const [instagram, setInstagram] = useState('https://www.instagram.com/subli_lover');
  const [facebook, setFacebook] = useState('https://www.facebook.com');

  useEffect(() => {
    setBizName(localStorage.getItem('subli_biz_name') || 'Subli & Papelería');
    setWhatsapp(localStorage.getItem('subli_biz_whatsapp') || '584243695379');
    setInstagram(localStorage.getItem('subli_biz_instagram') || 'https://www.instagram.com/subli_lover');
    setFacebook(localStorage.getItem('subli_biz_facebook') || 'https://www.facebook.com');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('subli_biz_name', bizName);
    localStorage.setItem('subli_biz_whatsapp', whatsapp);
    localStorage.setItem('subli_biz_instagram', instagram);
    localStorage.setItem('subli_biz_facebook', facebook);
    showToast('Configuración del negocio guardada', 'success');
  };

  return (
    <div style={{ maxWidth: '640px', width: '100%' }}>
      <div className="admin-card">
        <h3 style={{ margin: 0, color: 'var(--dark)', fontSize: '1.25rem' }}>Tasa BCV Oficial (Automática)</h3>
        <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 800, color: 'var(--primary)', margin: '8px 0' }}>
          Bs. {typeof rate === 'number' ? rate.toFixed(2) : rate}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>
          ✅ Actualizada automáticamente desde la API BCV {lastUpdate ? `— ${new Date(lastUpdate).toLocaleDateString()}` : ''}
        </div>
      </div>

      <form className="admin-card" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, color: 'var(--dark)', fontSize: '1.25rem' }}>Información del Negocio</h3>
        <FormField label="Nombre del Negocio" type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} />
        <FormField label="WhatsApp de Pedidos" type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        <FormField label="Enlace Instagram" type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        <FormField label="Enlace Facebook" type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
        <Button type="submit" variant="primary">
          Guardar Configuración
        </Button>
      </form>
    </div>
  );
}
