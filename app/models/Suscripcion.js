import mongoose from "mongoose";

const SuscripcionSchema = mongoose.Schema({
    username:            { type: String, required: true },
    email:               { type: String, required: true }, // CORREO ELECTRONICO
    payerId:             { type: String }, // BOMBRE DE PROYECTOS 
    status:              { type: String, default: "pending", }, // ESTADO DE LA SUSCRIPCION  
    amount:              { type: Number }, // MONTO DE LA SUSCRIPCION
    currency:            { type: String, default: "CLP" }, // MONEDA DE LA SUSCRIPCION
    startDate:           { type: Date }, // FECHA DE INICIO DE LA SUSCRIPCION
    endDate:             { type: Date }, // FECHA DE TERMINO DE LA SUSCRIPCION
    reason:              { type: String }, // RAZON DE LA SUSCRIPCION NOMBRE DEL PLAN  
    isApproved:          { type: Boolean, default: false }, // APROBADA O NO
     
    photoproyect:        { type: String }, // FOTOS DE PROYECTOS
    descproyect:         { type: String }, // DESCRIPCION DE PROYECTOS
    
  })
  export const SuscripciontModel =mongoose.models.Suscripcion || mongoose.model('Proyect', SuscripcionSchema)
  
