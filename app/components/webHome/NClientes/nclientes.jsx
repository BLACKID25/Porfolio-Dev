"use client";

import React, { useState, useEffect } from "react";
import "./Nclientes.css"; // Importamos los estilos CSS

export default function Nclientes() {
   // Estado para el contador de clientes felices
   const [clientesFelices, setClientesFelices] = useState(1);
   const maxClientes = 3000; // Límite inicial
 
   useEffect(() => {
     let interval;
 
     if (clientesFelices < maxClientes) {
       // Primera fase: aumento rápido hasta 3000
       const velocidad = 3; // Velocidad del contador rápido
       const incremento = Math.ceil(3000 / 100); // Ajusta el incremento
 
       interval = setInterval(() => {
         setClientesFelices((prev) => {
           if (prev >= maxClientes) {
             clearInterval(interval);
             return maxClientes;
           }
           return prev + incremento;
         });
       }, velocidad);
     } else {
       // Segunda fase: incremento lento de 1 en 1 cada 30 segundos
       interval = setInterval(() => {
         setClientesFelices((prev) => prev + 1);
       }, 3000);
     }
 
     return () => clearInterval(interval);
   }, [clientesFelices]); // Se ejecuta cada vez que `clientesFelices` cambia



  return (
    <section className="bannerclientes">
      <div className="stats">
        <div className="stat">
          <h2>15+</h2>
          <p>Años de Experiencia</p>
        </div>
        <div className="stat">
          <h2>{clientesFelices.toLocaleString()}+</h2> {/* Se muestra el contador */}
          <p>Clientes Felices</p>
        </div>
        <div className="stat">
          <h2>100%</h2>
          <p>Satisfacción</p>
        </div>
      </div>
      {/* <a href="/Planes" className="btn">ACCEDE A TU PLAN AQU</a> */}
    </section>
  );
};


