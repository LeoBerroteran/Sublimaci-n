import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  type: 'popular' | 'nuevo';
  children: React.ReactNode;
}

export default function Badge({ type, children }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[type]}`}>
      {children}
    </span>
  );
}
