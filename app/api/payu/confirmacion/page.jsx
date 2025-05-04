import connectDB from "@/libs/mongodb";
import Pago from "@/models/Pago";
import User from "@/models/User";

//hacer la prueba de la notificacion de payu sino debo cambiar la ruta de la notificacion

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    await connectDB();

    const {
      reference_sale,
      state_pol,
      value,
      currency,
      email_buyer
    } = req.body;

    console.log("🔔 Notificación de PayU:", req.body);

    let estado;
    switch (state_pol) {
      case "4":
        estado = "aprobado";
        break;
      case "6":
        estado = "rechazado";
        break;
      case "7":
        estado = "pendiente";
        break;
      default:
        estado = "desconocido";
    }

    // Guardar pago
    await Pago.findOneAndUpdate(
      { referencia: reference_sale },
      {
        email: email_buyer,
        estado,
        monto: value,
        moneda: currency,
        actualizadoEn: new Date()
      },
      { upsert: true, new: true }
    );

    // Si el pago fue aprobado, activar el perfil
    if (estado === "aprobado") {
      const user = await User.findOneAndUpdate(
        { email: email_buyer },
        { perfilActivo: true },
        { new: true }
      );

      if (user) {
        console.log(`✅ Perfil activado para el usuario: ${email_buyer}`);
      } else {
        console.warn(`⚠️ Usuario con email ${email_buyer} no encontrado.`);
      }
    }

    return res.status(200).send("Notificación procesada");
  } catch (error) {
    console.error("❌ Error al procesar la notificación:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
