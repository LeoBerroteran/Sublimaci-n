'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { toggleTheme, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: '38px', height: '38px' }} />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      aria-label={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        backgroundColor: 'var(--neutral-light)',
        border: '1px solid var(--neutral-dark)',
        color: isDarkMode ? '#ffca28' : 'var(--primary)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 6px var(--shadow)',
        padding: 0,
        flexShrink: 0,
      }}
    >
      {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
