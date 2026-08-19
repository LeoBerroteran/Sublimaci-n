'use client';

import React from 'react';
import Logo from '@/components/atoms/Logo/Logo';

export interface AdminSidebarProps {
  activeSection: string;
  onNavigate: (section: any) => void;
}

export default function AdminSidebar({ activeSection, onNavigate }: AdminSidebarProps) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Productos', icon: '📦' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' },
  ];

  return (
    <aside className="admin-sidebar-container">
      <div className="admin-sidebar-logo">
        <Logo size="sm" />
      </div>

      <nav className="admin-sidebar-nav">
        {items.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
