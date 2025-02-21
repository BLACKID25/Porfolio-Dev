import NavBar from "./components/NavBar/NavBar";
import "./page.css"; // Importa los estilos de Home

export default function Home() {
  return (
    <div>
      <NavBar />
      <main>
        <h1>Bienvenido a MiProyecto</h1>
        <p>Encuentra a los mejores profesionales y suscríbete para conocer más.</p>
      </main>
    </div>
  );
}
