import mongoose from 'mongoose';

const ProfileSchema = mongoose.Schema({
  name:           { type: String, required: true }, // NOMBRE Y APELLIDO 
  username:       { type: String, unique: true, required: true }, // USERNAME CREADO AUTOMATICO PARA CREAR URL PERSONALIZADA
  Profesion:      { type: String }, // PROFESION
  ageExpe:        { type: String }, // AÑOS DE EXPERIENCIA
  email:          { type: String, required: true, unique: true }, // CORREO ELECTRONICO
  country:        { type: String }, // PAIS DE RESIDENCIA
  phone:          { type: String }, // TELEFONO DE CONTACTO
  UrlLinkedin:    { type: String }, // URL LINKEDIN
  Urlgithub:      { type: String }, // URL GIT HUB
  Urlinstagram:   { type: String }, // URL INSTAGRAM
  Urlfacebook:    { type: String }, // URL FACEBOOK 
  photo:          { type: String }, // FOTO
  description:    { type: String }, // CAMPO PARA BREVE DESCRIPCION PROFESION Y EXPERIENCIAS
  curriCV:        { type: String }, // CARGAR EL CURRICULO
  typePlan:       { type: String }, // GUARDA EL TIPO DE PLAN SELECCIONADO
  skills:         [String], // Lista de habilidades
  planActivated:  { type: Boolean, default: false }, // PLAN ACTIVADO O NO
 
});
export const PerfilModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);


