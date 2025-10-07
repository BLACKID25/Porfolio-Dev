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
                code: "EMAIL_DUPLICATE",
                data:{
                  username: perfilExistenteEmail.username,
                  email: perfilExistenteEmail.email
                }
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
// crear funcion get
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);

    // 📌 Parámetros de paginación
    const page = parseInt(searchParams.get("page")) || 1;   // página actual
    const limit = parseInt(searchParams.get("limit")) || 12; // cantidad por página
    const skip = (page - 1) * limit;

    // 📌 Filtros
    const name = searchParams.get("name") || "";
    const country = searchParams.get("country") || "";
    const profesion = searchParams.get("profesion") || "";

    // 📌 Construimos query dinámico
    const query = {
      planActivated: true,
      name: { $regex: name, $options: "i" },
      country: { $regex: country, $options: "i" },
      Profesion: { $regex: profesion, $options: "i" },
    };

    // 📌 Ejecutamos búsqueda paginada
    const [profiles, total] = await Promise.all([
      PerfilModel.find(query).skip(skip).limit(limit),
      PerfilModel.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        data: profiles,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al procesar la solicitud de búsqueda de usuarios:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
