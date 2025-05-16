import { NextResponse } from "next/server";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const dataId = searchParams.get("data.id");
  const type = searchParams.get("type");

  console.log("✅ Webhook recibido:");
  console.log("Query params:", { type, dataId });

  const body = await req.json();
  console.log("Body completo:", body);

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
      console.log("💰 Datos de pago autorizado:", data);
      return NextResponse.json({ message: "Pago autorizado recibido" }, { status: 200 });

    } else if (type === "payment") {
      response = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      });
      data = await response.json();
      console.log("💵 Datos del pago:", data);
      return NextResponse.json({ message: "Pago recibido y procesado" }, { status: 200 });
    }

    return NextResponse.json({ message: "Tipo recibido sin acción" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
