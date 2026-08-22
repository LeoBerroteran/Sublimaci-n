'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import FormField from '@/components/molecules/FormField/FormField';
import Button from '@/components/atoms/Button/Button';
import { LogIn, CheckCircle } from 'lucide-react';

function LoginFormContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setInfoNotice('¡Tu cuenta ha sido creada! Si requieres verificación, revisa tu correo electrónico para confirmarla.');
    } else if (searchParams.get('confirmed') === 'true') {
      setInfoNotice('¡Correo confirmado con éxito! Ya puedes iniciar sesión con tus credenciales.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const res = await login(email.trim(), password);
    setSubmitting(false);

    if (res.success) {
      showToast(res.message, 'success');
      router.push('/');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {infoNotice && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(76, 175, 80, 0.12)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{infoNotice}</span>
        </div>
      )}

      <FormField
        label="Correo Electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ejemplo@correo.com"
        required
        disabled={submitting}
      />

      <div>
        <FormField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={submitting}
        />
        <div style={{ textAlign: 'right', marginTop: '6px' }}>
          <Link href="/recuperar" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={submitting}
        fullWidth
        style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <LogIn size={18} /> {submitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
        ¿No tienes cuenta?{' '}
        <Link href="/registro" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          Regístrate gratis
        </Link>
      </div>
    </form>
  );
}

export default function LoginForm() {
  return (
    <React.Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>Cargando formulario...</div>}>
      <LoginFormContent />
    </React.Suspense>
  );
}
