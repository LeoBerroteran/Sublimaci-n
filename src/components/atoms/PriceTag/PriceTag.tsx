'use client';

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './PriceTag.module.css';

interface PriceTagProps {
  priceUSD: number;
  className?: string;
}

export default function PriceTag({ priceUSD, className = '' }: PriceTagProps) {
  const { format } = useCurrency();

  return (
    <span className={`${styles.price} ${className}`}>
      {format(priceUSD)}
    </span>
  );
}
