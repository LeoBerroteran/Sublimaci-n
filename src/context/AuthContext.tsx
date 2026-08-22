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

  const fetchUserProfile = useCallback(async (authUserId?: string, email?: string): Promise<User | null> => {
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

      if (error || !data) {
        if (email) {
          const isAdmin = email === 'admin@subli.com';
          return {
            id: authUserId,
            name: email.split('@')[0],
            email,
            mail: email,
            role: isAdmin ? 'admin' : 'cliente',
          };
        }
        return null;
      }

      return {
        id: data.id,
        name: data.name || '',
        last_name: data.last_name || '',
        email: data.mail || email || '',
        mail: data.mail || email || '',
        role: (data.role === 'admin' ? 'admin' : 'cliente') as 'admin' | 'cliente',
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
        const profile = await fetchUserProfile(user.id, user.email);
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
            const profile = await fetchUserProfile(user.id, user.email);
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
            const profile = await fetchUserProfile(session.user.id, session.user.email);
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

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const supabase = createClient();
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, message: 'Correo o contraseña incorrectos' };
        }
        return { success: false, message: error.message };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id, data.user.email);
        setCurrentUser(profile);
      }

      return { success: true, message: 'Sesión iniciada correctamente' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error al iniciar sesión' };
    }
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setCurrentUser(null);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, lastName: string = ''): Promise<{ success: boolean; message: string }> => {
    try {
      const supabase = createClient();
      const cleanEmail = email.trim().toLowerCase();
      const siteUrl = typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || 'https://sublilove.com');

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: name.trim(),
            last_name: lastName.trim(),
          },
          emailRedirectTo: `${siteUrl}/login?confirmed=true`,
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        await supabase.from('Users').upsert({
          id: data.user.id,
          name: name.trim(),
          last_name: lastName.trim(),
          mail: cleanEmail,
          password: 'managed_by_auth',
          role: 'cliente',
          creation_date: new Date().toISOString(),
          update_date: new Date().toISOString(),
          deleted: false,
        }, { onConflict: 'id' }).select();

        const profile = await fetchUserProfile(data.user.id, data.user.email);
        setCurrentUser(profile);
      }

      return { success: true, message: 'Cuenta creada exitosamente. Si la confirmación está activa, por favor revisa tu correo electrónico.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error al registrar usuario' };
    }
  }, [fetchUserProfile]);

  const getUsers = useCallback(async (): Promise<User[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('deleted', false)
        .order('creation_date', { ascending: false });

      if (error || !data) return [];
      return data.map((u: any) => ({
        id: u.id,
        name: u.name || '',
        last_name: u.last_name || '',
        email: u.mail || '',
        mail: u.mail || '',
        role: (u.role === 'admin' ? 'admin' : 'cliente') as 'admin' | 'cliente',
        creation_date: u.creation_date,
        update_date: u.update_date,
        deleted: u.deleted,
      }));
    } catch {
      return [];
    }
  }, []);

  const updateUser = useCallback(async (userIdOrEmail: string, updates: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      const supabase = createClient();
      const dbUpdates: any = {
        update_date: new Date().toISOString(),
      };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.last_name !== undefined) dbUpdates.last_name = updates.last_name;
      if (updates.role !== undefined) dbUpdates.role = updates.role;
      if (updates.email !== undefined) dbUpdates.mail = updates.email;

      let query = supabase.from('Users').update(dbUpdates);
      if (userIdOrEmail.includes('@')) {
        query = query.eq('mail', userIdOrEmail);
      } else {
        query = query.eq('id', userIdOrEmail);
      }

      const { error } = await query;
      if (error) return { success: false, message: error.message };

      await refreshUser();
      return { success: true, message: 'Usuario actualizado con éxito' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error al actualizar usuario' };
    }
  }, [refreshUser]);

  const deleteUser = useCallback(async (userIdOrEmail: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (userIdOrEmail === 'admin@subli.com') {
        return { success: false, message: 'No se puede eliminar la cuenta de Administrador Principal' };
      }

      const supabase = createClient();
      let query = supabase.from('Users').update({ deleted: true, update_date: new Date().toISOString() });
      if (userIdOrEmail.includes('@')) {
        query = query.eq('mail', userIdOrEmail);
      } else {
        query = query.eq('id', userIdOrEmail);
      }

      const { error } = await query;
      if (error) return { success: false, message: error.message };

      return { success: true, message: 'Usuario eliminado' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error al eliminar usuario' };
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
      if (updates.name || updates.lastName) {
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
