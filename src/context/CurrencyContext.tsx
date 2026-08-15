'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Currency, CurrencyState } from '@/types';

interface CurrencyContextType extends CurrencyState {
  toggle: () => void;
  format: (priceUSD: number) => string;
  getSymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const API_URL = 'https://ve.dolarapi.com/v1/dolares';
const CACHE_KEY = 'subli_bcv_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CurrencyState>({
    current: 'USD',
    rate: 36.5,
    rateSource: 'manual',
    lastUpdate: null,
  });

  const fetchRate = useCallback(async () => {
    // Check cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rate, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setState((prev) => ({
            ...prev,
            rate,
            rateSource: 'api',
            lastUpdate: new Date(timestamp).toISOString(),
          }));
          return;
        }
      }
    } catch { /* ignore cache errors */ }

    // Fetch fresh rate
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const bcv = data.find((d: { fuente: string }) => d.fuente === 'oficial');
      if (bcv?.promedio) {
        const newRate = bcv.promedio;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: newRate, timestamp: Date.now() }));
        setState((prev) => ({
          ...prev,
          rate: newRate,
          rateSource: 'api',
          lastUpdate: new Date().toISOString(),
        }));
      }
    } catch {
      console.warn('Could not fetch BCV rate');
    }
  }, []);

  useEffect(() => {
    // Restore currency preference
    const saved = localStorage.getItem('subli_currency');
    if (saved === 'BS' || saved === 'USD') {
      setState((prev) => ({ ...prev, current: saved }));
    }
    fetchRate();
  }, [fetchRate]);

  const toggle = useCallback(() => {
    setState((prev) => {
      const next: Currency = prev.current === 'USD' ? 'BS' : 'USD';
      localStorage.setItem('subli_currency', next);
      return { ...prev, current: next };
    });
  }, []);

  const format = useCallback(
    (priceUSD: number) => {
      if (state.current === 'BS') {
        const bs = priceUSD * state.rate;
        return `Bs. ${bs.toFixed(2)}`;
      }
      return `$${priceUSD.toFixed(2)}`;
    },
    [state.current, state.rate]
  );

  const getSymbol = useCallback(() => (state.current === 'BS' ? 'Bs.' : '$'), [state.current]);

  return (
    <CurrencyContext.Provider value={{ ...state, toggle, format, getSymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
