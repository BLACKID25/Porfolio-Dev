import connectDB from "@/app/libs/mongodb";
import { NextResponse } from "next/server";
import { ProyectModel } from "@/app/models/Proyect";

export async function POST(req) {

    await connectDB() // conexexion con la BD
    
    try {
        const proyectbody = await req.json()
        console.log("Proyectos del Body", proyectbody)

        const NewProyect = await ProyectModel.create ({
            username: proyectbody.username,
            nameproyect: proyectbody.nameproyect,
            tecnologiproyect: proyectbody.tecnologiproyect,
            photoproyect: proyectbody.photoproyect,
            descproyect: proyectbody.descproyect
        })

        return NextResponse.json({data:NewProyect}, { status : 200} )

    } catch (error) {
        console.error ("Error al procesar la solicitud de creacion de Proyectos al Usuario")
        return NextResponse.json ({message:"Error interno de procesar solicitud"}, { status : 500 })
    }
}