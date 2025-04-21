import { NextResponse } from 'next/server';
import axios from 'axios';

// guardar el token de acceso en una variable de entorno
// const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN

// console.log("🔐 Access Token:", ACCESS_TOKEN);

export async function GET(req) {

    // console.log("Entro a la API de confirm-subscription");


    const { searchParams } = new URL(req.url);
    const preapprovalId = searchParams.get('preapproval_id');
  
    if (!preapprovalId) {
      return NextResponse.json({ message: 'preapproval_id requerido' }, {
        status: 400,
      });
    }
  
    try {
      // Verifica si el token de acceso está cargado correctamente

      // Usamos axios para hacer la solicitud
      const response = await axios.get(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
  
      console.log("🔍 Respuesta de MercadoPago pago confirmado:", data);
  
      return NextResponse.json({
        message: 'Suscripción confirmada',
        payer_email: data.payer_email,
        status: data.status,
        next_payment_date: data.next_payment_date,
        reason: data.reason,
      }, {
        status: 200,
      });
  
    } catch (error) {
      // Manejo de errores en caso de que falle la solicitud con Axios
      console.error("❌ Error en la API confirm-subscription:", error.response || error);
      return NextResponse.json({ message: 'Error interno', error: error.message || error }, {
        status: 500,
      });
    }
}
