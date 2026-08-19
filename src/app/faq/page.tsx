'use client';

import FAQItem from '@/components/molecules/FAQItem/FAQItem';
import { FAQ_DATA } from '@/data/faq';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon/WhatsAppIcon';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import JsonLd from '@/components/atoms/JsonLd/JsonLd';

export default function FAQPage() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleWhatsAppContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('Inicia sesión para contactar por WhatsApp', 'info');
      router.push('/login');
      return;
    }
    window.open('https://wa.me/584243695379', '_blank', 'noopener,noreferrer');
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <div className="container" style={{ padding: '60px 20px 80px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--dark)' }}>
            Preguntas Frecuentes
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
            Resolvemos tus dudas más comunes sobre sublimación, papelería y pedidos personalizados
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQ_DATA.map((item, idx) => (
            <FAQItem key={idx} question={item.q} answer={item.a} />
          ))}
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '50px',
            padding: '30px',
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius)',
            boxShadow: '0 2px 12px var(--shadow)',
          }}
        >
          <h3 style={{ marginBottom: '15px', color: 'var(--dark)' }}>¿Aún tienes dudas?</h3>
          <p style={{ marginBottom: '20px', color: 'var(--text-light)' }}>
            Contáctanos directamente y te ayudaremos en lo que necesites.
          </p>
          <button
            type="button"
            onClick={handleWhatsAppContact}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#25D366',
              color: '#ffffff',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            <WhatsAppIcon size={20} color="#ffffff" /> Contactar por WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
