import React from "react";
import Link from "next/link";
import { Container } from "semantic-ui-react";
import "./piepagina.css";

export function PiePagina() {
  return (
    <div className="client-layout">
      <Container className="pie-info">
        <h2>
          "Destaca tu talento con una imagen profesional. <br />
          Únete a nuestra comunidad y potencia tu portafolio con una URL personalizada <br />
          y asesoría especializada en Reclutamiento y RRHH. ¡Todo a un precio accesible!"
        </h2>

        <div className="pie-info__boton">
          <Link href="/Planes" passHref>
            <br />
            <br />
            <button>ACCEDE A TU PLAN AQUÍ</button>
          </Link>
        </div>
      </Container>
        <br />
        
      {/* Pie de página estilizado */}
      <footer className="footer">
        <Container className="footer-content">
          <span>© {new Date().getFullYear()} TODOS LOS DERECHOS RESERVADOS</span>
          {/* <span>FRANKLIN CONDE | FRONTEND DEVELOPER</span> */}
        </Container>
      </footer>
    </div>
  );
}