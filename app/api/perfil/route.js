import connectDB from "@/app/libs/mongodb";
import { NextResponse } from "next/server";
import { PerfilModel } from "@/app/models/Profile";

export async function POST(req) { 
    await connectDB();
    try {
        const profilebody = await req.json();
        console.log(profilebody);

        const NewPerfil = await PerfilModel.create({
            name: profilebody.name,
            email: profilebody.email,
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
            skills: profilebody.skills,
        });

        return NextResponse.json({ data: NewPerfil }, { status: 201 });

    } catch (error) {
        console.error("Error al Procesar la Solicitud Crear Nuevo Perfil", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
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