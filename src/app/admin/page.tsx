'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import AdminLayout from '@/components/templates/AdminLayout/AdminLayout';
import StatCard from '@/components/molecules/StatCard/StatCard';
import ProductTable from '@/components/organisms/ProductTable/ProductTable';
import UserTable from '@/components/organisms/UserTable/UserTable';
import SettingsPanel from '@/components/organisms/SettingsPanel/SettingsPanel';
import { fetchProducts } from '@/data/products';
import { useCurrency } from '@/context/CurrencyContext';

function AdminContent() {
  const { isAdmin, isLoggedIn, getUsers } = useAuth();
  const { rate } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'dashboard' | 'products' | 'users' | 'settings' | null;

  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'users' | 'settings'>('dashboard');
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

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

  useEffect(() => {
    async function loadStats() {
      try {
        const [users, prods] = await Promise.all([getUsers(), fetchProducts()]);
        setUsersCount(users.length);
        setProductsCount(prods.length);
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    }
    if (isLoggedIn && isAdmin) {
      loadStats();
    }
  }, [isLoggedIn, isAdmin, getUsers]);

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

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Cargando panel de administración...</div>}>
      <AdminContent />
    </Suspense>
  );
}
