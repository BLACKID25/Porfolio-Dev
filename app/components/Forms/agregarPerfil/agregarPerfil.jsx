// ProfileForm.jsx

"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import './apregarperfil.css'
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
// --- CAMBIO AQUÍ: Importa HandleMercadopago como un COMPONENTE ---
import HandleMercadopago from "@/app/Hooks/HandleMercadopago";
// --- FIN CAMBIO ---
import { handleWebpayPlus } from "@/app/Hooks/HandreWebPayPlus"; // Asumo que este es similar

const ProfileForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const nameplan = searchParams.get('plan')

    const [formData, setFormData] = useState({
        name: "",
        email: "", // Este es el email principal del perfil
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

    const [showProjects, setShowProjects] = useState(false);
    const [projects, setProjects] = useState([
        {
            nameproyect: "",
            tecnologiproyect: "",
            photoproyect: "",
            descproyect: ""
        },
    ]);

    // showPaymentModal ahora solo necesita el username para pasarlo al componente de pago
    const [showPaymentModal, setShowPaymentModal] = useState({ open: false, username: null });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/perfil", formData);
            const result = response.data;
            localStorage.setItem("username", result.data.username);

            //console.log("Perfil creado: Respuesta del back", result);
            const username = localStorage.getItem('username');

            if (response.status === 201) {
                if (showProjects && projects.length > 0) {
                    const proyectosProcesados = projects.map((p) => ({
                        ...p,
                        tecnologiproyect: p.tecnologiproyect.split(',').map(t => t.trim()),
                    }));

                    await axios.post("/api/proyect", {
                        name: formData.name,
                        proyectos: proyectosProcesados,
                    });
                }
            }

            Swal.fire({
                icon: 'success',
                title: 'Usuario y proyectos PRECREADOS con éxito',
                html: `Haga click en <strong> Ir a pagar <strong/> para 
                                  <br/> procesar el pago y activar su URL-PORTAFOLIO`,
                showConfirmButton: true,
                confirmButtonText: 'Ir a pagar',
                confirmButtonColor: '#3085d6',

            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("Valor de nameplan justo antes de mostrar el modal:", nameplan);
                    console.log("Valor de formData.email justo antes de mostrar el modal:", formData.email);
                    setShowPaymentModal({ open: true, username: username });
                }
            });
        } catch (error) {
            if (error.response?.status === 409) {
                const code = error.response.data.code
                console.log("ERROR COMPLETO:", error.response);

                if (code === "EMAIL_DUPLICATE") {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        html: `Ya existe este correo electrónico registrado
                                  <br/> Puedes modificarlo.`,
                    });
                } else if (code === "USERNAME_DUPLICATE") {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        html: `Ya existe un perfil con este nombre de usuario
                                  <br/> Puedes modificarlo.`,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Conflicto al crear el perfil.",
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error inesperado al crear el perfil.",
                });
            }
        }
    }

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

                <div className="field mb-4">
                    <label className="block text-gray-700">
                        <input
                            type="checkbox"
                            checked={showProjects}
                            onChange={() => setShowProjects(!showProjects)}
                            className="mr-2"
                        />
                        ¿Deseas agregar proyectos?
                    </label>
                </div>

                {showProjects && (
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Proyectos</h3>
                        {projects.map((project, index) => (
                            <div key={index} className="mb-4 border p-3 rounded bg-white shadow-sm">
                                <label className="block text-gray-700 mb-1">Nombre del Proyecto:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded mb-2"
                                    value={project.nameproyect}
                                    onChange={(e) => {
                                        const updated = [...projects];
                                        updated[index].nameproyect = e.target.value;
                                        setProjects(updated);
                                    }}
                                />
                                <label className="block text-gray-700 mb-1">Tecnologías (separadas por coma):</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded mb-2"
                                    value={project.tecnologiproyect}
                                    onChange={(e) => {
                                        const updated = [...projects];
                                        updated[index].tecnologiproyect = e.target.value;
                                        setProjects(updated);
                                    }}
                                />
                                <label className="block text-gray-700 mb-1">URL Imagen:</label>
                                <input
                                    type="url"
                                    className="w-full p-2 border rounded mb-2"
                                    value={project.photoproyect}
                                    onChange={(e) => {
                                        const updated = [...projects];
                                        updated[index].photoproyect = e.target.value;
                                        setProjects(updated);
                                    }}
                                />
                                <label className="block text-gray-700 mb-1">Descripción:</label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                    value={project.descproyect}
                                    onChange={(e) => {
                                        const updated = [...projects];
                                        updated[index].descproyect = e.target.value;
                                        setProjects(updated);
                                    }}
                                />
                            </div>
                        ))}

                        {projects.length < 3 && (
                            <button
                                type="button"
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                onClick={() => setProjects([...projects, { nameproyect: "", tecnologiproyect: "", photoproyect: "", descproyect: "" }])}
                            >
                                + Agregar otro proyecto
                            </button>
                        )}
                    </div>
                )}

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Crear Perfil
                </button>
            </form>

            {/* Modal de pago */}
            {showPaymentModal.open && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="custom-h3 text-xl font-semibold mb-4">Selecciona tu método de pago</h3>
                        <div className="payment-options">
                            {/* --- CAMBIO AQUÍ: Renderiza HandleMercadopago como un COMPONENTE --- */}
                            <HandleMercadopago
                                initialEmail={formData.email} // Pasa el email del perfil como initialEmail
                                plan={nameplan}
                                username={showPaymentModal.username}
                            />
                            {/* --- FIN CAMBIO --- */}

                            <button className="payment-button paypal-button" onClick={() => console.log("PayPal")} disabled>
                                <img src="/paypal.svg" alt="PayPal" className="icon-paypal" />
                            </button>

                            <button className="payment-button stripe-button" onClick={() => { handleWebpayPlus(formData.email, nameplan, showPaymentModal.username) }}>
                                <img src="/webpayplus.png" alt="PayU" className="icon-webpay-cl" />
                            </button>
                        </div>
                        <button
                            className="close-modal"
                            onClick={() => setShowPaymentModal({ open: false, username: null })}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileForm;