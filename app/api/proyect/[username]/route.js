import connectDB from "@/app/libs/mongodb";
import { NextResponse } from "next/server";
import { ProyectModel } from "@/app/models/Proyect";

//metodo get para buscar los proyectos asociados al username por la URL

export async function GET(request, { params }){
    // Se espera que los paramtros esten resueltos
    
    const resParams = await params;
    console.log("llega por body", resParams)

    // verificamos si existen los parametros

    if (!resParams || !resParams.username){
        return NextResponse.json({error: "Falta el parametros username"})
    }

    //Extraemos el nombre del usuario solamente
    const {username} = resParams 

    try {
        //conexion con BD

        await connectDB()

        //buscamos todos los proyectos asociados al usuario por username
        const proyectAllUser = await ProyectModel.find({username})

        if(!proyectAllUser)
         {   
            return NextResponse.json({messaje: "No sen encontraron proyectos asociados al usuario"}, {status:404})
        } else {
            return NextResponse.json({data:proyectAllUser}, {status:200})
        }
    } catch (error) {
         // Si ocurre un error en la búsqueda, lo registramos y devolvemos un mensaje de error
         console.error("Error al procesar la solicitud de búsqueda", error);
         return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }

}