import NavBar from "./components/webHome/NavBar/NavBar";
import { Banner } from "./components/webHome/Banner/banner";
import { Suscripcion } from "./components/webHome/Sucripcion/suscripcion";
import { Info } from "./components/webHome/Info/info";
import "./page.css"; // Importa los estilos de Home
import { info } from "autoprefixer";


export default function Home() {
  return (
    <div>
      <main>
      <Banner/>
      <NavBar/>
      <Suscripcion/>
      <Info/>
      </main> 
    </div>
  );
}
