'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/useToast';
import FormField from '@/components/molecules/FormField/FormField';
import Button from '@/components/atoms/Button/Button';

export default function SettingsPanel() {
  const { rate, lastUpdate } = useCurrency();
  const { showToast } = useToast();
  const [bizName, setBizName] = useState('Sublilove');
  const [whatsapp, setWhatsapp] = useState('584243695379');
  const [instagram, setInstagram] = useState('https://www.instagram.com/subli_lover?igsh=MW5uOGV6dm1pemRsag==');
  const [facebook, setFacebook] = useState('https://www.facebook.com/share/1D4XtomhZa/');
  const [saving, setSaving] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.business_name) setBizName(data.business_name);
          if (data.whatsapp_phone) setWhatsapp(data.whatsapp_phone);
          if (data.instagram_url) setInstagram(data.instagram_url);
          if (data.facebook_url) setFacebook(data.facebook_url);
        }
      } catch (err) {
        console.error('Error loading settings from DB:', err);
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: bizName.trim(),
          whatsapp_phone: whatsapp.trim().replace(/\D/g, ''),
          instagram_url: instagram.trim(),
          facebook_url: facebook.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast('Configuración guardada en la base de datos', 'success');
      } else {
        showToast(data.error || 'Error al guardar configuración', 'error');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error de conexión';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
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
        <h3 style={{ margin: 0, color: 'var(--dark)', fontSize: '1.25rem' }}>Información del Negocio (Base de Datos)</h3>
        <FormField
          label="Nombre del Negocio"
          type="text"
          value={bizName}
          onChange={(e) => setBizName(e.target.value)}
          disabled={loadingSettings || saving}
          required
        />
        <FormField
          label="WhatsApp de Pedidos (Código país + número)"
          type="text"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          disabled={loadingSettings || saving}
          placeholder="584243695379"
          required
        />
        <FormField
          label="Enlace Instagram"
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          disabled={loadingSettings || saving}
        />
        <FormField
          label="Enlace Facebook"
          type="text"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          disabled={loadingSettings || saving}
        />
        <Button type="submit" variant="primary" disabled={loadingSettings || saving}>
          {saving ? 'Guardando en Base de Datos...' : 'Guardar en Base de Datos'}
        </Button>
      </form>
    </div>
  );
}
