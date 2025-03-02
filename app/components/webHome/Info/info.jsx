"use client";

import React from "react";
import { Container} from "semantic-ui-react";
import { itemsData } from "@/app/Hooks/Banner.info";
import { map } from "lodash";
import "./info.css";

export function Info() {

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