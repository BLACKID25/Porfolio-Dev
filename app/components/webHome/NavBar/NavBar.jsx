"use client";

import React from 'react';
import Link from 'next/link';
import { MdHome, MdWork, MdEditSquare, MdInfo, MdContactMail } from 'react-icons/md'; // Importa los iconos
import './NavBar.css'; // Importa los estilos

export default function NavBar() {
  return (
    <nav>
      <div className="nav-container">
        <ul>
          <li>
            <Link href="/">
              <MdHome size={24} /> <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/Profesional">
              <MdWork size={24} /> <span>Profesionales</span>
            </Link>
          </li>
          <li>
            <Link href="/Planes">
              <MdEditSquare size={24} /> <span>Planes</span>
            </Link>
          </li>
          <li>
            <Link href="/Planes">
              <MdInfo size={24} /> <span>Quienes Somos</span>
            </Link>
          </li>
          <li>
            <Link href="#">
              <MdContactMail size={24} /> <span>Contacto</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="hamburger">☰</div>
    </nav>
  );
} 
