'use client';

import React from 'react';
import Logo from '@/components/atoms/Logo/Logo';

export interface AdminSidebarProps {
  activeSection: string;
  onNavigate: (section: any) => void;
}

export default function AdminSidebar({ activeSection, onNavigate }: AdminSidebarProps) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Productos', icon: '📦' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' },
  ];

  return (
    <aside
      style={{
        backgroundColor: 'var(--darker)',
        padding: '28px 20px',
        color: '#ffffff',
        minHeight: 'calc(100vh - 72px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div style={{ marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Logo size="sm" />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
