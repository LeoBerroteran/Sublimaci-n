'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/templates/AdminLayout/AdminLayout';
import StatCard from '@/components/molecules/StatCard/StatCard';
import ProductTable from '@/components/organisms/ProductTable/ProductTable';
import UserTable from '@/components/organisms/UserTable/UserTable';
import SettingsPanel from '@/components/organisms/SettingsPanel/SettingsPanel';
import { useCurrency } from '@/context/CurrencyContext';

interface AdminClientViewProps {
  initialProductsCount: number;
  initialUsersCount: number;
}

export default function AdminClientView({
  initialProductsCount,
  initialUsersCount,
}: AdminClientViewProps) {
  const { isAdmin, isLoggedIn } = useAuth();
  const { rate } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'dashboard' | 'products' | 'users' | 'settings' | null;

  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'users' | 'settings'>('dashboard');
  const [usersCount, setUsersCount] = useState<number>(initialUsersCount);
  const [productsCount, setProductsCount] = useState<number>(initialProductsCount);

  useEffect(() => {
    if (tabParam && ['dashboard', 'products', 'users', 'settings'].includes(tabParam)) {
      setActiveSection(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      router.push('/');
    }
  }, [isLoggedIn, isAdmin, router]);

  if (!isLoggedIn || !isAdmin) return null;

  const handleNavigate = (section: 'dashboard' | 'products' | 'users' | 'settings') => {
    setActiveSection(section);
    router.replace(`/admin?tab=${section}`);
  };

  const formattedRate = typeof rate === 'number' ? rate.toFixed(2) : Number(rate || 0).toFixed(2);

  return (
    <AdminLayout activeSection={activeSection} onNavigate={handleNavigate}>
      {activeSection === 'dashboard' && (
        <div className="admin-dashboard-container">
          <h2 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)', marginBottom: '18px', color: 'var(--dark)', fontWeight: 800 }}>
            Panel de Administración
          </h2>
          <div className="admin-stats-grid">
            <StatCard value={productsCount} label="Productos" icon="📦" />
            <StatCard value={usersCount} label="Usuarios Registrados" icon="👥" />
            <StatCard value={2} label="Categorías" icon="📂" />
            <StatCard value={`Bs. ${formattedRate}`} label="Tasa BCV Oficial" icon="💱" />
          </div>
          <div className="admin-card" style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: 'var(--radius)', boxShadow: '0 2px 12px var(--shadow)' }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--dark)', fontSize: '1.15rem' }}>Bienvenido al Panel de Control</h3>
            <p style={{ color: 'var(--text-light)', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
              Desde aquí puedes gestionar el catálogo de productos, consultar y editar usuarios registrados, y revisar la configuración del negocio con la tasa BCV actualizada automáticamente con Supabase.
            </p>
          </div>
        </div>
      )}

      {activeSection === 'products' && <ProductTable />}
      {activeSection === 'users' && <UserTable />}
      {activeSection === 'settings' && <SettingsPanel />}
    </AdminLayout>
  );
}
