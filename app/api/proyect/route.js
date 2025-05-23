import connectDB from "@/app/libs/mongodb";
import { NextResponse } from "next/server";
import { ProyectModel } from "@/app/models/Proyect";
import { generateUsername } from "@/app/Hooks/Username";

export async function POST(req) {

    await connectDB() // conexexion con la BD
    
    try {
        const proyectbody = await req.json()
        console.log("Proyectos del Body", proyectbody.name)
        const proyect = proyectbody.proyectos // Extraer el array de proyectos del cuerpo de la solicitud


         // Validamos que sea un array
            if (!Array.isArray(proyect)) {
             return NextResponse.json({ message: "Formato inválido" }, { status: 400 });
            }
  
        // Creamos todos los proyectos usando Promise.all
            const nuevosProyectos = await Promise.all(
                proyect.map(async (proyecto) => {
                    const newProyect = await ProyectModel.create({
                    username: generateUsername(proyectbody.name),
                    nameproyect: proyecto.nameproyect,
                    tecnologiproyect: proyecto.tecnologiproyect,
                    photoproyect: proyecto.photoproyect,
                    descproyect: proyecto.descproyect,
                    });
                    return newProyect;
                })
            );

    return NextResponse.json({ data: nuevosProyectos }, { status: 200 });
  } catch (error) {
    console.error("Error al procesar la solicitud de creación de proyectos:", error);
    return NextResponse.json({ message: "Error interno al procesar solicitud" }, { status: 500 });
  }
}