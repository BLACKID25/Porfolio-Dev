import mongoose from "mongoose";

const ProyectSchema = mongoose.Schema({
    username:            { type: String, required: true },
    nameproyect:         { type: String }, // BOMBRE DE PROYECTOS 
    tecnologiproyect:     [String], // TECNOLOGIAS DE PROYECTOS 
    photoproyect:        { type: String }, // FOTOS DE PROYECTOS
    descproyect:         { type: String }, // DESCRIPCION DE PROYECTOS
    
  })
  export const ProyectModel =mongoose.models.Proyect || mongoose.model('Proyect', ProyectSchema)
  