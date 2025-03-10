"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import "./porfolio.css";

const Portafolio = () => {
  const params = useParams();
  const username = params.username;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/perfil/${username}`);
        setUser(response.data.data);
      } catch (error) {
        console.error("Error al obtener datos del usuario", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUserData();
  }, [username]);

  if (loading) return <p className="loading">Cargando...</p>;
  if (!user) return <p className="error">Usuario no encontrado</p>;

  return (
    <div className="portfolio-container">
      {/* Foto de perfil */}
      <div className="profile-wrapper">
        <img src={user.photo} alt={user.name} className="profile-pic" />
      </div>

      <h1 className="portfolio-title">{user.name}</h1>
      <p className="portfolio-description">{user.personalDescription}</p>
      <p className="user-info">Profesión: {user.Profesion}</p>
      <p className="user-info">País: {user.country}</p>
      <p className="user-info">Experiencia: {user.ageExpe} años</p>

      {/* Redes sociales */}
      <div className="social-links">
        {user.linkedin && (
          <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedin />
          </a>
        )}
        {user.github && (
          <a href={user.github} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaGithub />
          </a>
        )}
        {user.twitter && (
          <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTwitter />
          </a>
        )}
      </div>

      {/* Habilidades */}
      <h2 className="section-title">Habilidades</h2>
      <ul className="skills-list">
        {user.skills?.map((skill, index) => (
          <li key={index} className="skill-item">{skill}</li>
        ))}
      </ul>

      {/* Últimos 3 proyectos */}
      <h2 className="section-title">Últimos proyectos</h2>
      <div className="projects-container">
        {user.projects?.slice(0, 3).map((project, index) => (
          <div key={index} className="project-card">
            <img src={project.image} alt={project.title} className="project-image" />
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
          </div>
        ))}
      </div>

      {/* Botón de descarga de CV */}
      <a href={user.curriCV} download className="download-button">
        Descargar CV
      </a>
    </div>
  );
};

export default Portafolio;
