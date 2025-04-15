"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import './apregarperfil.css'
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

const ProfileForm = () => {
    const router = useRouter();

    //EXTRAEMOS DE AQUI EL NOMBRE DEL PLAN
    const searchParams = useSearchParams()
    const nameplan = searchParams.get('plan')
    console.log("Nombre del plan seleccionado", nameplan)


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    UrlLinkedin: "",
    Urlgithub: "",
    Urlinstagram: "",
    photo: "",
    curriCV: "",
    country: "",
    Profesion: "",
    ageExpe: "",
    description: "",
    skills: [],
    typePlan: nameplan,
  });

  const [skillInput, setSkillInput] = useState("");

  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skillInput.trim()],
        });
      }
      setSkillInput("");
    }
  };
  
  const removeSkill = (indexToRemove) => {
    const updatedSkills = formData.skills.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, skills: updatedSkills });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/perfil", formData);
      
      
      
    
        console.log("Perfil creado:", response.data);
        
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado con éxito',
          html: `Haga click en continuar para 
                <br/> procesar el pago`,
                
              }).then((result) => {
                // Este bloque de código se ejecutará después de que el usuario cierre la alerta
                if (result.isConfirmed) {
                    localStorage.clear()
                  // Redirigir a la página siguiente
                  // Por ejemplo, podrías usar router.push para navegar a la página siguiente
                  router.push('/'); //asi mientras hacemos el proceso de pago de mercadolibre
                }
              });
      

    } catch (error) {
      console.error("Error al crear el perfil:", error);
      alert("Hubo un error al crear el perfil");
    }
  };

    

  return (
    <div className="formulario-perfil">
      <form className="max-w-xl mx-auto p-4 bg-gray-100 shadow rounded" onSubmit={handleSubmit}>
            <div className="nav-tophome">
                <Link href="/">
                 <button className="home-buttonhome">🏠 Inicio</button>
                </Link>
            </div>

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
            </div>

            <div className="form-group">
                {[
                    { label: "LinkedIn", field: "UrlLinkedin" },
                    { label: "GitHub", field: "Urlgithub" },
                    { label: "Instagram", field: "Urlinstagram" },
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

          <div className="field mb-4">
                <label className="block text-gray-700">Resumen Profesional:</label>
                <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="4"
                />
          </div>
       


            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Crear Perfil
            </button>
      </form>
    </div>
  );
};

export default ProfileForm;
