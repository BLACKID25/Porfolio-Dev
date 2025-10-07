import connectDB from "@/app/libs/mongodb";
import { SuscripciontModel } from "@/app/models/Suscripcion";
import { PerfilModel } from "@/app/models/Profile";; // Asegúrate de importar tu modelo de usuarios
import { NextResponse } from "next/server";
import { plans } from "@/app/hooks/Plnaes.info";

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email es requerido" },
        { status: 400 }
      );
    }

    // Primero: buscamos y eliminamos la suscripción pendiente
    let suscripcion = await SuscripciontModel.findOneAndDelete({
      email,
      status: "pending",
    });

    if (suscripcion) {
      return NextResponse.json(
        { success: true, data: suscripcion },
        { status: 200 }
      );
    }

    // Segundo: buscamos un usuario registrado que no haya activado el plan
    const usuarioPendiente = await PerfilModel.findOne({
      email,
      planActivated: false,
    });

    if (usuarioPendiente) {

      const planInfo = plans.find(p=> p.name === usuarioPendiente.typePlan)
      // Retornamos datos mínimos necesarios para procesar pago
      return NextResponse.json({
        success: true,
        data: {
          email: usuarioPendiente.email,
          username: usuarioPendiente.username,
          namePlan: usuarioPendiente.typePlan,
          amount: planInfo ? planInfo.price : null,
          isPendingUser: true, // puedes usar este flag para diferenciar en el frontend
        },
      }, { status: 200 });
    }

    // No hay suscripciones ni usuarios pendientes
    return NextResponse.json(
      { success: false, message: "No hay pagos pendientes" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error al buscar/eliminar suscripción o usuario pendiente:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
