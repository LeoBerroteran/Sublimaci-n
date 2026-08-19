'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Currency, CurrencyState } from '@/types';

interface CurrencyContextType extends CurrencyState {
  toggle: () => void;
  setCurrency: (currency: Currency) => void;
  format: (priceUSD?: number | string | null) => string;
  getSymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const API_URL = 'https://ve.dolarapi.com/v1/dolares';
const CACHE_KEY = 'subli_bcv_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
const DEFAULT_RATE = 36.5;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Currency>('USD');
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [rateSource, setRateSource] = useState<'api' | 'manual'>('manual');
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchRate = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { rate: cachedRate, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION && cachedRate > 0) {
            setRate(cachedRate);
            setRateSource('api');
            setLastUpdate(new Date(timestamp).toISOString());
            return;
          }
        }
      }
    } catch { /* ignore cache errors */ }

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('BCV API error');
      const data = await res.json();
      const bcv = data.find((d: { fuente: string }) => d.fuente === 'oficial');
      if (bcv?.promedio && Number(bcv.promedio) > 0) {
        const newRate = Number(bcv.promedio);
        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: newRate, timestamp: Date.now() }));
        }
        setRate(newRate);
        setRateSource('api');
        setLastUpdate(new Date().toISOString());
      }
    } catch {
      // Fallback is DEFAULT_RATE
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('subli_currency');
        if (saved === 'BS' || saved === 'USD') {
          setCurrent(saved as Currency);
        }
      }
    } catch { /* ignore */ }
    fetchRate();
  }, [fetchRate]);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrent(newCurrency);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('subli_currency', newCurrency);
      }
    } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    setCurrent((prev) => {
      const next: Currency = prev === 'USD' ? 'BS' : 'USD';
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('subli_currency', next);
        }
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const format = useCallback(
    (priceUSD?: number | string | null) => {
      const num = Number(priceUSD ?? 0);
      const safePrice = isNaN(num) ? 0 : num;

      if (current === 'BS') {
        const bs = safePrice * (rate || DEFAULT_RATE);
        return `Bs. ${bs.toFixed(2)}`;
      }
      return `$${safePrice.toFixed(2)}`;
    },
    [current, rate]
  );

  const getSymbol = useCallback(() => (current === 'BS' ? 'Bs.' : '$'), [current]);

  return (
    <CurrencyContext.Provider
      value={{
        current,
        rate,
        rateSource,
        lastUpdate,
        toggle,
        setCurrency,
        format,
        getSymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
