// app/api/webpayplus/create/route.js
import { NextResponse } from 'next/server';
import { WebpayPlus, Options, Environment } from 'transbank-sdk';
import { plans } from '@/app/Hooks/Plnaes.info';

// Accede a las variables de entorno
const commerceCode = process.env.WEBPAY_PLUS_COMMERCE_CODE;
const apiKey = process.env.WEBPAY_PLUS_API_KEY;
const environment = process.env.WEBPAY_PLUS_ENVIRONMENT;

export async function POST(req) {
  try {
     // Obtener los datos del cuerpo de la solicitud
     const { email, plan } = await req.json(); // Recibe el nombre del plan desde el frontend (localStorage)
    
    // Buscar el plan seleccionado en la lista de planes
    const selectedPlan = plans.find(p => p.name === plan);
   
    // Validar si el plan seleccionado existe
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Plan no válido' }, {status: 400})
    }

    // Obtener el precio del plan, eliminando los caracteres "$" y "/mes"
    const transactionAmount = parseFloat(
      selectedPlan.price.replace("$", "").replace("/mes", "")
    );


        // Convertir el precio de USD a CLP
        const finalAmount = transactionAmount * 980;

        // Convertir el precio en CLP a centavos (multiplicar por 100 y redondear)
        // const finalAmount = Math.round(transactionAmountCLP * 100);
        // console.log("Precio del plan en centavos (CLP):", finalAmount);

        
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
        const tx = new WebpayPlus.Transaction(options);
        
        // Genera un ID de orden y un ID de sesión únicos + variables para crear la transacción
        const buyOrder = `Order-${Date.now()}`.trim();
        const sessionId = `Session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`.trim();
        const origin = req.headers.get('origin') || 'http://localhost:3000'; // Establece un valor predeterminado
        const returnUrl = `${origin}/webpayplus/resultado`.trim();
        const finalUrl = `${origin}/api/webpayplus/final`.trim(); // Opcional en la versión 6.x
        
       // console.log("origin", origin);
       // console.log("returnUrl que se enviará:", returnUrl);
        
        const response = await tx.create(
            buyOrder,
            sessionId,
            finalAmount,
            returnUrl,
            finalUrl
        );

        console.log("resultado de la transaccion transbank",response)

    return NextResponse.json({ token: response.token, url: response.url });
  } catch (error) {
    console.error('Error creando transacción Webpay Plus:', error);
    return NextResponse.json({ error: 'Error al crear la transacción' }, { status: 500 });
  }
}