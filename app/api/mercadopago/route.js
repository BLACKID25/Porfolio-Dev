import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { plans } from '@/app/Hooks/Plnaes.info';
import { NextResponse } from "next/server";

console.log("🔐 Token de acceso de MercadoPago:", process.env.MP_ACCESS_TOKEN);

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
const BASE_URL = process.env.APP_URL;

export async function POST(req) {
  console.log("Entro a la API de MercadoPago");
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { email, plan } = await req.json();

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

    const finalAmount = transactionAmount * 980;
    console.log("Precio del plan", finalAmount);

    // Fecha de inicio y fin de la suscripción
    const now = new Date();
    const nextYear = new Date(now);
    nextYear.setFullYear(now.getFullYear() + 1); // Suscripción por un año

    const suscription = await new PreApproval(mp).create({
      body: {
        back_url: `${BASE_URL}/response`, // URL de retorno
      reason: selectedPlan.name, // Nombre del plan
     // external_reference: `subscription-${Date.now()}`, // Identificador único
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        end_date: nextYear.toISOString(), // Fecha de finalización
        transaction_amount: finalAmount, // Monto a cobrar
        currency_id: "CLP", // Moneda ajustada a Chile
      },
      payer_email: email, // Email del usuario
     // status: "pending", // Estado inicial
      },
    });

    // 7. Verificar la respuesta de Mercado Pago
    if (suscription && suscription.init_point) {
      console.log("Respuesta de MercadoPago:", suscription);
      // 8. Retornar la URL de inicio de sesión de Mercado Pago
      return NextResponse.json({ init_point: suscription.init_point }, { status: 200 });
    } else {
      // 9. Manejar el caso en que no se recibe init_point
      console.error("Error: No se recibió init_point de Mercado Pago");
      return NextResponse.json(
        { error: "Error al iniciar el pago: No se recibió URL de Mercado Pago" },
        { status: 500 }
      );
    }
  } catch (error) {
    // 10. Manejar errores
    console.error("Error al crear suscripción:", error.response || error);
    return NextResponse.json(
      { error: 'Error al procesar el pago', details: error.message || "Error desconocido" },
      { status: 500 }
    );
  }
}


