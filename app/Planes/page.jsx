"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import "./planes.css";
import { plans } from "@/app/Hooks/Plnaes.info";
import { asesoria } from "../Hooks/Asesoria.info";
import Link from "next/link";
import { FaCheck } from "react-icons/fa6";

const PlansPage = () => {
  const router = useRouter();

  const handleSelectPlan = (planName) => {
    router.push(`/createPerfil?plan=${encodeURIComponent(planName)}`);
  };

  return (
    <div className="page-background">
    <div className="plans-container">
      <div className="nav-top">
        <Link href="/">
          <button className="home-button">🏠 Inicio</button>
        </Link>
      </div>

      <h1 className="section-title">Planes de Suscripción</h1>
      <div className="plans-grid">
        {plans.map((plan, index) => (
          <div
            className={`plan-card ${plan.highlighted ? "popular" : ""}`}
            key={index}
          >
            {plan.highlighted && <div className="badge">MÁS POPULAR</div>}
            <h2>{plan.name}</h2>
            <div className="plan-price">{plan.price}</div>
            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <FaCheck className="icon-check" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan(plan.name)}
              className="select-btn"
            >
              Seleccionar Plan
            </button>
          </div>
        ))}
      </div>

      <h1 className="section-title">Planes de Asesorías</h1>
      <div className="plans-grid">
        {asesoria.map((plan, index) => (
          <div
          className={`plan-card ${plan.highlighted ? "popular" : ""}`}
          key={index}
        >
          {plan.highlighted && <div className="badge">MÁS POPULAR</div>}
          <h2>{plan.name}</h2>
            <div className="plan-price">{plan.price}</div>
            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <FaCheck className="icon-check" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan(plan.name)}
              className="select-btn"
            >
              Seleccionar Plan
            </button>
          </div>
        ))}
      </div>
    </div>
</div>
  );
};

export default PlansPage;
