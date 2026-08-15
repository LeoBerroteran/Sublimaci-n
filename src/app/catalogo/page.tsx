'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid';
import { fetchProducts } from '@/data/products';
import { Product } from '@/types';
import { Search, RefreshCw } from 'lucide-react';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'sublimacion' | 'papeleria'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const loadCatalog = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'todos' || product.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const getPillStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 24px',
    borderRadius: '24px',
    border: `2px solid ${isActive ? 'var(--primary)' : 'var(--neutral-dark)'}`,
    backgroundColor: isActive ? 'var(--primary)' : 'var(--white)',
    color: isActive ? '#ffffff' : 'var(--text)',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive ? '0 4px 14px rgba(169, 115, 130, 0.35)' : '0 2px 6px rgba(0,0,0,0.04)',
  });

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <h1 style={{ fontSize: '2.6rem', color: 'var(--dark)', marginBottom: '8px', fontWeight: 800 }}>
          Nuestros Productos
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '32px' }}>
          Explora nuestro catálogo completo de sublimación y papelería personalizada
        </p>

        {/* Live Search Input with Integrated Icon */}
        <div style={{ maxWidth: '520px', margin: '0 auto 32px', position: 'relative' }}>
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--primary)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, descripción..."
            style={{
              width: '100%',
              padding: '14px 20px 14px 50px',
              borderRadius: '28px',
              border: '2px solid var(--neutral-dark)',
              backgroundColor: 'var(--white)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            style={getPillStyle(selectedCategory === 'todos')}
            onClick={() => setSelectedCategory('todos')}
          >
            Todos ({products.length})
          </button>
          <button
            type="button"
            style={getPillStyle(selectedCategory === 'sublimacion')}
            onClick={() => setSelectedCategory('sublimacion')}
          >
            ☕ Sublimación
          </button>
          <button
            type="button"
            style={getPillStyle(selectedCategory === 'papeleria')}
            onClick={() => setSelectedCategory('papeleria')}
          >
            📓 Papelería
          </button>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p>Cargando catálogo desde Supabase...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius)',
            boxShadow: '0 2px 12px var(--shadow)',
          }}
        >
          <h3 style={{ color: 'var(--dark)', marginBottom: '8px' }}>No se encontraron productos</h3>
          <p style={{ color: 'var(--text-light)' }}>
            Intenta con otros términos de búsqueda o selecciona otra categoría.
          </p>
        </div>
      )}
    </div>
  );
}
