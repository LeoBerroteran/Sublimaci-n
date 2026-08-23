'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import FormField from '@/components/molecules/FormField/FormField';
import Button from '@/components/atoms/Button/Button';
import { validations, validateName, validateLastName, validateEmail } from '@/lib/validators';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const criteria = validations.password.criteria;

  const nameValidation = validateName(name);
  const lastNameValidation = validateLastName(lastName);
  const emailValidation = validateEmail(email);

  const nameError = (touched.name || name.length >= 2) && !nameValidation.valid ? nameValidation.message : undefined;
  const lastNameError = (touched.lastName || lastName.length >= 2) && !lastNameValidation.valid ? lastNameValidation.message : undefined;
  const emailError = (touched.email || email.length >= 3) && !emailValidation.valid ? emailValidation.message : undefined;

  const getPasswordValidationMessage = (pwd: string) => {
    if (!pwd) return 'La contraseña es obligatoria';
    if (pwd.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Falta 1 letra mayúscula (A-Z)';
    if (!/[a-z]/.test(pwd)) return 'Falta 1 letra minúscula (a-z)';
    if (!/\d/.test(pwd)) return 'Falta 1 número (0-9)';
    if (!/[@$!%*?&#+\-_.]/.test(pwd)) return 'Falta 1 carácter especial (@$!%*?&#+-_.)';
    return undefined;
  };

  const passwordError = (touched.password || password.length > 0) ? getPasswordValidationMessage(password) : undefined;
  const confirmPasswordError = (touched.confirmPassword || confirmPassword.length > 0)
    ? (!confirmPassword
        ? 'Confirma tu contraseña'
        : password !== confirmPassword
        ? 'Las contraseñas no coinciden'
        : undefined)
    : undefined;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Name with strict regex & anti-gibberish
    if (!nameValidation.valid) {
      showToast(nameValidation.message, 'error');
      setTouched((prev) => ({ ...prev, name: true }));
      return;
    }

    // Validate Last Name with strict regex & anti-gibberish
    if (!lastNameValidation.valid) {
      showToast(lastNameValidation.message, 'error');
      setTouched((prev) => ({ ...prev, lastName: true }));
      return;
    }

    // Validate Email
    if (!emailValidation.valid) {
      showToast(emailValidation.message, 'error');
      setTouched((prev) => ({ ...prev, email: true }));
      return;
    }

    // Validate Password
    const pwdErr = getPasswordValidationMessage(password);
    if (pwdErr) {
      showToast(pwdErr, 'error');
      setTouched((prev) => ({ ...prev, password: true }));
      return;
    }

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      setTouched((prev) => ({ ...prev, confirmPassword: true }));
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    const res = await register(name.trim(), email.trim(), password, lastName.trim());
    setSubmitting(false);

    if (res.success) {
      showToast(res.message, 'success');
      router.push('/login?registered=true');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row2col}>
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
          required
          disabled={submitting}
        />
      </div>

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

      <div className={styles.row2col}>
        <FormField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setTouched((prev) => ({ ...prev, password: true }));
          }}
          onBlur={() => handleBlur('password')}
          error={passwordError}
          placeholder="••••••••"
          required
          disabled={submitting}
        />

        <FormField
          label="Confirmar Contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setTouched((prev) => ({ ...prev, confirmPassword: true }));
          }}
          onBlur={() => handleBlur('confirmPassword')}
          error={confirmPasswordError}
          placeholder="••••••••"
          required
          disabled={submitting}
        />
      </div>

      {password.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '4px 10px',
          padding: '8px 12px',
          borderRadius: '8px',
          backgroundColor: 'var(--neutral-light)',
          fontSize: '0.75rem',
          margin: '-4px 0 8px',
        }}>
          {criteria.map((c, i) => {
            const met = c.pattern.test(password);
            return (
              <div
                key={i}
                style={{
                  color: met ? '#2e7d32' : '#d32f2f',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: met ? 600 : 400,
                }}
              >
                <span>{met ? '✓' : '•'}</span>
                <span>{c.label}</span>
              </div>
            );
          })}
        </div>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={submitting} style={{ marginTop: '4px' }}>
        {submitting ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      <div className={styles.loginPrompt}>
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className={styles.loginLink}>
          Inicia Sesión
        </Link>
      </div>
    </form>
  );
}
