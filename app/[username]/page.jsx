"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaLinkedin, FaGithub, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import "./portfolio.css"; // Importamos los estilos en CSS
import Link from "next/link";

const Portafolio = () => {
  const params = useParams();
  const username = params.username;

  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/api/perfil/${username}`);
        setUser(userResponse.data.data);
  
        const projectsResponse = await axios.get(`/api/proyect/${username}`);
        setProjects(projectsResponse.data.data); // Cambié 'setUser' por 'setProjects' para no sobrescribir el estado de usuario
  
       // console.log("Usuario:", userResponse.data.data);
       // console.log("Proyectos:", projectsResponse.data.data);
      } catch (error) {
        console.error("Error al obtener datos del usuario o proyectos", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (username) fetchUserData();
  }, [username]); // Este useEffect depende de 'username', lo cual está bien
  
  
  return (
    
    <div className="portfolio-container">
      <div className="portfolio-overlay">
        <h1 className="background-title2">professional</h1>
        <h1 className="background-title">PORTFOLIO</h1>

        {/* Información del usuario */}
          <div className="portfolio-content">
            {/* Foto de perfil */}
            <div className="profile-wrapper">
              {user?.photo ? (
                <img src={user.photo} alt={user.name} className="profile-pic" />
              ) : (
                <img src="/avatar_06.png" alt="Avatar por defecto" className="profile-pic" />
              )}
            </div>

            {/* Datos del usuario */}
            <div className="info-container">
              <h1 className="portfolio-title">{user.name}</h1>
              {/* Botón de descarga de CV */}
              <a href={user.curriCV} download className="download-button">
                Descargar CV
              </a>
              <div className="divider"></div>
              <ul className="skills-list">
                {user.skills?.map((skill, index) => (
                  <li key={index} className="skill-item">{skill}</li>
                ))}
              </ul>
              <p className="portfolio-description">{user.description}</p>
              <p className="user-info"><strong>Profesión:</strong> {user.Profesion}</p>
              <p className="user-info"><strong>País:</strong> {user.country}</p>
              <p className="user-info"><strong>Experiencia:</strong> {user.ageExpe} años</p>

              <div className="social-links">
                {user.UrlLinkedin && (
                  <a href={user.UrlLinkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaLinkedin />
                  </a>
                )}
                {user.Urlgithub && (
                  <a href={user.Urlgithub} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaGithub />
                  </a>
                )}
                {user.Urlinstagram && (
                  <a href={user.Urlinstagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaInstagram />
                  </a>
                )}
                {user.Urlfacebook && (
                  <a href={user.Urlfacebook} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaFacebook />
                  </a>
                )}
              </div>

          </div>
        </div>

          {/* Habilidades
          <h2 className="section-title">Habilidades</h2>
          <ul className="skills-list">
            {user.skills?.map((skill, index) => (
              <li key={index} className="skill-item">{skill}</li>
            ))}
          </ul> */}

          <h2 className="section-title">Últimos proyectos</h2>
          <div className="projects-container">
            {projects?.length > 0 ? (
              projects.slice(0, 3).map((project, index) => (
                <div key={index} className="project-card">
                  <img src={project.photoproyect || "/icono proyect.jpg"} alt={project.nameproyect || "Proyecto"} className="project-image" />
                  <h3 className="project-title">{project.nameproyect || "Sin título"}</h3>
                  <p className="project-description">{project.descproyect || "Sin descripción"}</p>
                </div>
              ))
            ) : (
              <p>No hay proyectos disponibles</p>
            )}
          </div>

        
        <div>
          <Link href="/">
            <button className="button-porfolio">Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Portafolio;
