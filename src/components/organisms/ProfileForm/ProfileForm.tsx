'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import FormField from '@/components/molecules/FormField/FormField';
import Button from '@/components/atoms/Button/Button';
import Avatar from '@/components/atoms/Avatar/Avatar';
import { validateName, validateLastName, validateEmail } from '@/lib/validators';
import styles from './ProfileForm.module.css';

export default function ProfileForm() {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setLastName(currentUser.last_name || '');
      setEmail(currentUser.email || currentUser.mail || '');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const nameValidation = validateName(name);
  const lastNameValidation = validateLastName(lastName);
  const emailValidation = validateEmail(email);

  const nameError = (touched.name || (name.length > 0 && name !== currentUser.name)) && !nameValidation.valid ? nameValidation.message : undefined;
  const lastNameError = (touched.lastName || (lastName.length > 0 && lastName !== currentUser.last_name)) && !lastNameValidation.valid ? lastNameValidation.message : undefined;
  const emailError = (touched.email || (email.length > 0 && email !== (currentUser.email || currentUser.mail))) && !emailValidation.valid ? emailValidation.message : undefined;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameValidation.valid) {
      showToast(nameValidation.message, 'error');
      setTouched((prev) => ({ ...prev, name: true }));
      return;
    }

    if (lastName.trim() && !lastNameValidation.valid) {
      showToast(lastNameValidation.message, 'error');
      setTouched((prev) => ({ ...prev, lastName: true }));
      return;
    }

    if (!emailValidation.valid) {
      showToast(emailValidation.message, 'error');
      setTouched((prev) => ({ ...prev, email: true }));
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    const res = await updateProfile({
      name: name.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
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

  const fullName = `${currentUser.name || ''} ${currentUser.last_name || ''}`.trim() || 'Usuario';

  return (
    <div
      className={styles.card}
      style={{
        backgroundColor: 'var(--white)',
        padding: '32px 24px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px var(--shadow)',
        maxWidth: '560px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-block', marginBottom: '12px' }}>
          <Avatar name={fullName} size="lg" />
        </div>
        <h2 style={{ margin: 0, color: 'var(--dark)', fontSize: '1.6rem' }}>{fullName}</h2>
        <span
          style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--primary)',
            fontWeight: 600,
          }}
        >
          {currentUser.role === 'admin' ? 'Administrador' : 'Cliente'}
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div>
            <FormField
              label="Nombre"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setTouched((prev) => ({ ...prev, name: true }));
              }}
              onBlur={() => handleBlur('name')}
              error={nameError}
              placeholder="Tu nombre"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <FormField
              label="Apellido"
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setTouched((prev) => ({ ...prev, lastName: true }));
              }}
              onBlur={() => handleBlur('lastName')}
              error={lastNameError}
              placeholder="Tu apellido"
              disabled={submitting}
            />
          </div>
        </div>

        <div>
          <FormField
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setTouched((prev) => ({ ...prev, email: true }));
            }}
            onBlur={() => handleBlur('email')}
            error={emailError}
            placeholder="ejemplo@correo.com"
            required
            disabled={submitting}
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--neutral)', margin: '12px 0' }} />

        <h4 style={{ margin: 0, color: 'var(--dark)' }}>Cambiar Contraseña (Opcional)</h4>
        <FormField
          label="Contraseña Actual"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          disabled={submitting}
        />
        <FormField
          label="Nueva Contraseña"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          disabled={submitting}
        />

        <Button type="submit" variant="primary" fullWidth disabled={submitting} style={{ marginTop: '8px' }}>
          {submitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </div>
  );
}
