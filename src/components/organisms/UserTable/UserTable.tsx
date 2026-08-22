'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/atoms/Button/Button';
import Modal from '@/components/organisms/Modal/Modal';
import FormField from '@/components/molecules/FormField/FormField';
import { User } from '@/types';
import { validateName, validateLastName, validateEmail } from '@/lib/validators';
import { Edit2, Trash2, ShieldCheck, UserCheck, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function UserTable() {
  const { getUsers, updateUser, deleteUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'cliente'>('cliente');
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async (showFeedback = false) => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      if (showFeedback) {
        showToast('Lista de usuarios actualizada', 'success');
      }
    } catch {
      if (showFeedback) {
        showToast('Error al actualizar usuarios', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [getUsers, showToast]);

  useEffect(() => {
    loadUsers(false);
  }, [loadUsers]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter((u) => {
      const fullName = `${u.name || ''} ${u.last_name || ''}`.toLowerCase();
      const email = (u.email || u.mail || '').toLowerCase();
      const role = (u.role || '').toLowerCase();
      return fullName.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [users, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name || '');
    setEditLastName(user.last_name || '');
    setEditEmail(user.email || user.mail || '');
    setEditRole(user.role);
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const nameValidation = validateName(editName);
    if (!nameValidation.valid) {
      showToast(nameValidation.message, 'error');
      return;
    }

    if (editLastName.trim()) {
      const lastNameValidation = validateLastName(editLastName);
      if (!lastNameValidation.valid) {
        showToast(lastNameValidation.message, 'error');
        return;
      }
    }

    const emailValidation = validateEmail(editEmail);
    if (!emailValidation.valid) {
      showToast(emailValidation.message, 'error');
      return;
    }

    setSaving(true);
    const identifier = editingUser.id || editingUser.email || editingUser.mail || '';
    const res = await updateUser(identifier, {
      name: editName.trim(),
      last_name: editLastName.trim(),
      email: editEmail.trim(),
      role: editRole,
    });
    setSaving(false);

    if (res.success) {
      showToast(res.message, 'success');
      handleCloseEdit();
      await loadUsers();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleDelete = async (identifier: string, email: string) => {
    if (confirm(`¿Estás seguro de eliminar permanentemente al usuario "${email}" de la base de datos?`)) {
      const res = await deleteUser(identifier);
      if (res.success) {
        showToast(res.message, 'success');
        await loadUsers();
      } else {
        showToast(res.message, 'error');
      }
    }
  };

  const isPrimaryAdmin = editingUser?.email === 'admin@subli.com' || editingUser?.mail === 'admin@subli.com';

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)', margin: 0, color: 'var(--dark)' }}>
          Gestión de Usuarios ({users.length})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadUsers(true)}
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {/* SEARCH BAR */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '440px' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '14px',
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
          placeholder="Buscar por nombre, apellido, correo o rol..."
          style={{
            width: '100%',
            padding: '10px 16px 10px 42px',
            borderRadius: 'var(--radius-sm)',
            border: '2px solid var(--neutral-dark)',
            backgroundColor: 'var(--white)',
            color: 'var(--text)',
            fontSize: '0.92rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* DESKTOP USERS TABLE */}
      <div className="admin-table-wrapper desktop-admin-table">
        <table className="admin-table">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--neutral)', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>Nombre y Apellido</th>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>Rol</th>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                  Cargando usuarios desde Supabase...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                  {searchQuery ? 'No se encontraron usuarios coincidentes.' : 'No se encontraron usuarios registrados.'}
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => {
                const uEmail = u.email || u.mail || '';
                const uId = u.id || uEmail;
                return (
                  <tr key={uId} style={{ borderBottom: '1px solid var(--neutral)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--dark)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {u.role === 'admin' ? <ShieldCheck size={18} style={{ color: 'var(--primary)' }} /> : <UserCheck size={18} style={{ color: 'var(--text-lighter)' }} />}
                        {u.name} {u.last_name ? u.last_name : ''}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-light)' }}>{uEmail}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: u.role === 'admin' ? 'var(--primary)' : 'var(--neutral)',
                          color: u.role === 'admin' ? '#ffffff' : 'var(--dark)',
                        }}
                      >
                        {u.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(u)}>
                          <Edit2 size={14} /> Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={uEmail === 'admin@subli.com'}
                          onClick={() => handleDelete(uId, uEmail)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE USERS CARDS VIEW */}
      <div className="mobile-admin-cards">
        {loading && users.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
            Cargando usuarios desde Supabase...
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
            {searchQuery ? 'No se encontraron usuarios coincidentes.' : 'No hay usuarios registrados.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paginatedUsers.map((u) => {
              const uEmail = u.email || u.mail || '';
              const uId = u.id || uEmail;
              return (
                <div
                  key={uId}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '16px',
                    backgroundColor: 'var(--neutral-light)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--neutral-dark)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {u.role === 'admin' ? <ShieldCheck size={16} style={{ color: 'var(--primary)' }} /> : <UserCheck size={16} style={{ color: 'var(--text-lighter)' }} />}
                      {u.name} {u.last_name ? u.last_name : ''}
                    </div>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: u.role === 'admin' ? 'var(--primary)' : 'var(--neutral)',
                        color: u.role === 'admin' ? '#ffffff' : 'var(--dark)',
                      }}
                    >
                      {u.role === 'admin' ? 'Admin' : 'Cliente'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-light)', wordBreak: 'break-all' }}>
                    {uEmail}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(u)} fullWidth style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Edit2 size={14} /> Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={uEmail === 'admin@subli.com'}
                      onClick={() => handleDelete(uId, uEmail)}
                      style={{ padding: '8px 16px' }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
            Mostrando {Math.min(filteredUsers.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(filteredUsers.length, currentPage * ITEMS_PER_PAGE)} de {filteredUsers.length} usuarios
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--neutral-dark)',
                backgroundColor: 'var(--white)',
                color: 'var(--text)',
                fontSize: '0.85rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
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
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  border: pageNum === currentPage ? '2px solid var(--primary)' : '1px solid var(--neutral-dark)',
                  backgroundColor: pageNum === currentPage ? 'var(--primary)' : 'var(--white)',
                  color: pageNum === currentPage ? '#ffffff' : 'var(--text)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
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
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--neutral-dark)',
                backgroundColor: 'var(--white)',
                color: 'var(--text)',
                fontSize: '0.85rem',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      <Modal isOpen={!!editingUser} onClose={handleCloseEdit}>
        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, color: 'var(--dark)', fontSize: '1.35rem', fontWeight: 700 }}>
            Editar Usuario: {editingUser?.name} {editingUser?.last_name || ''}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <FormField
              label="Nombre"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              disabled={saving}
            />

            <FormField
              label="Apellido"
              type="text"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
              disabled={saving}
            />
          </div>

          <FormField
            label="Correo Electrónico"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
            disabled={saving || isPrimaryAdmin}
          />

          <div>
            <label htmlFor="user-role-select" style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--dark)' }}>
              Rol de Usuario:
            </label>
            <select
              id="user-role-select"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as 'admin' | 'cliente')}
              disabled={saving || isPrimaryAdmin}
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
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            {isPrimaryAdmin && (
              <small style={{ color: 'var(--text-light)', display: 'block', marginTop: '6px' }}>
                El rol del Administrador Principal no puede ser modificado.
              </small>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button type="button" variant="outline" onClick={handleCloseEdit} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
