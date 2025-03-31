"use client";

import React from "react";
import { Container } from "semantic-ui-react";
import "./banner.css";

export function Banner() {
    return (
        <div className="banner">
          <Container>
            <h1 className="h1text">
              Lanza tu Portafolio Profesional <br /> con una URL Personalizada
            </h1>
            <h2>
              Da el siguiente paso en tu carrera digital, alojamos tu portafolio de forma <br />  exclusiva y sin complicaciones. ¡Haz que tu presencia online se vea increíble y 
              <br /> accesible con una URL profesional, fácil de recordar, sin guiones ni puntos!
              <br /> 
              
            </h2>
          </Container>
      
          <div className="banner__dark" />
        </div>
      );
}
