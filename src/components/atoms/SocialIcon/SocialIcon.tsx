import React from 'react';
import styles from './SocialIcon.module.css';

interface SocialIconProps {
  platform: 'instagram' | 'facebook';
  href: string;
}

export default function SocialIcon({ platform, href }: SocialIconProps) {
  const iconClass = platform === 'instagram' ? 'fab fa-instagram' : 'fab fa-facebook-f';
  
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${styles.icon} ${styles[platform]}`}>
      <i className={iconClass}></i>
    </a>
  );
}
