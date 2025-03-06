import NavBar from "./components/webHome/NavBar/NavBar";
import { Banner } from "./components/webHome/Banner/banner";
import { Suscripcion } from "./components/webHome/Sucripcion/suscripcion";
import { Info } from "./components/webHome/Info/info";
import  Nclientes  from "./components/webHome/NClientes/nclientes";
import "./page.css"; // Importa los estilos de Home
import {Reviews} from "./components/webHome/Reseñas/reseñas" 
import { PiePagina } from "./components/webHome/PiePagina/piepagina";


export default function Home() {
  return (
    <div>
      <main>
      <Banner/>
      <NavBar/>
      <Suscripcion/>
      <Nclientes/>
      <Info/>
      <Reviews/>
      <PiePagina/>
      </main> 
    </div>
  );
}
