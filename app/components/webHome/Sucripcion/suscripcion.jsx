import { Container } from "semantic-ui-react";
import Link from 'next/link';
import "./suscripcion.css";

export function Suscripcion() {
  return (
    <Container className="home-courses">
      <h2>"Potencia tu carrera y destaca tu talento. <br /> 
      Únete a nuestra comunidad y eleva tu portafolio a la 
      imagen profesional que mereces."</h2>

      <div className="home-courses__more">
        <Link href="/createPerfil" passHref>
          <button>Únete HAZ CLICK AQUÍ</button>
        </Link>
      </div>
    </Container>
  );
}
