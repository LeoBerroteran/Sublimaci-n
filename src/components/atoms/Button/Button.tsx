import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

export interface ButtonProps {
  variant?: 'primary' | 'outline' | 'accent' | 'whatsapp' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'small';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  title?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
  href,
  fullWidth = false,
  style,
  title,
}: ButtonProps) {
  const normalizedSize = size === 'small' ? 'sm' : size;
  const classes = `${styles.btn} ${styles[variant]} ${styles[normalizedSize]} ${fullWidth ? styles.fullWidth : ''} ${className}`.trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} style={style} title={title}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={title}
    >
      {children}
    </button>
  );
}
