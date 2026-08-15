'use client';

import React from 'react';
import { useCurrency } from '@/hooks/useCurrency';

export default function CurrencyToggle() {
  const { current, toggle } = useCurrency();

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    backgroundColor: 'var(--neutral)',
    borderRadius: '24px',
    padding: '3px',
    overflow: 'hidden',
  };

  const getBtnStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '7px 16px',
    borderRadius: '22px',
    border: 'none',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    color: isActive ? '#ffffff' : 'var(--text-light)',
    boxShadow: isActive ? '0 2px 8px rgba(169, 115, 130, 0.3)' : 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.85rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  });

  return (
    <div style={containerStyle}>
      <button
        type="button"
        style={getBtnStyle(current === 'USD')}
        onClick={() => {
          if (current !== 'USD') toggle();
        }}
      >
        USD $
      </button>
      <button
        type="button"
        style={getBtnStyle(current === 'BS')}
        onClick={() => {
          if (current !== 'BS') toggle();
        }}
      >
        BS Bs.
      </button>
    </div>
  );
}
