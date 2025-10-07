import nodemailer from "nodemailer";

export async function sendWelcomeEmail(email, username, profileURL) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const mailOptions = {
        from: `"Portfolio Web" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Tu Perfil Profesional ha sido activado",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color:#2d89ef;">Hola ${username},</h2>
            <p>
                Nos complace informarte que tu <strong>Perfil Profesional</strong> ha sido activado exitosamente.  
            </p>
            <p>
                A partir de ahora dispones de una herramienta digital diseñada para destacar tu trayectoria, 
                fortalecer tu presencia profesional y facilitar nuevas oportunidades de crecimiento.
            </p>
            <p style="margin-top:20px;">
                🔗 Accede a tu perfil aquí:  
                <a href="${profileURL}" style="color:#2d89ef; text-decoration:none; font-weight:bold;">${profileURL}</a>
            </p>
            <p>
                Te recomendamos mantener tu perfil actualizado para asegurar la mejor impresión ante colegas, 
                clientes y empresas interesadas en tu trabajo.
            </p>
            <hr style="margin:30px 0;">
            <p style="font-size:14px; color:#555;">
                Gracias por confiar en <strong>Portfolio Web</strong>.  
                Nuestro compromiso es brindarte una plataforma segura y profesional para tu desarrollo.
            </p>
            <p style="font-size:14px; color:#555;">Atentamente,<br>El equipo de Portfolio Web</p>
            </div>
        `,
    };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
}
