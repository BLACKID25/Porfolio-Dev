import NavBar from "./components/webHome/NavBar/NavBar";
import { Banner } from "./components/webHome/Banner/banner";
import { Suscripcion } from "./components/webHome/Sucripcion/suscripcion";
import "./page.css"; // Importa los estilos de Home

export default function Home() {
  return (
    <div>
      <main>
      <Banner/>
      <NavBar/>
      <Suscripcion/>
      
      </main> 
    </div>
  );
}
