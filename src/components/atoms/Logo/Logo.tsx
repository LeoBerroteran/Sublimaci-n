import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const pixelSizes = {
    sm: { img: 40, font: '1.1rem' },
    md: { img: 52, font: '1.3rem' },
    lg: { img: 64, font: '1.6rem' },
  };

  const { img, font } = pixelSizes[size] || pixelSizes.md;

  return (
    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      <Image
        src="/img/logo.png"
        alt="Subli Love Logo"
        width={img}
        height={img}
        style={{ objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
        priority
      />
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: font,
          color: 'var(--primary)',
          letterSpacing: '-0.5px',
        }}
      >
        Sublilove
      </span>
    </Link>
  );
}
