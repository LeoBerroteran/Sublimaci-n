'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'subli_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme: Theme = prefersDark ? 'dark' : 'light';
        setThemeState(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
      }
    } catch {
      // Fallback
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch { /* ignore */ }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const nextTheme: Theme = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
      } catch { /* ignore */ }
      return nextTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode: theme === 'dark',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Return safe fallback if used outside provider
    return {
      theme: 'light' as Theme,
      isDarkMode: false,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return ctx;
}
