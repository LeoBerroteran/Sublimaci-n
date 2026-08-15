'use client';

import { useState } from 'react';
import AuthLayout from '@/components/templates/AuthLayout/AuthLayout';
import FormField from '@/components/molecules/FormField/FormField';
import Button from '@/components/atoms/Button/Button';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecoveryPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { showToast } = useToast();
  const router = useRouter();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Ingresa tu email', 'error');
      return;
    }
    showToast('Código enviado a tu email (demo: 123456)', 'info');
    setStep(2);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== '123456') {
      showToast('Código incorrecto. Usa: 123456', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    showToast('Contraseña restablecida exitosamente', 'success');
    router.push('/login');
  };

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle={step === 1 ? 'Te enviaremos un código de verificación' : 'Ingresa el código enviado'}
    >
      {step === 1 ? (
        <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />
          <Button type="submit" variant="primary">
            Enviar Código
          </Button>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Link href="/login" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField
            label="Código de Verificación (demo: 123456)"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            required
          />
          <FormField
            label="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" variant="primary">
            Restablecer Contraseña
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
