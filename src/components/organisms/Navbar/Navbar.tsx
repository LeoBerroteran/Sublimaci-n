'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/atoms/Logo/Logo';
import NavLink from '@/components/molecules/NavLink/NavLink';
import CurrencyToggle from '@/components/molecules/CurrencyToggle/CurrencyToggle';
import Button from '@/components/atoms/Button/Button';
import Avatar from '@/components/atoms/Avatar/Avatar';
import { Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const { currentUser, isLoggedIn, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Logo size="md" />

        <button
          type="button"
          className="nav-toggle"
          onClick={toggleMobileMenu}
          aria-label="Menú"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <NavLink href="/" onClick={closeMobileMenu}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink href="/catalogo" onClick={closeMobileMenu}>
              Catálogo
            </NavLink>
          </li>
          <li>
            <NavLink href="/faq" onClick={closeMobileMenu}>
              FAQ
            </NavLink>
          </li>
          {mounted && isAdmin && (
            <li>
              <NavLink href="/admin" onClick={closeMobileMenu}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          <CurrencyToggle />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {mounted && isLoggedIn && currentUser ? (
              <>
                <Button
                  href="/perfil"
                  variant="outline"
                  size="sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    height: '36px',
                    fontSize: '0.85rem',
                  }}
                >
                  <Avatar name={currentUser.name || 'U'} size="sm" />
                  <span>{(currentUser.name || 'Usuario').split(' ')[0]}</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { logout(); }}
                  style={{ padding: '6px 12px', height: '36px' }}
                  title="Cerrar Sesión"
                >
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button href="/login" variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
                <Button href="/registro" variant="primary" size="sm">
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
