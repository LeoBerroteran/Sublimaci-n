import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => {
  return (
    <div className={styles.statCard}>
      <div className={styles.topBorder}></div>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <div className={styles.value}>{value}</div>
          <div className={styles.label}>{label}</div>
        </div>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
