'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar/Navbar';
import Footer from '@/components/organisms/Footer/Footer';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={`${styles.main} ${isAdminRoute ? styles.adminMain : ''}`}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
