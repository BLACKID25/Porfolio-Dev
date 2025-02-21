import mongoose from 'mongoose';

const ProfileSchema = mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  phone:          { type: String },
  UrlLinkedin:    { type: String },
  Urlgithub:      { type: String },
  Urlinstagram:   { type: String },
  Urlfacebook:    { type: String },
  photo:          { type: String },
  country:        { type: String },
  Profesion:      { type: String },
  ageExpe:        { type: String },
  description:    { type: String },
  curriCV:        { type: String },
  skills:         [String], // Lista de habilidades
  createdAt:      { type: Date, default: Date.now },
});
export const PerfilModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);



