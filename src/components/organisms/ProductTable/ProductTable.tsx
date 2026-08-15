'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchProducts, mapDbProductToProduct } from '@/data/products';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/atoms/Button/Button';
import Badge from '@/components/atoms/Badge/Badge';
import PriceTag from '@/components/atoms/PriceTag/PriceTag';
import Modal from '@/components/organisms/Modal/Modal';
import FormField from '@/components/molecules/FormField/FormField';
import { useToast } from '@/hooks/useToast';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';

export default function ProductTable() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'sublimacion' | 'papeleria'>('sublimacion');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [printArea, setPrintArea] = useState('');
  const [badge, setBadge] = useState<'Popular' | 'Nuevo' | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProductList(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategory('sublimacion');
    setPrice(10);
    setDescription('');
    setMaterials('');
    setPrintArea('');
    setBadge(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory((product.category as 'sublimacion' | 'papeleria') || 'sublimacion');
    setPrice(product.price);
    setDescription(product.description);
    setMaterials(product.materials || '');
    setPrintArea(product.printArea || product.print_area || '');
    setBadge(product.badge as 'Popular' | 'Nuevo' | null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || price <= 0) {
      showToast('Por favor completa el nombre y un precio válido', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingProduct) {
        // Edit existing product in Supabase
        const { error } = await supabase
          .from('Products')
          .update({
            name,
            category,
            base_price: Number(price),
            discount_price: Number(price),
            description,
            materials,
            print_area: printArea,
            badge,
            update_date: new Date().toISOString(),
          })
          .eq('id', editingProduct.id);

        if (error) {
          showToast(`Error al actualizar: ${error.message}`, 'error');
        } else {
          showToast(`Producto "${name}" actualizado con éxito`, 'success');
          handleCloseModal();
          await loadProducts();
        }
      } else {
        // Add new product in Supabase
        const defaultImage = category === 'sublimacion' ? '/img/taza_personalizada.jpg' : '/img/cuaderno_personalizado.jpg';
        const defaultIcon = category === 'sublimacion' ? '☕' : '📓';

        const { error } = await supabase
          .from('Products')
          .insert({
            name,
            category,
            base_price: Number(price),
            discount_price: Number(price),
            description,
            materials,
            sizes: ['Estándar'],
            print_area: printArea,
            icon: defaultIcon,
            image: defaultImage,
            featured: false,
            badge,
            creation_date: new Date().toISOString(),
            update_date: new Date().toISOString(),
            deleted: false,
          });

        if (error) {
          showToast(`Error al crear producto: ${error.message}`, 'error');
        } else {
          showToast(`Producto "${name}" agregado con éxito`, 'success');
          handleCloseModal();
          await loadProducts();
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Error inesperado', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number, prodName: string) => {
    if (confirm(`¿Estás seguro de eliminar el producto "${prodName}"?`)) {
      try {
        const { error } = await supabase
          .from('Products')
          .update({ deleted: true, update_date: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          showToast(`Error al eliminar: ${error.message}`, 'error');
        } else {
          showToast(`Producto "${prodName}" eliminado`, 'info');
          await loadProducts();
        }
      } catch (err: any) {
        showToast(err.message || 'Error al eliminar', 'error');
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--white)', padding: '28px', borderRadius: 'var(--radius)', boxShadow: '0 2px 12px var(--shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--dark)' }}>Catálogo de Productos ({productList.length})</h2>
          <Button variant="outline" size="sm" onClick={loadProducts} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
          </Button>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Agregar Producto
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--neutral)', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Imagen</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Categoría</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Precio</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Insignia</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && productList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                  Cargando catálogo desde Supabase...
                </td>
              </tr>
            ) : productList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                  No hay productos registrados en el catálogo.
                </td>
              </tr>
            ) : (
              productList.map((product, index) => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--neutral)' }}>
                  <td style={{ padding: '12px', color: 'var(--text-light)' }}>{index + 1}</td>
                  <td style={{ padding: '12px' }}>
                    <img
                      src={product.image || '/img/logo.png'}
                      alt={product.name}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--dark)' }}>{product.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ textTransform: 'capitalize', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {product.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <PriceTag priceUSD={product.price} />
                  </td>
                  <td style={{ padding: '12px' }}>
                    {product.badge && (
                      <Badge type={String(product.badge).toLowerCase() === 'popular' ? 'popular' : 'nuevo'}>
                        {product.badge}
                      </Badge>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(product)}>
                        <Edit2 size={14} /> Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(product.id, product.name)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
          <h3 style={{ margin: 0, color: 'var(--dark)', fontSize: '1.4rem' }}>
            {editingProduct ? `Editar Producto: ${editingProduct.name}` : 'Agregar Nuevo Producto'}
          </h3>

          <FormField
            label="Nombre del Producto"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Taza Sublimada Personalizada"
            required
            disabled={saving}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="cat-select" style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--dark)' }}>
                Categoría:
              </label>
              <select
                id="cat-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as 'sublimacion' | 'papeleria')}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--neutral-dark)',
                  backgroundColor: 'var(--white)',
                  fontSize: '1rem',
                }}
              >
                <option value="sublimacion">Sublimación</option>
                <option value="papeleria">Papelería</option>
              </select>
            </div>

            <div>
              <label htmlFor="price-input" style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--dark)' }}>
                Precio ($ USD):
              </label>
              <input
                id="price-input"
                type="number"
                min="0.5"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--neutral-dark)',
                  backgroundColor: 'var(--white)',
                  fontSize: '1rem',
                }}
                required
              />
            </div>
          </div>

          <FormField
            label="Descripción"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción detallada del producto..."
            disabled={saving}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField
              label="Materiales"
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="Ej. Cerámica Blanca AAA"
              disabled={saving}
            />
            <FormField
              label="Área de Impresión"
              type="text"
              value={printArea}
              onChange={(e) => setPrintArea(e.target.value)}
              placeholder="Ej. 20cm x 9cm"
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="badge-select" style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--dark)' }}>
              Insignia / Badge (Opcional):
            </label>
            <select
              id="badge-select"
              value={badge || ''}
              onChange={(e) => setBadge(e.target.value ? (e.target.value as 'Popular' | 'Nuevo') : null)}
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid var(--neutral-dark)',
                backgroundColor: 'var(--white)',
                fontSize: '1rem',
              }}
            >
              <option value="">Sin insignia</option>
              <option value="Popular">Popular</option>
              <option value="Nuevo">Nuevo</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button type="button" variant="outline" onClick={handleCloseModal} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando...' : (editingProduct ? 'Guardar Cambios' : 'Agregar Producto')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
