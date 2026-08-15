'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/atoms/Button/Button';
import Badge from '@/components/atoms/Badge/Badge';
import Modal from '@/components/organisms/Modal/Modal';
import FormField from '@/components/molecules/FormField/FormField';
import { User } from '@/types';
import { Edit2, Trash2, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

export default function UserTable() {
  const { getUsers, updateUser, deleteUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'cliente'>('cliente');
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  }, [getUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email || user.mail || '');
    setEditRole(user.role);
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSaving(true);
    const identifier = editingUser.id || editingUser.email || editingUser.mail || '';
    const res = await updateUser(identifier, {
      name: editName,
      email: editEmail,
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
    if (confirm(`¿Estás seguro de eliminar al usuario ${email}?`)) {
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
    <div className="admin-card" style={{ backgroundColor: 'var(--white)', padding: '28px', borderRadius: 'var(--radius)', boxShadow: '0 2px 12px var(--shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--dark)' }}>Gestión de Usuarios</h2>
        <Button variant="outline" size="sm" onClick={loadUsers} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
        </Button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--neutral)', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left' }}>Nombre</th>
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                  No se encontraron usuarios registrados.
                </td>
              </tr>
            ) : (
              users.map((u) => {
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

      {/* EDIT USER MODAL */}
      <Modal isOpen={!!editingUser} onClose={handleCloseEdit}>
        {editingUser && (
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
            <h3 style={{ margin: 0, color: 'var(--dark)', fontSize: '1.4rem' }}>
              Editar Usuario: {editingUser.name}
            </h3>

            {isPrimaryAdmin && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--warning)', backgroundColor: 'rgba(255, 152, 0, 0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                ⚠ Cuenta de Administrador Principal. El email y el rol están protegidos.
              </p>
            )}

            <FormField
              label="Nombre Completo"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              disabled={saving}
            />

            <FormField
              label="Correo Electrónico"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              disabled={isPrimaryAdmin || saving}
              required
            />

            <div>
              <label htmlFor="role-select" style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: 'var(--dark)' }}>
                Rol de Usuario:
              </label>
              <select
                id="role-select"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as 'admin' | 'cliente')}
                disabled={isPrimaryAdmin || saving}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--neutral-dark)',
                  backgroundColor: isPrimaryAdmin ? 'var(--neutral-light)' : 'var(--white)',
                  fontSize: '1rem',
                }}
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
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
        )}
      </Modal>
    </div>
  );
}
