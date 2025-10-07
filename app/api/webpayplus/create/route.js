// app/api/webpayplus/create/route.js
import { NextResponse } from 'next/server';
import { WebpayPlus, Options, Environment } from 'transbank-sdk';
import { plans } from '@/app/hooks/Plnaes.info';
import dbConnect from '@/app/libs/mongodb';
import { SuscripciontModel } from '@/app/models/Suscripcion';

// Accede a las variables de entorno
const commerceCode = process.env.WEBPAY_PLUS_COMMERCE_CODE;
const apiKey = process.env.WEBPAY_PLUS_API_KEY;
const environment = process.env.WEBPAY_PLUS_ENVIRONMENT;

export async function POST(req) {
  try {
      // Obtener los datos del cuerpo de la solicitud
      const { email, plan, username } = await req.json(); // Recibe el nombre del plan desde el frontend (localStorage)
      
      if (!email || !plan) {
        return NextResponse.json({ error: 'Email y plan son requeridos' }, { status: 400 });
      }
      
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
        const returnUrl = `${origin}/response`.trim();
        const finalUrl = `${origin}/api/webpayplus/final`.trim(); // Opcional en la versión 6.x
        
      // Guardar suscripción PENDING en la BD según tu modelo
        await dbConnect();
        const newSubscription = await SuscripciontModel.create({
            username: username || null,
            email,
            orden_id: buyOrder,
            status: "pending",
            amount: finalAmount,
            currency: "CLP",
            startDate: new Date(),
            namePlan: selectedPlan.name,
            metodoseleccionado: "Transbank", // Inicialmente Transbank, se puede actualizar después
            digitcardTransbank: null,        // Se llenará luego cuando el pago sea confirmado
            cuotas: { Number_cuotas: 0, Monto_cuota: 0 }, // Puedes actualizar si manejas cuotas
        });

        console.log("Suscripción guardada en la base de datos:", newSubscription);

      // Crear transacción en Transbank
      const response = await tx.create(
              buyOrder,
              sessionId,
              finalAmount,
              returnUrl,
              finalUrl
      );

    return NextResponse.json({ token: response.token, url: response.url, subscriptionId: newSubscription._id });

  } catch (error) {
    console.error('Error creando transacción Webpay Plus:', error);
    return NextResponse.json({ error: 'Error al crear la transacción' }, { status: 500 });
  }
}