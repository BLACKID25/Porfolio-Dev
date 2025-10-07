// /app/api/send-welcome-email/route.js
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/app/hooks/sendEmail";

export async function POST(req) {
  try {
    const { email, username } = await req.json();

    if (!email || !username) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

      // 👇 Toma el dominio desde env
    const baseURL = process.env.NEXT_PUBLIC_DOMAIN;
    const profileURL = `${baseURL}/${username}`;

    
    await sendWelcomeEmail(email, username, profileURL);

    return NextResponse.json({ message: "Correo enviado correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error en API enviar correo:", error);
    return NextResponse.json({ message: "Error enviando correo" }, { status: 500 });
  }
}
