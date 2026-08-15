'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import FormField from '@/components/molecules/FormField/FormField';
import Button from '@/components/atoms/Button/Button';
import Avatar from '@/components/atoms/Avatar/Avatar';
import styles from './ProfileForm.module.css';

export default function ProfileForm() {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || currentUser.mail || '');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const res = await updateProfile({
      name,
      email,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
    });
    setSubmitting(false);

    if (res.success) {
      showToast(res.message, 'success');
      setCurrentPassword('');
      setNewPassword('');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className={styles.card} style={{ backgroundColor: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 20px var(--shadow)' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-block', marginBottom: '12px' }}>
          <Avatar name={currentUser.name || 'Usuario'} size="lg" />
        </div>
        <h2 style={{ margin: 0, color: 'var(--dark)' }}>{currentUser.name}</h2>
        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', fontWeight: 600 }}>
          {currentUser.role === 'admin' ? 'Administrador' : 'Cliente'}
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="Nombre Completo" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={submitting} />
        <FormField label="Correo Electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={submitting} />

        <hr style={{ border: 'none', borderTop: '1px solid var(--neutral)', margin: '12px 0' }} />

        <h4 style={{ margin: 0, color: 'var(--dark)' }}>Cambiar Contraseña (Opcional)</h4>
        <FormField label="Contraseña Actual" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" disabled={submitting} />
        <FormField label="Nueva Contraseña" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" disabled={submitting} />

        <Button type="submit" variant="primary" fullWidth disabled={submitting} style={{ marginTop: '8px' }}>
          {submitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </div>
  );
}
