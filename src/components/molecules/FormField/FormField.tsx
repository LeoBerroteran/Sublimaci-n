import React from 'react';
import Input from '@/components/atoms/Input/Input';
import styles from './FormField.module.css';

export interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  children?: React.ReactNode;
}

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled,
  required,
  id,
  children,
}: FormFieldProps) {
  const errorMessage = typeof error === 'string' ? error : error ? 'Campo requerido' : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={errorMessage}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      {children}
    </div>
  );
}
