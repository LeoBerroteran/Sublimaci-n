import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // 1. Authenticate caller
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Authorize caller as admin
    const { data: dbUser, error: roleError } = await supabase
      .from('Users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (roleError || !dbUser || dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso no autorizado: se requiere rol de administrador' }, { status: 403 });
    }

    // 3. Parse and sanitize update payload
    const body = await req.json();
    const dbUpdates: Record<string, unknown> = {
      update_date: new Date().toISOString(),
    };

    if (body.name !== undefined) dbUpdates.name = String(body.name).trim();
    if (body.last_name !== undefined) dbUpdates.last_name = String(body.last_name).trim();
    if (body.email !== undefined) dbUpdates.mail = String(body.email).trim().toLowerCase();
    if (body.role !== undefined) {
      const allowedRoles = ['admin', 'cliente', 'user'];
      if (!allowedRoles.includes(body.role)) {
        return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
      }
      dbUpdates.role = body.role;
    }

    let query = supabase.from('Users').update(dbUpdates);
    if (id.includes('@')) {
      query = query.eq('mail', id);
    } else {
      query = query.eq('id', id);
    }

    const { error: updateError } = await query;
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Usuario actualizado con éxito' }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // 1. Authenticate caller
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Authorize caller as admin
    const { data: dbUser, error: roleError } = await supabase
      .from('Users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (roleError || !dbUser || dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso no autorizado: se requiere rol de administrador' }, { status: 403 });
    }

    // 3. Prevent admin from deleting own account
    if (user.id === id || user.email === id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta de administrador en uso' }, { status: 400 });
    }

    // 4. Delete user from public."Users" (Triggers cascade to auth.users)
    let query = supabase.from('Users').delete();
    if (id.includes('@')) {
      query = query.eq('mail', id);
    } else {
      query = query.eq('id', id);
    }

    const { error: deleteError } = await query;
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Usuario eliminado permanentemente' }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
