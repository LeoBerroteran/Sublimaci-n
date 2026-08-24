import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache on server for 1 hour

export async function GET() {
  try {
    const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ rate: 60.5, source: 'fallback' });
    }

    const data = await res.json();
    const rate = typeof data.promedio === 'number' && data.promedio > 0 ? data.promedio : 60.5;

    return NextResponse.json({
      rate,
      source: 'dolarapi_bcv',
      updated_at: data.fechaActualizacion || new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ rate: 60.5, source: 'fallback' });
  }
}
