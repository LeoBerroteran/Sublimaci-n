'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid';
import { fetchProducts } from '@/data/products';
import { Product } from '@/types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

interface CatalogViewProps {
  initialProducts: Product[];
  initialCategory?: string;
}

const parseCategory = (cat: string | null | undefined): 'todos' | 'sublimacion' | 'papeleria' => {
  if (!cat) return 'todos';
  const lower = cat.toLowerCase().trim();
  if (lower.includes('subli')) return 'sublimacion';
  if (lower.includes('pape')) return 'papeleria';
  return 'todos';
};

export default function CatalogView({ initialProducts, initialCategory }: CatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('categoria') || searchParams.get('cat') || searchParams.get('category') || initialCategory;

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'sublimacion' | 'papeleria'>(() => parseCategory(catParam));
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const gridTopRef = useRef<HTMLDivElement>(null);

  // Sync category state whenever URL search param changes
  useEffect(() => {
    const currentParam = searchParams.get('categoria') || searchParams.get('cat') || searchParams.get('category');
    setSelectedCategory(parseCategory(currentParam));
    setCurrentPage(1);
  }, [searchParams]);

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

  // Reset to page 1 whenever search or category changes & update URL
  const handleCategoryChange = (cat: 'todos' | 'sublimacion' | 'papeleria') => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    const newUrl = cat === 'todos' ? '/catalogo' : `/catalogo?categoria=${cat}`;
    router.replace(newUrl, { scroll: false });
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
    if (targetPage === currentPage) return;

    if (typeof window !== 'undefined') {
      if (gridTopRef.current) {
        const rect = gridTopRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = Math.max(0, rect.top + scrollTop - 90);
        window.scrollTo({ top: targetY, behavior: 'instant' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }

    setCurrentPage(targetPage);
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

      <div
        ref={gridTopRef}
        style={{
          scrollMarginTop: '90px',
          minHeight: '620px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {paginatedProducts.length > 0 ? (
          <div>
            <ProductGrid products={paginatedProducts} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  marginTop: '48px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '7px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--neutral-dark)',
                    backgroundColor: 'var(--white)',
                    color: 'var(--text)',
                    fontSize: '0.85rem',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ChevronLeft size={16} /> Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: 'var(--radius-sm)',
                      border: pageNum === currentPage ? 'none' : '1px solid var(--neutral-dark)',
                      backgroundColor: pageNum === currentPage ? 'var(--primary)' : 'var(--white)',
                      color: pageNum === currentPage ? '#ffffff' : 'var(--text)',
                      fontWeight: pageNum === currentPage ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '7px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--neutral-dark)',
                    backgroundColor: 'var(--white)',
                    color: 'var(--text)',
                    fontSize: '0.85rem',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
              No encontramos productos que coincidan con tu búsqueda.
            </p>
            <p style={{ fontSize: '0.95rem' }}>
              Intenta con otro término o limpia los filtros.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
