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

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, lastName: true, email: true, password: true, confirmPassword: true });

    // Validate Name with Regex & Sanity checks
    if (!nameValidation.valid) {
      showToast(nameValidation.message, 'error');
      return;
    }

    // Validate Last Name with Regex & Sanity checks
    if (!lastNameValidation.valid) {
      showToast(lastNameValidation.message, 'error');
      return;
    }

    // Validate Email with Regex
    if (!emailValidation.valid) {
      showToast(emailValidation.message, 'error');
      return;
    }

    if (password.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
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

  const nameError = (touched.name || (name.length >= 2 && !nameValidation.valid)) ? nameValidation.message : undefined;
  const lastNameError = (touched.lastName || (lastName.length >= 2 && !lastNameValidation.valid)) ? lastNameValidation.message : undefined;
  const emailError = (touched.email && !emailValidation.valid) ? emailValidation.message : undefined;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row2col}>
        <div>
          <FormField
            label="Nombre"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => handleBlur('lastName')}
            error={lastNameError}
            placeholder="Tu apellido"
            required
            disabled={submitting}
          />
        </div>
      </div>

      <div>
        <FormField
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          error={emailError}
          placeholder="ejemplo@correo.com"
          required
          disabled={submitting}
        />
      </div>

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
        {password.length > 0 && (
          <div className={styles.criteriaList}>
            {criteria.map((c, i) => {
              const met = c.pattern.test(password);
              return (
                <div
                  key={i}
                  className={`${styles.criteriaItem} ${met ? styles.criteriaMet : styles.criteriaUnmet}`}
                >
                  <span>{met ? '✓' : '✗'}</span>
                  <span>{c.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FormField
        label="Confirmar Contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        required
        disabled={submitting}
      />

      <Button type="submit" variant="primary" fullWidth disabled={submitting} style={{ marginTop: '8px' }}>
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
