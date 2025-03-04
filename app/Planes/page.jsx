import React from "react";
import "./planes.css"; // Asegúrate de importar el archivo de estilos
import { plans } from "@/app/Hooks/Plnaes.info";
import { asesoria } from "../Hooks/Asesoria.info";

// Si usas FontAwesome, también puedes importarlo
import { FaCheckCircle } from 'react-icons/fa'; // Importación del ícono (si usas react-icons)

const PlansPage = () => {
  return (
    <div className="container">
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
                    <FaCheckCircle /> {/* Icono de check */}
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="btn">Seleccionar</button>
          </div>
        ))}
      </div>
      <br /> <br />
      <h1 className="title">Planes de Asesoramientos</h1>
      <div className="plans">
        {asesoria.map((plan, index) => (
          <div className="card" key={index}>
            <h2>{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className="check-icon">
                    <FaCheckCircle /> {/* Icono de check */}
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="btn">Seleccionar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
