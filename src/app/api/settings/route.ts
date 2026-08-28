import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 60; // Cache for 60 seconds

export interface StoreSettings {
  business_name: string;
  whatsapp_phone: string;
  instagram_url: string;
  facebook_url: string;
  contact_email: string;
  exchange_rate_usd_ves: number;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  business_name: 'Sublilove',
  whatsapp_phone: '584243695379',
  instagram_url: 'https://www.instagram.com/subli_lover?igsh=MW5uOGV6dm1pemRsag==',
  facebook_url: 'https://www.facebook.com/share/1D4XtomhZa/',
  contact_email: '',
  exchange_rate_usd_ves: 60.5,
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('Settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    return NextResponse.json({
      business_name: data.business_name || DEFAULT_SETTINGS.business_name,
      whatsapp_phone: data.whatsapp_phone || DEFAULT_SETTINGS.whatsapp_phone,
      instagram_url: data.instagram_url || DEFAULT_SETTINGS.instagram_url,
      facebook_url: data.facebook_url || DEFAULT_SETTINGS.facebook_url,
      contact_email: data.contact_email || DEFAULT_SETTINGS.contact_email,
      exchange_rate_usd_ves: Number(data.exchange_rate_usd_ves || DEFAULT_SETTINGS.exchange_rate_usd_ves),
    });
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}
