"use client";

import React from "react";
import { Container} from "semantic-ui-react";

import { map } from "lodash";
import "./info.css";

export function Info() {

    const itemsData = [
        {
         
          title: "URL Personalizada",
          description:
            "Obtienes una URL Profesional y más personalizada sin guiones ni puntos y caracteres especiales.",
        },
        {
          
          title: "Acceso 24/7",
          description:
            "Disponible y Accesible 24/7 segun tu plan de preferencia sin importar día y hora.",
        },
        {
          
          title: "Planes Economicos y Accesibles",
          description:
            "Planes accesibles a tu bolsillo y al alcance de tu mano.",
        },
        {
         
          title: "Mejora tu perfil",
          description:
            "Plan Full incluye asesorias con mentores expertos en CV, Perfiles de RRSS y mucho más.",
        },
        {
          
          title: "Marketing a Empresas",
          description:
            "Con tu afiliación, un pequeño % se va al marketin digital para presentarte a Empresas y Reclutadores.",
        },
        {
         
          title: "Creación de Perfiles RRSS",
          description: "Te ayudamos a crear tus perfiles o mejorar los existentes en RRSS",
        },
        ];

  return (
    <Container className="how-my-courses-work">
      <h2>¿CÓMO FUNCIONA NUESTRA PLATAFORMA?</h2>
      <h4>
        Tu nos entregas una imagen o tu idea de Portafolio, la adaptamos y te otorgamos una URL Profesional por un Bajo Costo, activa las 24 horas del día y
        los 365 días del año y mucho más.
      </h4>

      <div className="how-my-courses-work__items">
        {map(itemsData, (item, index) => (
          <div key={index}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
