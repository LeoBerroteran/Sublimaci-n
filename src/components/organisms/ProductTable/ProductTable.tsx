'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '@/data/products';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/atoms/Button/Button';
import Badge from '@/components/atoms/Badge/Badge';
import PriceTag from '@/components/atoms/PriceTag/PriceTag';
import Modal from '@/components/organisms/Modal/Modal';
import FormField from '@/components/molecules/FormField/FormField';
import { useToast } from '@/hooks/useToast';
import { Plus, Edit2, Trash2, RefreshCw, Image as ImageIcon, Upload } from 'lucide-react';

export default function ProductTable() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'sublimacion' | 'papeleria'>('sublimacion');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [printArea, setPrintArea] = useState('');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState<'Popular' | 'Nuevo' | null>(null);

  const loadProducts = useCallback(async (showFeedback = false) => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProductList(data);
      if (showFeedback) {
        showToast('Lista de productos actualizada', 'success');
      }
    } catch (err: any) {
      if (showFeedback) {
        showToast('Error al actualizar productos', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProducts(false);
  }, [loadProducts]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategory('sublimacion');
    setPrice(10);
    setDescription('');
    setMaterials('');
    setPrintArea('');
    setImage('/img/taza_personalizada.jpg');
    setBadge(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name || '');
    setCategory((product.category as 'sublimacion' | 'papeleria') || 'sublimacion');
    setPrice(product.price || 0);
    setDescription(product.description || '');
    setMaterials(product.materials || '');
    setPrintArea(product.printArea || product.print_area || '');
    setImage(product.image || '');
    setBadge((product.badge as 'Popular' | 'Nuevo') || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('La imagen debe ser menor a 2MB', 'warning');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || price <= 0) {
      showToast('Por favor completa el nombre y un precio válido', 'error');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const finalImage = image.trim() || (category === 'sublimacion' ? '/img/taza_personalizada.jpg' : '/img/cuaderno_personalizado.jpg');
      const defaultIcon = category === 'sublimacion' ? '☕' : '📓';

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
            image: finalImage,
            badge,
            update_date: new Date().toISOString(),
          })
          .eq('id', editingProduct.id);

        if (error) {
          showToast(`Error al actualizar: ${error.message}`, 'error');
        } else {
          showToast(`Producto "${name}" actualizado con éxito`, 'success');
          handleCloseModal();
          await loadProducts(false);
        }
      } else {
        // Add new product in Supabase
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
            image: finalImage,
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
          await loadProducts(false);
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
        const supabase = createClient();
        const { error } = await supabase
          .from('Products')
          .update({ deleted: true, update_date: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          showToast(`Error al eliminar: ${error.message}`, 'error');
        } else {
          showToast(`Producto "${prodName}" eliminado`, 'info');
          await loadProducts(false);
        }
      } catch (err: any) {
        showToast(err.message || 'Error al eliminar', 'error');
      }
    }
  };

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)', margin: 0, color: 'var(--dark)' }}>Catálogo de Productos ({productList.length})</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadProducts(true)}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Agregar Producto
        </Button>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="admin-table-wrapper desktop-admin-table">
        <table className="admin-table">
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
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--neutral)' }}
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

      {/* MOBILE PRODUCT CARDS VIEW */}
      <div className="mobile-admin-cards">
        {loading && productList.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
            Cargando catálogo desde Supabase...
          </div>
        ) : productList.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
            No hay productos registrados en el catálogo.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {productList.map((product) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: 'var(--neutral-light)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--neutral-dark)',
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={product.image || '/img/logo.png'}
                    alt={product.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--neutral-dark)', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ textTransform: 'capitalize', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {product.category}
                      </span>
                      {product.badge && (
                        <Badge type={String(product.badge).toLowerCase() === 'popular' ? 'popular' : 'nuevo'}>
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.name}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <PriceTag priceUSD={product.price} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '4px' }}>
                  <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(product)} fullWidth style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Edit2 size={14} /> Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(product.id, product.name)} style={{ padding: '8px 16px' }}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, color: 'var(--dark)', fontSize: '1.35rem', fontWeight: 700 }}>
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

          <div className="admin-form-row-2col">
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
                  outline: 'none',
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
                  outline: 'none',
                }}
                required
              />
            </div>
          </div>

          {/* IMAGE SECTION WITH PREVIEW & UPLOAD */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--dark)' }}>
              Imagen del Producto:
            </label>
            <div className="admin-image-upload-row">
              <div style={{ flex: 1, minWidth: '200px' }}>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="URL de imagen o ruta (/img/... o https://...)"
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '2px solid var(--neutral-dark)',
                    backgroundColor: 'var(--white)',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>
              <label
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px dashed var(--primary)',
                  backgroundColor: 'var(--neutral-light)',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  justifyContent: 'center',
                }}
              >
                <Upload size={16} /> Subir archivo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                  disabled={saving}
                />
              </label>
            </div>

            {/* Live Image Preview */}
            {image && (
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={image}
                  alt="Vista previa"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/img/logo.png';
                  }}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral-dark)',
                  }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  Vista previa de la imagen
                </span>
              </div>
            )}
          </div>

          <FormField
            label="Descripción"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción detallada del producto..."
            disabled={saving}
          />

          <div className="admin-form-row-2col">
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
                outline: 'none',
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
