'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, lastName?: string) => Promise<{ success: boolean; message: string }>;
  getUsers: () => Promise<User[]>;
  updateUser: (userIdOrEmail: string, updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userIdOrEmail: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: { name?: string; lastName?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (authUserId?: string, email?: string, userMetadata?: any): Promise<User | null> => {
    try {
      const supabase = createClient();
      let query = supabase.from('Users').select('*');
      if (authUserId) {
        query = query.eq('id', authUserId);
      } else if (email) {
        query = query.eq('mail', email);
      } else {
        return null;
      }

      const { data, error } = await query.maybeSingle();

      const metaName = userMetadata?.name || userMetadata?.full_name || '';
      const metaLastName = userMetadata?.last_name || '';

      if (error || !data) {
        if (email) {
          // If no row in Users table by ID, check if there's a row by mail
          const { data: mailData } = await supabase.from('Users').select('*').eq('mail', email).maybeSingle();
          if (mailData && mailData.name) {
            return {
              id: mailData.id || authUserId,
              name: mailData.name,
              last_name: mailData.last_name || metaLastName || '',
              email: mailData.mail || email,
              mail: mailData.mail || email,
              role: (mailData.role === 'admin' || email === 'admin@subli.com') ? 'admin' : 'cliente',
              creation_date: mailData.creation_date,
              update_date: mailData.update_date,
              deleted: mailData.deleted,
            };
          }

          const isAdmin = email === 'admin@subli.com';
          const resolvedName = metaName || (email ? email.split('@')[0] : 'Usuario');
          return {
            id: authUserId,
            name: resolvedName,
            last_name: metaLastName || '',
            email,
            mail: email,
            role: isAdmin ? 'admin' : 'cliente',
          };
        }
        return null;
      }

      const finalName = data.name || metaName || (email ? email.split('@')[0] : 'Usuario');
      const finalLastName = data.last_name || metaLastName || '';

      return {
        id: data.id || authUserId,
        name: finalName,
        last_name: finalLastName,
        email: data.mail || email || '',
        mail: data.mail || email || '',
        role: data.role === 'admin' ? 'admin' : 'cliente',
        creation_date: data.creation_date,
        update_date: data.update_date,
        deleted: data.deleted,
      };
    } catch {
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        const profile = await fetchUserProfile(user.id, user.email, user.user_metadata);
        setCurrentUser(profile);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (isMounted) {
          if (user) {
            const profile = await fetchUserProfile(user.id, user.email, user.user_metadata);
            setCurrentUser(profile);
          } else {
            setCurrentUser(null);
          }
        }
      } catch {
        if (isMounted) setCurrentUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
        if (!isMounted) return;
        try {
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id, session.user.email, session.user.user_metadata);
            setCurrentUser(profile);
          } else {
            setCurrentUser(null);
          }
        } catch {
          setCurrentUser(null);
        } finally {
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } catch {
      return () => {
        isMounted = false;
      };
    }
  }, [fetchUserProfile]);

  const login = useCallback(async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: pass,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, message: 'Correo o contraseña incorrectos' };
        }
        return { success: false, message: error.message };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id, data.user.email, data.user.user_metadata);
        setCurrentUser(profile);
      }

      return { success: true, message: 'Inicio de sesión exitoso' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error al iniciar sesión' };
    }
  }, [fetchUserProfile]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      setCurrentUser(null);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, pass: string, lastName?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      const cleanLastName = (lastName || '').trim();

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            name: cleanName,
            last_name: cleanLastName,
            full_name: `${cleanName} ${cleanLastName}`.trim(),
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          return { success: false, message: 'Ya existe una cuenta con este correo electrónico' };
        }
        return { success: false, message: error.message };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id, data.user.email, data.user.user_metadata);
        setCurrentUser(profile);
      }

      return { success: true, message: 'Cuenta creada exitosamente. Si la confirmación está activa, por favor revisa tu correo electrónico.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error al registrar usuario' };
    }
  }, [fetchUserProfile]);

  const getUsers = useCallback(async (): Promise<User[]> => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('Error fetching users from API:', data.error || res.statusText);
        return [];
      }
      const data = await res.json();
      return data.users || [];
    } catch (err) {
      console.error('Network error fetching users:', err);
      return [];
    }
  }, []);

  const updateUser = useCallback(async (userIdOrEmail: string, updates: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userIdOrEmail)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, message: data.error || 'Error al actualizar usuario' };
      }
      return { success: true, message: data.message || 'Usuario actualizado con éxito' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar usuario';
      return { success: false, message };
    }
  }, []);

  const deleteUser = useCallback(async (userIdOrEmail: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userIdOrEmail)}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, message: data.error || 'Error al eliminar usuario' };
      }
      return { success: true, message: data.message || 'Usuario eliminado permanentemente' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar usuario';
      return { success: false, message };
    }
  }, []);

  const updateProfile = useCallback(async (updates: { name?: string; lastName?: string; email?: string; currentPassword?: string; newPassword?: string }): Promise<{ success: boolean; message: string }> => {
    try {
      if (!currentUser) return { success: false, message: 'No hay sesión activa' };

      const supabase = createClient();
      const authUpdates: any = {};
      if (updates.email && updates.email !== currentUser.email) {
        authUpdates.email = updates.email;
      }
      if (updates.newPassword) {
        authUpdates.password = updates.newPassword;
      }
      if (updates.name || updates.lastName !== undefined) {
        authUpdates.data = {
          ...(updates.name ? { name: updates.name.trim() } : {}),
          ...(updates.lastName !== undefined ? { last_name: updates.lastName.trim() } : {}),
        };
      }

      if (Object.keys(authUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(authUpdates);
        if (authError) return { success: false, message: authError.message };
      }

      if (updates.name || updates.lastName !== undefined || updates.email) {
        const dbUpdates: any = { update_date: new Date().toISOString() };
        if (updates.name) dbUpdates.name = updates.name.trim();
        if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName.trim();
        if (updates.email) dbUpdates.mail = updates.email.trim();

        if (currentUser.id) {
          await supabase.from('Users').update(dbUpdates).eq('id', currentUser.id);
        } else {
          await supabase.from('Users').update(dbUpdates).eq('mail', currentUser.email);
        }
      }

      await refreshUser();
      return { success: true, message: 'Perfil actualizado con éxito' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error al actualizar perfil' };
    }
  }, [currentUser, refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        loading,
        login,
        logout,
        register,
        getUsers,
        updateUser,
        deleteUser,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
