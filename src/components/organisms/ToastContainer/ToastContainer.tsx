'use client';

import React from 'react';
import { useToast } from '@/hooks/useToast';
import ToastMessage from '@/components/molecules/ToastMessage/ToastMessage';
import styles from './ToastContainer.module.css';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastMessage
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
