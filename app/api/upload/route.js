import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

export const config = {
  api: { bodyParser: false }, // Next.js no parsea automáticamente
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fileType = formData.get("fileType");

    if (!file) {
      return NextResponse.json({ message: "No se envió archivo" }, { status: 400 });
    }

    // Validación de CV
    if (fileType && fileType.toUpperCase() === "CURRICV") {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { message: "Solo se permiten archivos PDF para el CV." },
          { status: 400 }
        );
      }
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { message: "El archivo debe tener extensión .pdf" },
          { status: 400 }
        );
      }
    }

    // Convertir Blob a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Configuración de Cloudinary
    const folderName = `portfolio_users/${fileType || "general"}`;
    const resourceType = fileType && fileType.toUpperCase() === "CURRICV" ? "raw" : "image";

    // Subida segura con logs
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: resourceType, // "raw" para CV, "image" para fotos
          format: resourceType === "raw" ? "pdf" : undefined,
        },
        (err, res) => {
          if (err) {
            console.error("Cloudinary upload error:", err);
            reject(err);
          } else {
            console.log("Cloudinary upload successful:", res.secure_url);
            resolve(res);
          }
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      message: "Archivo subido exitosamente",
    });
  } catch (error) {
    console.error("Error en /api/upload:", error);
    return NextResponse.json({ message: "Error en el servidor", error: error.message }, { status: 500 });
  }
}
