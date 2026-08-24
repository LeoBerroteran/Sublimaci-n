'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/atoms/Logo/Logo';
import CurrencyToggle from '@/components/molecules/CurrencyToggle/CurrencyToggle';
import ThemeToggle from '@/components/molecules/ThemeToggle/ThemeToggle';
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
      if (window.innerWidth > 1024) setMobileMenuOpen(false);
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

  const getFirstName = (user: { name?: string; email?: string; mail?: string } | null) => {
    if (!user) return 'Usuario';
    if (user.name && user.name.trim()) {
      const firstName = user.name.trim().split(/\s+/)[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }
    const email = user.email || user.mail || '';
    if (email) {
      const raw = email.split('@')[0];
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }
    return 'Usuario';
  };

  const displayName = getFirstName(currentUser);

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Logo size="md" />

        {/* Desktop Navigation Links */}
        <ul className="desktop-nav-links">
          <li>
            <Link
              href="/"
              prefetch={true}
              className={`nav-link ${isLinkActive('/') ? 'active' : ''}`}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/catalogo"
              prefetch={true}
              className={`nav-link ${isLinkActive('/catalogo') ? 'active' : ''}`}
            >
              Catálogo
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              prefetch={true}
              className={`nav-link ${isLinkActive('/faq') ? 'active' : ''}`}
            >
              FAQ
            </Link>
          </li>
          {mounted && isAdmin && (
            <li>
              <Link
                href="/admin"
                prefetch={true}
                className={`nav-link ${isLinkActive('/admin') ? 'active' : ''}`}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop Right Actions */}
        <div className="desktop-nav-actions">
          <ThemeToggle />
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
                  <Avatar name={displayName} size="sm" />
                  <span>{displayName}</span>
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

      {/* Mobile Full-Width Clean Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <div className="mobile-dropdown-content">
            <div className="mobile-nav-items">
              <Link
                href="/"
                prefetch={true}
                onClick={closeMobileMenu}
                className={`mobile-nav-link ${isLinkActive('/') ? 'active' : ''}`}
              >
                Inicio
              </Link>
              <Link
                href="/catalogo"
                prefetch={true}
                onClick={closeMobileMenu}
                className={`mobile-nav-link ${isLinkActive('/catalogo') ? 'active' : ''}`}
              >
                Catálogo
              </Link>
              <Link
                href="/faq"
                prefetch={true}
                onClick={closeMobileMenu}
                className={`mobile-nav-link ${isLinkActive('/faq') ? 'active' : ''}`}
              >
                Preguntas Frecuentes (FAQ)
              </Link>
            </div>

            {/* ADMIN SECTIONS INSIDE MOBILE MENU */}
            {mounted && isAdmin && (
              <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid var(--neutral-dark)' }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-light)', fontWeight: 700, padding: '0 4px 8px', textAlign: 'center' }}>
                  Panel de Administración
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Link
                    href="/admin?tab=dashboard"
                    onClick={closeMobileMenu}
                    className="mobile-nav-link"
                    style={{ fontSize: '0.9rem', padding: '10px 8px', gap: '6px' }}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    href="/admin?tab=products"
                    onClick={closeMobileMenu}
                    className="mobile-nav-link"
                    style={{ fontSize: '0.9rem', padding: '10px 8px', gap: '6px' }}
                  >
                    📦 Productos
                  </Link>
                  <Link
                    href="/admin?tab=users"
                    onClick={closeMobileMenu}
                    className="mobile-nav-link"
                    style={{ fontSize: '0.9rem', padding: '10px 8px', gap: '6px' }}
                  >
                    👥 Usuarios
                  </Link>
                  <Link
                    href="/admin?tab=settings"
                    onClick={closeMobileMenu}
                    className="mobile-nav-link"
                    style={{ fontSize: '0.9rem', padding: '10px 8px', gap: '6px' }}
                  >
                    ⚙️ Configuración
                  </Link>
                </div>
              </div>
            )}

            <div className="mobile-dropdown-divider" />

            {/* Mobile Actions: Theme, Currency & Auth */}
            <div className="mobile-dropdown-actions">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <ThemeToggle />
                <CurrencyToggle />
              </div>

              {mounted && isLoggedIn && currentUser ? (
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <Button href="/perfil" variant="outline" size="md" onClick={closeMobileMenu} fullWidth>
                    Mi Perfil ({displayName})
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
