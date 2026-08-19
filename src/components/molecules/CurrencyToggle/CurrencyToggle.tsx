'use client';

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';

interface CurrencyToggleProps {
  size?: 'sm' | 'md';
}

export default function CurrencyToggle({ size = 'md' }: CurrencyToggleProps) {
  const { current, setCurrency } = useCurrency();

  const isSmall = size === 'sm';

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    backgroundColor: 'var(--neutral)',
    borderRadius: '24px',
    padding: '3px',
    overflow: 'hidden',
    userSelect: 'none',
  };

  const getBtnStyle = (isActive: boolean): React.CSSProperties => ({
    padding: isSmall ? '5px 12px' : '6px 14px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    color: isActive ? '#ffffff' : 'var(--text-light)',
    boxShadow: isActive ? '0 2px 8px rgba(169, 115, 130, 0.3)' : 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: isSmall ? '0.78rem' : '0.82rem',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={containerStyle} role="group" aria-label="Cambio de Moneda">
      <button
        type="button"
        style={getBtnStyle(current === 'USD')}
        onClick={() => setCurrency('USD')}
      >
        USD $
      </button>
      <button
        type="button"
        style={getBtnStyle(current === 'BS')}
        onClick={() => setCurrency('BS')}
      >
        BS Bs.
      </button>
    </div>
  );
}
