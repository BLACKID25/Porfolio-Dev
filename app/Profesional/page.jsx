"use client"


import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import UserCard from "../components/CardProfesional/card";
import "./profesional.css"

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", country: "", Profesion: "" });

  useEffect(() => {
    axios.get("/api/perfil")
      .then((response) => {
        console.log("Datos recibidos de la API:", response.data);  // Accede a response.data
        setUsers(response.data);  // Asigna los datos correctamente
      })
      .catch((error) => console.error("Error obteniendo usuarios:", error));
  }, []);
  
  // Filtrar los usuarios en base a los inputs
 
  const filteredUsers = users.filter(user =>

    
    user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    user.country.toLowerCase().includes(filters.country.toLowerCase()) &&
    user.Profesion.toLowerCase().includes(filters.Profesion.toLowerCase())
  );

  return (
    <div className="containers">
      <h1 className="title">DIRECTORIO DE DESARROLLADORES</h1>
      <div>
    <Link href="/">
      <button className="btn">Home</button> <br /> <br /> <br />
    </Link>
   
  </div>
      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="input"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por país..."
          className="input"
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por área de desarrollo..."
          className="input"
          onChange={(e) => setFilters({ ...filters, Profesion: e.target.value })}
        />
      </div>

      {/* Tarjetas de Usuarios */}
      <div className="user-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <p className="no-users">No se encontraron usuarios.</p>
        )}
      </div>
    </div>
  );
}
