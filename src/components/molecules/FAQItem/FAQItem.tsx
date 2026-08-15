'use client';

import React from 'react';
import styles from './FAQItem.module.css';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        {question}
        <span className={styles.icon}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </summary>
      <div className={styles.content}>
        <p>{answer}</p>
      </div>
    </details>
  );
};

export default FAQItem;
