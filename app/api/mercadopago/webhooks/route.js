import { NextResponse } from "next/server";
import { SuscripciontModel } from "@/app/models/Suscripcion";
import { PerfilModel } from "@/app/models/Profile";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const dataId = searchParams.get("data.id");
  const type = searchParams.get("type");

 // console.log("✅ Webhook recibido:");
 // console.log("Query params:", { type, dataId });

  const body = await req.json();
 // console.log("Body completo:", body);

  if (!dataId || !type) {
    return NextResponse.json({ message: "Faltan parámetros" }, { status: 400 });
  }

  try {
    let response, data;

    if (type === "subscription_authorized_payment") {
      response = await fetch(
        `https://api.mercadopago.com/v1/authorized_payments/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );
      data = await response.json();
      return NextResponse.json({ message: "Pago autorizado recibido" }, { status: 200 });
      


    } else if (type === "payment") {
        response = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        });
        data = await response.json();
        console.log("💰 Datos de pago autorizado:", data);
        
        // console.log("💵 data.metadata.preapproval_id", data.metadata.preapproval_id);
        // console.log("💵 data.card.bin", data.card.bin);
        const preapprovalId = data.metadata.preapproval_id; // Usa preapproval_id si está disponible, sino usa el id del pago
        // Actualizar la suscripción en la base de datos
            try {

              const actsuscr = await SuscripciontModel.findOneAndUpdate(
                { orden_id: preapprovalId },  // Filtro: busca la suscripción por dataId 
                { $set: { id_recurso: data.id,
                  status: "Paid", // Actualiza el estado a "Paid"
                  metodoseleccionado : data.payment_method_id, // Actualiza el método de pago
                  digitcardMP: data.card.bin, // Actualiza los primeros 6 dígitos de la tarjeta
                } }, // Actualiza el campo id_recurso
                { new: true, runValidators: true } // Opciones: Devuelve el doc actualizado y valida
              );

              if (actsuscr) {
                console.log("Suscripción actualizada....:", actsuscr);
                return NextResponse.json({ message: "Pago recibido y procesado, suscripción actualizada" }, { status: 200 });
              } else {
                console.log("No se encontró la suscripción para actualizar.");
                return NextResponse.json({ message: "Pago recibido, pero no se encontró la suscripción" }, { status: 200 }); // O un 404, dependiendo de la lógica
              }
            } catch (error) {
              console.error("Error al actualizar la suscripción:", error);
              return NextResponse.json({ error: "Error al actualizar la suscripción" }, { status: 500 });
            }
          }

    return NextResponse.json({ message: "Tipo recibido sin acción" }, { status: 200 });
  } catch (error) {
      console.error("❌ Error en webhook:", error);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
