// app/api/webpayplus/return/route.js (si estás en la estructura `app`)
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token_ws = searchParams.get('token_ws');
  const pago_fallido = searchParams.get('PAGO_FALLIDO');

  console.log("entro a la ruta de retorno con el token", token_ws);

  if (pago_fallido === 'true') {
    // El pago falló en el formulario de Transbank
    return NextResponse.redirect(new URL('/pago-fallido?error=formulario-rechazado', req.url));
  }

  if (token_ws) {
    // Redirige a la página de resultado en el frontend con el token
    return NextResponse.redirect(new URL(`/pago-resultado?token_ws=${token_ws}`, req.url));
  } else {
    return NextResponse.redirect(new URL('/pago-fallido?error=token-ausente', req.url));
  }
}