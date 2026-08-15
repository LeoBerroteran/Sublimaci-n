'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/organisms/AdminSidebar/AdminSidebar';

export interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onNavigate?: (section: any) => void;
}

export default function AdminLayout({
  children,
  activeSection = 'dashboard',
  onNavigate = () => {},
}: AdminLayoutProps) {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        minHeight: 'calc(100vh - 72px)',
        width: '100%',
        backgroundColor: 'var(--bg)',
      }}
    >
      <AdminSidebar activeSection={activeSection} onNavigate={onNavigate} />
      <div style={{ padding: '36px', overflowY: 'auto' }}>{children}</div>
    </div>
  );
}
