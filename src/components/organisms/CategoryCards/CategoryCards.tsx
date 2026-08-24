import React from 'react';
import Link from 'next/link';

export default function CategoryCards() {
  return (
    <div className="categories-section">
      <Link href="/catalogo?categoria=sublimacion" className="category-card cat-sublimacion">
        <div className="category-card-overlay">
          <h3>Sublimación</h3>
          <p>Tazas, camisetas, gorras, termos, mousepads y cojines personalizados con tus diseños favoritos.</p>
        </div>
      </Link>

      <Link href="/catalogo?categoria=papeleria" className="category-card cat-papeleria">
        <div className="category-card-overlay">
          <h3>Papelería</h3>
          <p>Agendas, cuadernos, planners, hojas blancas, stickers y útiles personalizados de alta calidad.</p>
        </div>
      </Link>
    </div>
  );
}
