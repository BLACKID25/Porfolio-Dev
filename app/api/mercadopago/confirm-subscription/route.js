import { NextResponse } from 'next/server';
import axios from 'axios';
import { SuscripciontModel } from '@/app/models/Suscripcion';
import { PerfilModel } from '@/app/models/Profile';
import dbConnect from '@/app/libs/mongodb';

export async function GET(req) {
  // Conectar a la base de datos
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const preapprovalId = searchParams.get('preapproval_id');

  if (!preapprovalId) {
    return NextResponse.json({ message: 'preapproval_id requerido' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    //console.log("Datos de la suscripción:", data);

    //Necesito con el data.id buscar en la BD y traerme el email 
    const actsuscr = await SuscripciontModel.findOneAndUpdate(
      { orden_id: data.id },
      { $set: { endDate: data.next_payment_date}},
      { new: true, runValidators: true } // Opciones: Devuelve el doc actualizado y valida
    );

    if (!actsuscr) {
      return NextResponse.json({ message: 'Suscripción no encontrada' }, { status: 404 });
    }
      //console.log("Suscripción encontrada:", actsuscr);
      const {email, id_recurso, digitcardMP, username} = actsuscr;
     
      if (username) {
        try {
          const userProfile = await PerfilModel.findOneAndUpdate(
            { username: username },
            { $set: { planActivated: true } }, // Actualiza el email del perfil
            { new: true, runValidators: true } // Opciones: Devuelve el doc actualizado y valida
          );
          // if (userProfile) {
          //   console.log("Perfil actualizado con éxito:", userProfile);
          // }
        } catch (error) {
          console.error("Error al actualizar el perfil:", error);
          return NextResponse.json({ message: 'Error al actualizar el perfil' }, { status: 500 });
        }

      }else{
        console.warn("Advertencia: No se encontró el nombre de usuario asociado a la suscripción.");
      }

      //Aqui enviamos los datos al response para mostrar en el front
    return NextResponse.json({
      preapprovalId: data.id,
      payer_email: email,
      transaction_amount: data.auto_recurring.transaction_amount,
      status: data.status,
      next_payment_date: data.next_payment_date,
      namePlan: data.reason,
      metodoseleccionado: (data.payment_method_id).charAt(0).toUpperCase() + (data.payment_method_id).slice(1),
      id_recurso:id_recurso,
      digitcardMP: digitcardMP,
      username: username,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error final en la API confirm-subscription:", error.response?.data || error.message);
    return NextResponse.json({
      message: 'Error interno al confirmar suscripción',
      error: error.message || error,
    }, { status: 500 });
  }
}
