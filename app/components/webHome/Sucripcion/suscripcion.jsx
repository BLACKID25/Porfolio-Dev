"use client";

import { Container } from "semantic-ui-react";
import Link from 'next/link';
import "./suscripcion.css";

export function Suscripcion() {
  return (
    <Container className="home-courses">
      <h2>"Potencia tu carrera y destaca tu talento. <br /> 
      Únete a nuestra comunidad y eleva tu portafolio con una
      imagen profesional que mereces. <br /> Todo a un bajo Costo $"</h2>

      <div className="home-courses__more">
        <Link href="/createPerfil" passHref>
          <button>Ver Planes Aquí</button>
        </Link>
      </div>
    </Container>
  );
}
