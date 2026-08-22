import HeroSection from '@/components/organisms/HeroSection/HeroSection';
import CategoryCards from '@/components/organisms/CategoryCards/CategoryCards';
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid';
import CtaWhatsAppButton from '@/components/molecules/CtaWhatsAppButton/CtaWhatsAppButton';
import { fetchProducts } from '@/data/products';
import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const allProducts = await fetchProducts();
  const featured = allProducts.filter((p) => p.featured);
  const displayProducts = featured.length > 0 ? featured : allProducts.slice(0, 6);

  return (
    <>
      <HeroSection />

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Explora Nuestras Categorías</h2>
          <p className={styles.sectionSubtitle}>
            Encuentra el producto perfecto para cada ocasión
          </p>
          <CategoryCards />
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Nuestros Productos</h2>
          <p className={styles.sectionSubtitle}>
            Los favoritos de nuestros clientes
          </p>
          <ProductGrid products={displayProducts} />
          <div className={styles.viewMore}>
            <Link href="/catalogo" className={styles.viewMoreBtn}>
              Ver más →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitle}>¿Tienes un diseño en mente?</h2>
          <p className={styles.ctaText}>
            Contáctanos y te ayudamos a hacerlo realidad. Diseño personalizado sin costo adicional.
          </p>
          <CtaWhatsAppButton className={styles.ctaButton} />
        </div>
      </section>
    </>
  );
}
