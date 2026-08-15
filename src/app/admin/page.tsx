'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/templates/AdminLayout/AdminLayout';
import StatCard from '@/components/molecules/StatCard/StatCard';
import ProductTable from '@/components/organisms/ProductTable/ProductTable';
import UserTable from '@/components/organisms/UserTable/UserTable';
import SettingsPanel from '@/components/organisms/SettingsPanel/SettingsPanel';
import { fetchProducts } from '@/data/products';
import { useCurrency } from '@/context/CurrencyContext';

export default function AdminPage() {
  const { isAdmin, isLoggedIn, getUsers } = useAuth();
  const { rate } = useCurrency();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'users' | 'settings'>('dashboard');
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

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

  return (
    <AdminLayout activeSection={activeSection} onNavigate={setActiveSection}>
      {activeSection === 'dashboard' && (
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', color: 'var(--dark)' }}>
            Panel de Administración
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <StatCard value={productsCount} label="Productos" icon="📦" />
            <StatCard value={usersCount} label="Usuarios Registrados" icon="👥" />
            <StatCard value={2} label="Categorías" icon="📂" />
            <StatCard value={`Bs. ${rate}`} label="Tasa BCV Oficial" icon="💱" />
          </div>
          <div style={{ backgroundColor: 'var(--white)', padding: '28px', borderRadius: 'var(--radius)', boxShadow: '0 2px 12px var(--shadow)' }}>
            <h3 style={{ marginBottom: '12px', color: 'var(--dark)' }}>Bienvenido al Panel de Control</h3>
            <p style={{ color: 'var(--text-light)', lineHeight: 1.6 }}>
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
