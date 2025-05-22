import mongoose from "mongoose";

const SuscripcionSchema = mongoose.Schema({
    username:            { type: String, required: true },
    email:               { type: String, required: true }, // CORREO ELECTRONICO
    orden_id:             { type: String }, // Numero de orden de la suscripcion
    id_recurso:         { type: String }, // ID DEL RECURSO DE LA SUSCRIPCION
    status:              { type: String, default: "pending", }, // ESTADO DE LA SUSCRIPCION  
    amount:              { type: Number }, // MONTO DE LA SUSCRIPCION
    currency:            { type: String, default: "CLP" }, // MONEDA DE LA SUSCRIPCION
    startDate:           { type: Date }, // FECHA DE INICIO DE LA SUSCRIPCION
    endDate:             { type: Date }, // FECHA DE TERMINO DE LA SUSCRIPCION
    namePlan:              { type: String }, // RAZON DE LA SUSCRIPCION NOMBRE DEL PLAN  
    metodoseleccionado : { type: String }, // TIPO DE PAGO TDC - DEBITO - ACOUNT MONEY MERCADO
    digitcardMP:         { type: String }, // 6 primeros digitos de la tarjeta de credito mercadopago
    digitcardTransbank:              { type: String }, // 4 utlimos digitos de la tarjeta de credito transbank
    cuotas : {
        Number_cuotas: { type: Number, default: 0 }, // Numero de cuotas
        Monto_cuota: { type: Number, default: 0 }, // Monto por cuota
    },
    
    
  })
  export const SuscripciontModel =mongoose.models.Suscripcion || mongoose.model('Suscripcion', SuscripcionSchema)
  
