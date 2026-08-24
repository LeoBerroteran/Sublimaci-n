import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_SETTINGS, StoreSettings } from '@/app/api/settings/route';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { data: dbUser, error: roleError } = await supabase
      .from('Users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (roleError || !dbUser || dbUser.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso no autorizado: se requiere rol de administrador' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('Settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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

    // 3. Parse payload
    const body: Partial<StoreSettings> = await req.json();

    const payload = {
      business_name: body.business_name || DEFAULT_SETTINGS.business_name,
      whatsapp_phone: (body.whatsapp_phone || DEFAULT_SETTINGS.whatsapp_phone).replace(/\D/g, ''),
      instagram_url: body.instagram_url || DEFAULT_SETTINGS.instagram_url,
      facebook_url: body.facebook_url || DEFAULT_SETTINGS.facebook_url,
      contact_email: body.contact_email || DEFAULT_SETTINGS.contact_email,
      exchange_rate_usd_ves: Number(body.exchange_rate_usd_ves || DEFAULT_SETTINGS.exchange_rate_usd_ves),
      update_date: new Date().toISOString(),
    };

    // Upsert into Settings table (id = 1)
    const { error: upsertError } = await supabase
      .from('Settings')
      .upsert({ id: 1, ...payload });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Configuración guardada exitosamente en la base de datos', settings: payload }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
