"use client"; // Asegura que el componente es cliente en Next.js
import React from "react";
import { useRouter } from "next/navigation"; // Next.js usa esto
import "./card.css";

const UserCard = ({ user }) => {
  const router = useRouter();

  const skillsArray = Array.isArray(user.skills)
    ? user.skills.flatMap((skill) => skill.split(","))
    : user.skills?.split(",") || [];

    const handleClick = () => {
      router.push(`/${user.username}`); // Redirige al portafolio del usuario
    };

  return (
    <div className="cardprofesional" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="user-card">
        <div className="user-info">
          <img
            src={user.photo ? user.photo : "/avatar_06.png"}
            alt={`${user.name}'s Foto`}
            className="user-photo"
          />
          <h2 className="user-name">{user.name}</h2>
          <p className="user-profession">{user.Profesion}</p>
          <p className="user-age">{user.ageExpe} años de experiencia</p>
          <p className="user-country">País: {user.country}</p>

          {skillsArray.length > 0 && (
            <div className="user-skills">
              <strong>Habilidades:</strong>
              <ul>
                {skillsArray.map((skill, index) => (
                  <li key={index}>{skill.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="user-links">
            <strong>Encuentrame en:</strong>
            <br />
            {user.UrlLinkedin && (
              <a href={user.UrlLinkedin} target="_blank" rel="noopener noreferrer" className="social-button linkedin-button">
                LinkedIn
              </a>
            )}
            {user.Urlgithub && (
              <a href={user.Urlgithub} target="_blank" rel="noopener noreferrer" className="social-button github-button">
                GitHub
              </a>
            )}

            {user.Urlinstagram && (
              <a
                href={user.Urlinstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-button instagram-button"
              >
                Instagram
              </a>
            )}
            {user.Urlfacebook && (
              <a
                href={user.Urlfacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-button facebook-button"
              >
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
