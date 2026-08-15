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
  updateProfile: (updates: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUserProfile = useCallback(async (authUserId?: string, email?: string): Promise<User | null> => {
    try {
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
        // Fallback profile if row in public.Users doesn't exist yet
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
  }, [supabase]);

  const refreshUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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
  }, [supabase, fetchUserProfile]);

  useEffect(() => {
    refreshUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id, session.user.email);
        setCurrentUser(profile);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile, refreshUser]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // Fallback message for common errors
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
  }, [supabase, fetchUserProfile]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setCurrentUser(null);
    }
  }, [supabase]);

  const register = useCallback(async (name: string, email: string, password: string, lastName: string = ''): Promise<{ success: boolean; message: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name,
            last_name: lastName,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        // Upsert into public.Users in case trigger delay
        await supabase.from('Users').upsert({
          id: data.user.id,
          name,
          last_name: lastName,
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

      return { success: true, message: 'Cuenta creada exitosamente' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error al registrar usuario' };
    }
  }, [supabase, fetchUserProfile]);

  const getUsers = useCallback(async (): Promise<User[]> => {
    try {
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
  }, [supabase]);

  const updateUser = useCallback(async (userIdOrEmail: string, updates: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
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
  }, [supabase, refreshUser]);

  const deleteUser = useCallback(async (userIdOrEmail: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (userIdOrEmail === 'admin@subli.com') {
        return { success: false, message: 'No se puede eliminar la cuenta de Administrador Principal' };
      }

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
  }, [supabase]);

  const updateProfile = useCallback(async (updates: { name?: string; email?: string; currentPassword?: string; newPassword?: string }): Promise<{ success: boolean; message: string }> => {
    try {
      if (!currentUser) return { success: false, message: 'No hay sesión activa' };

      // Update auth email or password if requested
      const authUpdates: any = {};
      if (updates.email && updates.email !== currentUser.email) {
        authUpdates.email = updates.email;
      }
      if (updates.newPassword) {
        authUpdates.password = updates.newPassword;
      }

      if (Object.keys(authUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(authUpdates);
        if (authError) return { success: false, message: authError.message };
      }

      // Update public.Users table
      if (updates.name || updates.email) {
        const dbUpdates: any = { update_date: new Date().toISOString() };
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.email) dbUpdates.mail = updates.email;

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
  }, [currentUser, supabase, refreshUser]);

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
