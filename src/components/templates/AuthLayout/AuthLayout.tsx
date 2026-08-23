import React from 'react';
import Image from 'next/image';
import styles from './AuthLayout.module.css';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Left Column: Form Content */}
        <div className={styles.formColumn}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children}
        </div>

        {/* Right Column: Decorative Brand Banner with Full Pink Gradient (Desktop) */}
        <div className={styles.bannerColumn}>
          <Image
            src="/img/agenda_personalizada.jpg"
            alt="Subli Love Productos Personalizados"
            fill
            sizes="500px"
            style={{ objectFit: 'cover', objectPosition: 'center center', opacity: 0.45, mixBlendMode: 'overlay' }}
            priority
          />
          <div className={styles.bannerOverlay} />
          <div className={styles.bannerContent}>
            <div className={styles.bannerBadge}>
              ✨ Sublilove
            </div>
            <h2 className={styles.bannerTitle}>
              Diseños que inspiran cada día
            </h2>
            <p className={styles.bannerText}>
              Crea regalos inolvidables, papelería fina y sublimación premium con acabado profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
