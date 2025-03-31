"use client"; // Necesario en Next.js con App Router


import React from "react";
import { useRouter } from 'next/navigation'; // Importar desde next/navigation
import "./planes.css";
import { plans } from "@/app/Hooks/Plnaes.info";
import { asesoria } from "../Hooks/Asesoria.info";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

const PlansPage = () => {
  const router = useRouter(); // Inicializar el router

  // Función para manejar la selección de un plan
  const handleSelectPlan = (planName) => {
    router.push(`/createPerfil?plan=${encodeURIComponent(planName)}`);
  };

  return (
    <div className="home-containers">
      {/* Botón Home alineado a la derecha */}
      <div className="home-button-container">
        <Link href="/">
          <button className="btnplan">Home</button>
        </Link>
      </div>

      {/* Sección de Planes de Suscripción */}
      <h1 className="title">Planes de Suscripción</h1>
      <div className="plans">
        {plans.map((plan, index) => (
          <div className="card" key={index}>
            <h2>{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className="check-icon">
                    <FaCheckCircle />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="btnplan"
              onClick={() => handleSelectPlan(plan.name)}
            >
              Seleccionar
            </button>
          </div>
        ))}
      </div>

      {/* Sección de Planes de Asesoramiento */}
      <br /> <br />
      <h1 className="title">Planes de Asesorias</h1>
      <div className="plans">
        {asesoria.map((plan, index) => (
          <div className="card" key={index}>
            <h2>{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className="check-icon">
                    <FaCheckCircle />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="btnplan"
              onClick={() => handleSelectPlan(plan.name)}
            >
              Seleccionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
