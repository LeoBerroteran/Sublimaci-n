import React from 'react';
import Image from 'next/image';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 150px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 12px 40px var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Left Column: Form Content */}
        <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {title && <h1 style={{ fontSize: '2rem', color: 'var(--dark)', marginBottom: '8px' }}>{title}</h1>}
          {subtitle && (
            <p style={{ color: 'var(--text-light)', fontSize: '0.98rem', marginBottom: '28px', lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
          {children}
        </div>

        {/* Right Column: Decorative Brand Banner Image */}
        <div
          style={{
            position: 'relative',
            minHeight: '380px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '40px',
            color: 'var(--white)',
          }}
        >
          <Image
            src="/img/agenda_personalizada.jpg"
            alt="Subli Love Productos Personalizados"
            fill
            sizes="500px"
            style={{ objectFit: 'cover', opacity: 0.35, mixBlendMode: 'overlay' }}
            priority
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px',
              }}
            >
              ✨ Sublilove
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px', color: '#ffffff' }}>
              Diseños que inspiran cada día
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.6, margin: 0 }}>
              Crea regalos inolvidables, papelería fina y sublimación premium con acabado profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
