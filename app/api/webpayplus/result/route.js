import { NextResponse } from "next/server";
import { WebpayPlus, Options, Environment } from "transbank-sdk";
import dbConnect from "@/app/libs/mongodb";
import { SuscripciontModel } from "@/app/models/Suscripcion";
import { PerfilModel } from "@/app/models/Profile";

// Variables de entorno
const commerceCode = process.env.WEBPAY_PLUS_COMMERCE_CODE;
const apiKey = process.env.WEBPAY_PLUS_API_KEY;
const environment = process.env.WEBPAY_PLUS_ENVIRONMENT;

export async function GET(req) {
  await dbConnect(); // Conectar a MongoDB

  const { searchParams } = new URL(req.url);
  const token_ws = searchParams.get("token_ws");

  if (!token_ws) {
    return NextResponse.json({ error: "Token ausente" }, { status: 400 });
  }

  try {
    // Validar configuración de Transbank
    if (!commerceCode || !apiKey || !environment) {
      return NextResponse.json(
        { error: "Error de configuración de Transbank" },
        { status: 500 }
      );
    }

    // Configurar Transbank
    const options = new Options(
      commerceCode,
      apiKey,
      environment === "LIVE" ? Environment.Live : Environment.Integration
    );
    const webpayPlus = new WebpayPlus.Transaction(options);

    // Commit de la transacción
    const response = await webpayPlus.commit(token_ws);
    console.log("Commit de Transbank:", response);

    // Guardar/actualizar la suscripción en MongoDB
    const subscription = await SuscripciontModel.findOneAndUpdate(
      { orden_id: response.buy_order },
      {
        $set: {
          status: response.status,
        
       
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 mes de suscripción
         
          
          digitcardTransbank: response.card_detail?.card_number || null,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    if (!subscription) {
      return NextResponse.json(
        { message: "Suscripción no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar perfil del usuario
    if (subscription.username) {
      await PerfilModel.findOneAndUpdate(
        { username: subscription.username },
        { $set: { planActivated: true } },
        { new: true, runValidators: true }
      );
    }

    // Retornar info al frontend
    return NextResponse.json({
      buy_order: response.buy_order,
      card_detail: response.card_detail || null,
      amount: response.amount,
      transaction_date: response.transaction_date,
      authorization_code: response.authorization_code,
      status: response.status,
      username: subscription.username,
      payer_email: subscription.email,
      id_recurso: subscription.id_recurso,
      paymentMethod: "Transbank",
      namePlan: subscription.namePlan,
    });
  } catch (error) {
    console.error("Error procesando la transacción Webpay:", error);
    return NextResponse.json(
      { message: "Error interno al procesar la transacción", error: error.message },
      { status: 500 }
    );
  }
}
