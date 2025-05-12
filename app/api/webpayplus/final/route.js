// app/api/webpayplus/final/route.js (si estás en la estructura `app`)
import { NextResponse } from 'next/server';
import { WebpayPlus, Options, Environment } from 'transbank-sdk';


// Accede a las variables de entorno
const commerceCode = process.env.WEBPAY_PLUS_COMMERCE_CODE;
const apiKey = process.env.WEBPAY_PLUS_API_KEY;
const environment = process.env.WEBPAY_PLUS_ENVIRONMENT;

export async function POST(req) {

  console.log("RUTA FINAL")
  try {
    const { token_ws } = await req.json();

    if (token_ws) {

      // Verifica que las variables de entorno estén definidas
      if (!commerceCode || !apiKey || !environment) {
        console.error('Error: Variables de entorno de Transbank no configuradas.');
        return NextResponse.json({ error: 'Error de configuración del pago PROBLEMAS DE VARIABLES' }, { status: 500 });
      }
              
      // Crea las opciones utilizando las variables de entorno
      const options = new Options(
        commerceCode,
        apiKey,
        environment === 'LIVE' ? Environment.Live : Environment.Integration // Maneja el entorno LIVE si lo vas a usar en producción
      );

     
      const webpayPlus = new WebpayPlus.Transaction(options);

      const response = await webpayPlus.status(token_ws);

      // Aquí puedes registrar el resultado de la transacción en tu base de datos
      console.log("final response", response);
      // y realizar las acciones necesarias (activar el perfil, etc.)

      return NextResponse.json({ status: 'OK' }); // Transbank espera un status 200
    } else {
      return NextResponse.json({ error: 'Token Ausente' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error al confirmar la transacción:', error);
    return NextResponse.json({ error: 'Error al confirmar la transacción' }, { status: 500 });
  }
}