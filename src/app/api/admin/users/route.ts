import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Check authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Check admin role in Database
    const { data: dbUser, error: roleError } = await supabase
      .from('Users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (roleError || !dbUser || dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso no autorizado: se requiere rol de administrador' }, { status: 403 });
    }

    // 3. Fetch all active users
    const { data: users, error: fetchError } = await supabase
      .from('Users')
      .select('id, name, last_name, mail, role, creation_date, update_date, deleted')
      .eq('deleted', false)
      .order('creation_date', { ascending: false });

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const mappedUsers = (users || []).map((u) => ({
      id: u.id,
      name: u.name || '',
      last_name: u.last_name || '',
      email: u.mail || '',
      mail: u.mail || '',
      role: u.role || 'cliente',
      creation_date: u.creation_date,
      update_date: u.update_date,
      deleted: u.deleted,
    }));

    return NextResponse.json({ users: mappedUsers }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
