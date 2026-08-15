import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ name, size = 'md' }: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const sizeClass = styles[size] || styles.md;

  return (
    <div className={`${styles.avatar} ${sizeClass}`}>
      {initial}
    </div>
  );
}
