"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import './apregarperfil.css'

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    UrlLinkedin: "",
    Urlgithub: "",
    Urlinstagram: "",
    Urlfacebook: "",
    photo: "",
    curriCV: "",
    country: "",
    Profesion: "",
    ageExpe: "",
    description: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/perfil", formData);
      console.log("Perfil creado:", response.data);
      alert("Perfil creado con éxito");
    } catch (error) {
      console.error("Error al crear el perfil:", error);
      alert("Hubo un error al crear el perfil");
    }
  };

  return (
    <div className="formulario-perfil">
      <form className="max-w-xl mx-auto p-4 bg-gray-100 shadow rounded" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Crear Nuevo Perfil</h2>

        <div className="form-group">
          <div className="field mb-4">
            <label className="block text-gray-700">Nombre y Apellido:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="field mb-4">
            <label className="block text-gray-700">Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="field mb-4">
            <label className="block text-gray-700">Teléfono:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {[
            { label: "LinkedIn", field: "UrlLinkedin" },
            { label: "GitHub", field: "Urlgithub" },
            { label: "Instagram", field: "Urlinstagram" },
            { label: "Facebook", field: "Urlfacebook" },
          ].map(({ label, field }) => (
            <div key={field} className="field mb-4">
              <label className="block text-gray-700">{label}:</label>
              <input
                type="url"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <div className="field mb-4">
            <label className="block text-gray-700">Foto upload:</label>
            <input
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="field mb-4">
            <label className="block text-gray-700">CV upload:</label>
            <input
              type="url"
              name="curriCV"
              value={formData.curriCV}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="field mb-4">
            <label className="block text-gray-700">País:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="field mb-4">
            <label className="block text-gray-700">Profesión:</label>
            <input
              type="text"
              name="Profesion"
              value={formData.Profesion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="field mb-4">
            <label className="block text-gray-700">Años de experiencia:</label>
            <input
              type="number"
              name="ageExpe"
              value={formData.ageExpe}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="field mb-4">
            <label className="block text-gray-700">Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="field mb-4">
            <label className="block text-gray-700">Habilidades:</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Crear Perfil
        </button>

        <Link href="/">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Regresar
          </button>
        </Link>
      </form>
    </div>
  );
};

export default ProfileForm;
