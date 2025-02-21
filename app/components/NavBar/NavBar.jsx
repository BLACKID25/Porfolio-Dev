import Link from "next/link";
import "./NavBar.css"; // Importa los estilos

export default function NavBar() {
  return (
    <nav>
      <div className="logo">MiProyecto</div>
      <div className="nav-container">
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="#">Profesionales</Link></li>
        <li><Link href="/createPerfil">Suscríbete</Link></li>
        <li><Link href="#">Quienes Somos</Link></li>
        <li><Link href="#">Misión y Visión</Link></li>
        <li><Link href="#">Contacto</Link></li>
      </ul>
      </div>
      <div className="hamburger">☰</div>
    </nav>
  );
}
