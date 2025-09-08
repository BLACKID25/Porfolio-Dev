import connectDB from "@/app/libs/mongodb";
import { NextResponse } from "next/server";
import { PerfilModel } from "@/app/models/Profile";
import { generateUsername } from "@/app/hooks/Username";

export async function POST(req) { 
  await connectDB();
    try {
        const profilebody = await req.json(); // Extraer el cuerpo de la solicitud
                
        //Obtenemos el user name a partir del nombre
     
        const username = generateUsername(profilebody.name); 
        
        // Extraemos el email
        const email = profilebody.email
        
        
        // ✅ Verificar si ya existe un perfil con ese email
        const perfilExistenteEmail = await PerfilModel.findOne({ email });
        if (perfilExistenteEmail) {
      
            return NextResponse.json({
                message: "Ya existe un perfil registrado con este correo electrónico.",
                code: "EMAIL_DUPLICATE"
            }, { status: 409 }); // 409: Conflict
        }

        // ✅ Verificar si ya existe un perfil con ese username
        const perfilExistenteUsername = await PerfilModel.findOne({ username });
            if (perfilExistenteUsername) {
            return NextResponse.json({
                message: "Ya existe un perfil con este nombre de usuario.",
                code: "USERNAME_DUPLICATE"
            }, { status: 409 });
        }

        // ✅ Si no existe, crear el perfil
        const NewPerfil = await PerfilModel.create({
        name: profilebody.name,
        username: username,
        email: email,
        phone: profilebody.phone,
        UrlLinkedin: profilebody.UrlLinkedin,
        Urlgithub: profilebody.Urlgithub,
        Urlinstagram: profilebody.Urlinstagram,
        Urlfacebook: profilebody.Urlfacebook,
        photo: profilebody.photo,
        curriCV: profilebody.curriCV,
        country: profilebody.country,
        Profesion: profilebody.Profesion,
        ageExpe: profilebody.ageExpe,
        description: profilebody.description,
        skills: profilebody.skills.split(',').map(skill => skill.trim()),
        typePlan: profilebody.typePlan,
        
        });

        return NextResponse.json({ data: NewPerfil }, { status: 201 });

    } catch (error) {
        console.error("Error al Procesar la Solicitud Crear Nuevo Perfil", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 409 });
    }
}

// crear funcion get
export async function GET(req) {
    await connectDB();
    try {
        const profiles = await PerfilModel.find();
        return NextResponse.json(profiles , { status: 200 });
    }
    catch (error){
        console.error("Error al procesar la solicitud de busqueda de usuarios:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status:
            500 });

    }
}   