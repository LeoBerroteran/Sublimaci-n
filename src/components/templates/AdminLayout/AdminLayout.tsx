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
    <div className="admin-grid-layout">
      <AdminSidebar activeSection={activeSection} onNavigate={onNavigate} />
      <div className="admin-main-content">{children}</div>
    </div>
  );
}
