import connectDB from "@/app/libs/mongodb";
import { NextResponse } from "next/server";
import { PerfilModel } from "@/app/models/Profile";

// MÉTODO GET PARA BUSCAR POR USERNAME EN LA URL

export async function GET(request, { params }) {
    // Esperamos que los parámetros estén resueltos
    const resolvedParams = await params;  // Esperamos la resolución de los parámetros

    // Verificamos si los parámetros existen
    if (!resolvedParams || !resolvedParams.username) {
        return NextResponse.json({ error: "Falta el parámetro username" }, { status: 400 });
    }

    const { username } = resolvedParams;  // Extraemos el nombre de usuario
    //console.log("Buscando usuario con username:", username);
    
    try {
        // Conectamos a la base de datos
        await connectDB();
        
        // Buscamos el usuario por el username
        const urlUser = await PerfilModel.findOne({ username });

        if (!urlUser) {
            // Si no encontramos el usuario, devolvemos un mensaje de error
            return NextResponse.json({ message: "No se encontró el username para crear la URL" }, { status: 404 });
        } else {
            // Si encontramos el usuario, devolvemos un mensaje exitoso
            return NextResponse.json({ data: urlUser }, { status: 200 });
        }
    } catch (error) {
        // Si ocurre un error en la búsqueda, lo registramos y devolvemos un mensaje de error
        console.error("Error al procesar la solicitud de búsqueda", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
