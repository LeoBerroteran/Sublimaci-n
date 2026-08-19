'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/atoms/Logo/Logo';
import CurrencyToggle from '@/components/molecules/CurrencyToggle/CurrencyToggle';
import Button from '@/components/atoms/Button/Button';
import Avatar from '@/components/atoms/Avatar/Avatar';
import { Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, isLoggedIn, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Esc key or window resize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 880) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isLinkActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Logo size="md" />

        {/* Desktop Navigation Links */}
        <ul className="desktop-nav-links">
          <li>
            <Link
              href="/"
              className={`nav-link ${isLinkActive('/') ? 'active' : ''}`}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/catalogo"
              className={`nav-link ${isLinkActive('/catalogo') ? 'active' : ''}`}
            >
              Catálogo
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className={`nav-link ${isLinkActive('/faq') ? 'active' : ''}`}
            >
              FAQ
            </Link>
          </li>
          {mounted && isAdmin && (
            <li>
              <Link
                href="/admin"
                className={`nav-link ${isLinkActive('/admin') ? 'active' : ''}`}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop Right Actions */}
        <div className="desktop-nav-actions">
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
                  onClick={() => logout()}
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

        {/* Mobile Hamburger Toggle Button (Shown on <= 880px) */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Full-Width Clean Dropdown Menu (No dark backdrop, pure solid clean design) */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <div className="mobile-dropdown-content">
            <div className="mobile-nav-items">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={`mobile-nav-link ${isLinkActive('/') ? 'active' : ''}`}
              >
                Inicio
              </Link>
              <Link
                href="/catalogo"
                onClick={closeMobileMenu}
                className={`mobile-nav-link ${isLinkActive('/catalogo') ? 'active' : ''}`}
              >
                Catálogo
              </Link>
              <Link
                href="/faq"
                onClick={closeMobileMenu}
                className={`mobile-nav-link ${isLinkActive('/faq') ? 'active' : ''}`}
              >
                Preguntas Frecuentes (FAQ)
              </Link>
              {mounted && isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMobileMenu}
                  className={`mobile-nav-link ${isLinkActive('/admin') ? 'active' : ''}`}
                >
                  Panel de Administración
                </Link>
              )}
            </div>

            <div className="mobile-dropdown-divider" />

            {/* Mobile Actions: Currency & Auth */}
            <div className="mobile-dropdown-actions">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <CurrencyToggle />
              </div>

              {mounted && isLoggedIn && currentUser ? (
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <Button href="/perfil" variant="outline" size="md" onClick={closeMobileMenu} fullWidth>
                    Mi Perfil ({(currentUser.name || 'Usuario').split(' ')[0]})
                  </Button>
                  <Button variant="secondary" size="md" onClick={() => { logout(); closeMobileMenu(); }}>
                    Salir
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <Button href="/login" variant="outline" size="md" onClick={closeMobileMenu} fullWidth>
                    Iniciar Sesión
                  </Button>
                  <Button href="/registro" variant="primary" size="md" onClick={closeMobileMenu} fullWidth>
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
