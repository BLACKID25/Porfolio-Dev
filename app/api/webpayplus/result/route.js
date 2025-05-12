// app/api/webpayplus/result/route.js (si estás en la estructura `app`)
import { NextResponse } from 'next/server';
import { WebpayPlus, Options, Environment } from 'transbank-sdk';

// Accede a las variables de entorno
const commerceCode = process.env.WEBPAY_PLUS_COMMERCE_CODE;
const apiKey = process.env.WEBPAY_PLUS_API_KEY;
const environment = process.env.WEBPAY_PLUS_ENVIRONMENT;


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token_ws = searchParams.get('token_ws');

  if (token_ws) {

    console.log("entro al resultado con el token", token_ws);
    
    try {
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
        
     
      // Crea una instancia de WebpayPlus.Transaction con las opciones
      const webpayPlus = new WebpayPlus.Transaction(options);

      //creamos la instancia de la transacción para obtener el resultado
      const response = await webpayPlus.commit(token_ws); 
      console.log("response del commit resultado", response);


      return NextResponse.json(response);

    } catch (error) {
      console.error('Error al obtener el resultado de la transacción:', error);
      return NextResponse.json({ error: 'Error al obtener el resultado de la transacción' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Token Ausente' }, { status: 400 });
  }
}