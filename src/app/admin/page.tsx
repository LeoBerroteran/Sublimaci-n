import type { Metadata } from 'next';
import AdminClientView from '@/components/organisms/AdminClientView/AdminClientView';
import { createClient } from '@/lib/supabase/server';
import { fetchProducts } from '@/data/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Panel de Administración | Sublilove',
  description: 'Panel de administración y gestión de Sublilove.',
};

export default async function AdminPage() {
  let productsCount = 13;
  let usersCount = 4;

  try {
    const supabase = await createClient();
    const [prodsRes, usersRes] = await Promise.all([
      supabase.from('Products').select('*', { count: 'exact', head: true }).eq('deleted', false),
      supabase.from('Users').select('*', { count: 'exact', head: true }).eq('deleted', false),
    ]);

    if (prodsRes.count !== null && prodsRes.count !== undefined) {
      productsCount = prodsRes.count;
    } else {
      const allProds = await fetchProducts();
      productsCount = allProds.length;
    }

    if (usersRes.count !== null && usersRes.count !== undefined) {
      usersCount = usersRes.count;
    }
  } catch (err) {
    console.error('Error fetching admin counts on server:', err);
  }

  return (
    <AdminClientView
      initialProductsCount={productsCount}
      initialUsersCount={usersCount}
    />
  );
}
