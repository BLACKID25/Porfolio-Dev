// /api/mercadopago/createOrder/route.js

import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { plans } from '@/app/hooks/Plnaes.info';
import { NextResponse } from "next/server";
import { SuscripciontModel } from '@/app/models/Suscripcion';

console.log("🔐 Token de acceso de MercadoPago:", process.env.MP_ACCESS_TOKEN);

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
const BASE_URL = process.env.APP_URL;

export async function POST(req) {
  console.log("Entro a la API de MercadoPago");
  try {
    const { email, plan, username } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del correo electrónico es inválido.' },
        { status: 400 }
      );
    }

    const selectedPlan = plans.find(p => p.name === plan);

    if (!selectedPlan) {
      return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
    }

    const transactionAmount = parseFloat(
      selectedPlan.price.replace("$", "").replace("/mes", "")
    );

    const finalAmount = transactionAmount * 980;
    console.log("Precio del plan", finalAmount);

    const now = new Date();
    const nextYear = new Date(now);
    nextYear.setFullYear(now.getFullYear() + 1);

    const suscription = await new PreApproval(mp).create({
      body: {
        back_url: `${BASE_URL}/response`,
        reason: selectedPlan.name,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          end_date: nextYear.toISOString(),
          transaction_amount: finalAmount,
          currency_id: "CLP",
        },
        payer_email: email,
      },
    });

    if (suscription && suscription.init_point) {
      console.log("Respuesta de MercadoPago:", suscription);

      const createorden = await SuscripciontModel.create({
        username: username,
        email: email,
        orden_id: suscription.id,
        amount: finalAmount,
        next_payment_date: suscription.auto_recurring.next_payment_date,
        namePlan: suscription.reason,
        metodoseleccionado: suscription.payment_method_id,
        startDate: suscription.date_created
      });

      console.log("Suscripción guardada en la base de datos:", createorden);

      return NextResponse.json({ init_point: suscription.init_point }, { status: 200 });
    } else {
      console.error("Error: No se recibió init_point de Mercado Pago");
      return NextResponse.json(
        { error: "Error al iniciar el pago: No se recibió URL de Mercado Pago" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error al crear suscripción (catch general):", error.response?.data || error.message);

    // --- DEPURACIÓN: Log la respuesta de error completa de Mercado Pago ---
    if (error.response && error.response.data) {
        console.error("Respuesta de error completa de Mercado Pago (desde MP):", JSON.stringify(error.response.data, null, 2));
    }
    // --- FIN DEPURACIÓN ---

    let customErrorMessage = 'Error al procesar el pago. Por favor, inténtalo de nuevo.';
    let statusCode = 500;
    let errorCode = 'UNKNOWN_ERROR';

    // --- CAMBIO CLAVE AQUÍ: Priorizar error.message para la comparación ---
    let messageToMatch = error.message; // Empezamos asumiendo que el mensaje está en error.message

    if (error.response && error.response.data) {
        // Si hay data en la respuesta, intentamos obtener un mensaje más específico de ahí
        const mpOriginalMessage = error.response.data.message || error.response.data.details;
        if (mpOriginalMessage) {
            messageToMatch = mpOriginalMessage; // Usamos este si existe
        } else if (error.response.data.cause && error.response.data.cause[0]?.description) {
            messageToMatch = error.response.data.cause[0].description; // O si está en 'cause'
        } else if (typeof error.response.data === 'string') {
            messageToMatch = error.response.data; // Si la respuesta es un string directo
        }
    }

    console.log("DEBUG: Mensaje de error extraído para comparación:", messageToMatch); // Para verificar qué se está comparando

    if (messageToMatch && messageToMatch.includes('Both payer and collector must be real or test users')) {
      customErrorMessage = 'El correo electrónico proporcionado no está asociado a un usuario válido de Mercado Pago.';
      statusCode = 400;
      errorCode = 'INVALID_MP_USER';
    } else if (messageToMatch && messageToMatch.includes('Cannot operate between different countries')) {
      customErrorMessage = 'No se puede procesar el pago. La moneda seleccionada no coincide con el país de tu cuenta de Mercado Pago.';
      statusCode = 400;
      errorCode = 'COUNTRY_CURRENCY_MISMATCH';
    } else if (messageToMatch && messageToMatch.includes('payer_email')) {
       customErrorMessage = 'Hay un problema con el correo electrónico del pagador. Por favor, verifica que sea válido y esté asociado a una cuenta de Mercado Pago.';
       statusCode = 400;
       errorCode = 'PAYER_EMAIL_ISSUE';
    }
    // Puedes añadir más condiciones 'else if' para otros errores específicos de MP
    // ...
    

    // Devuelve la respuesta con el status y mensaje personalizados
    return NextResponse.json(
      { error: customErrorMessage, code: errorCode, details: error.message || "Error desconocido" },
      { status: statusCode }
    );
  }
}