'use client';

import React, { useEffect, useState } from 'react';
import styles from './ToastMessage.module.css';

interface ToastMessageProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onDismiss: (id: string) => void;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ 
  id, 
  message, 
  type = 'info', 
  onDismiss 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(id), 300); // Wait for exit animation
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : ''}`}>
      <span className={styles.message}>{message}</span>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onDismiss(id), 300);
        }} 
        className={styles.closeBtn}
        aria-label="Cerrar"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default ToastMessage;
