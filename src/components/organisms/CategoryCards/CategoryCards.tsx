import React from 'react';
import Link from 'next/link';

export default function CategoryCards() {
  return (
    <div className="categories-section">
      <Link href="/catalogo" className="category-card cat-sublimacion">
        <div className="category-card-overlay">
          <div className="category-card-icon">☕</div>
          <h3>Sublimación</h3>
          <p>Tazas, camisetas, termos, mousepads y cojines personalizados con tus diseños favoritos.</p>
        </div>
      </Link>

      <Link href="/catalogo" className="category-card cat-papeleria">
        <div className="category-card-overlay">
          <div className="category-card-icon">📓</div>
          <h3>Papelería</h3>
          <p>Agendas, cuadernos, planners, stickers, sobres y tarjetas personalizadas de alta calidad.</p>
        </div>
      </Link>
    </div>
  );
}
