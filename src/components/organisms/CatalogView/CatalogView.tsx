'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid';
import { fetchProducts } from '@/data/products';
import { Product } from '@/types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

interface CatalogViewProps {
  initialProducts: Product[];
}

export default function CatalogView({ initialProducts }: CatalogViewProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'sublimacion' | 'papeleria'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const gridTopRef = useRef<HTMLDivElement>(null);

  // Sync with Supabase client-side if updated
  useEffect(() => {
    let isMounted = true;
    async function refreshCatalog() {
      try {
        const data = await fetchProducts();
        if (isMounted && data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error refreshing catalog:', err);
      }
    }
    refreshCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset to page 1 whenever search or category changes
  const handleCategoryChange = (cat: 'todos' | 'sublimacion' | 'papeleria') => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const prodCat = (product.category || '').toLowerCase();
      const matchesCategory =
        selectedCategory === 'todos' ||
        prodCat === selectedCategory ||
        (selectedCategory === 'sublimacion' && prodCat.includes('subli')) ||
        (selectedCategory === 'papeleria' && prodCat.includes('pape'));

      const matchesSearch =
        !q ||
        (product.name || '').toLowerCase().includes(q) ||
        (product.description || '').toLowerCase().includes(q) ||
        prodCat.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const goToPage = (page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPillStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 22px',
    borderRadius: '24px',
    border: `2px solid ${isActive ? 'var(--primary)' : 'var(--neutral-dark)'}`,
    backgroundColor: isActive ? 'var(--primary)' : 'var(--white)',
    color: isActive ? '#ffffff' : 'var(--text)',
    fontWeight: 600,
    fontSize: '0.92rem',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive ? '0 4px 14px rgba(169, 115, 130, 0.35)' : '0 2px 6px var(--shadow)',
    userSelect: 'none',
  });

  return (
    <div className="container" style={{ padding: '40px 16px 80px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', color: 'var(--dark)', marginBottom: '8px', fontWeight: 800 }}>
          Nuestros Productos
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
          Explora nuestro catálogo completo de sublimación y papelería personalizada
        </p>

        {/* Live Search Input with Integrated Icon */}
        <div style={{ maxWidth: '520px', margin: '0 auto 24px', position: 'relative' }}>
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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por nombre, descripción..."
            style={{
              width: '100%',
              padding: '13px 20px 13px 48px',
              borderRadius: '28px',
              border: '2px solid var(--neutral-dark)',
              backgroundColor: 'var(--white)',
              color: 'var(--text)',
              fontSize: '0.98rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px var(--shadow)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            style={getPillStyle(selectedCategory === 'todos')}
            onClick={() => handleCategoryChange('todos')}
          >
            Todos ({products.length})
          </button>
          <button
            type="button"
            style={getPillStyle(selectedCategory === 'sublimacion')}
            onClick={() => handleCategoryChange('sublimacion')}
          >
            ☕ Sublimación
          </button>
          <button
            type="button"
            style={getPillStyle(selectedCategory === 'papeleria')}
            onClick={() => handleCategoryChange('papeleria')}
          >
            📓 Papelería
          </button>
        </div>
      </div>

      <div ref={gridTopRef} style={{ scrollMarginTop: '90px' }}>
        {paginatedProducts.length > 0 ? (
          <>
            <ProductGrid products={paginatedProducts} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  marginTop: '44px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid var(--neutral-dark)',
                      backgroundColor: 'var(--white)',
                      color: 'var(--text)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px var(--shadow)',
                    }}
                  >
                    <ChevronLeft size={18} /> Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => goToPage(pageNum)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          border: isActive ? '2px solid var(--primary)' : '1px solid var(--neutral-dark)',
                          backgroundColor: isActive ? 'var(--primary)' : 'var(--white)',
                          color: isActive ? '#ffffff' : 'var(--text)',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isActive ? '0 3px 10px rgba(169, 115, 130, 0.35)' : '0 2px 6px var(--shadow)',
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid var(--neutral-dark)',
                      backgroundColor: 'var(--white)',
                      color: 'var(--text)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px var(--shadow)',
                    }}
                  >
                    Siguiente <ChevronRight size={18} />
                  </button>
                </div>

                <span style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
                  Página {currentPage} de {totalPages} ({filteredProducts.length} productos en total)
                </span>
              </div>
            )}
          </>
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
    </div>
  );
}
