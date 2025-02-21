import React from "react";
import ProfileForm from "../components/Forms/agregarPerfil/agregarPerfil";

const ProfilePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-4">Crear Perfil</h1>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
