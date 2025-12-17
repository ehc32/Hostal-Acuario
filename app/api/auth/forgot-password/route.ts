import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import crypto from "crypto"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // No revelar que el usuario no existe por seguridad
            return NextResponse.json({ message: "Si el correo existe, se ha enviado un código." })
        }

        // Generar código de 6 dígitos
        const resetToken = crypto.randomInt(100000, 999999).toString()
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora de validez

        // Guardar en DB
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        })

        // -- Load config from DB --
        const config = await prisma.configuration.findUnique({ where: { id: 1 } });

        if (!config || !config.smtpHost || !config.smtpUser || !config.smtpPass) {
            console.error("SMTP configuration missing in DB");
            return NextResponse.json({ error: "System email misconfiguration" }, { status: 500 });
        }

        // Configurar transporte de correo
        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: Number(config.smtpPort || 587),
            secure: false, // true para 465, false para otros puertos
            auth: {
                user: config.smtpUser,
                pass: config.smtpPass,
            },
        })

        // Enviar correo
        await transporter.sendMail({
            from: `"${config.siteName || 'Hostal Acuario'}" <${config.supportEmail || config.smtpUser}>`,
            to: email,
            subject: "Recuperación de Contraseña",
            text: `Tu código de recuperación es: ${resetToken}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #d97706;">Hola ${user.name || 'Usuario'}</h2>
                    <p>Has solicitado restablecer tu contraseña en <strong>${config.siteName}</strong>. Usa el siguiente código para continuar:</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111;">${resetToken}</span>
                    </div>
                    <p>Este código expira en 1 hora.</p>
                    <p>Si no solicitaste esto, ignora este correo.</p>
                </div>
            `,
        })

        return NextResponse.json({ message: "Correo enviado con éxito" })

    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
    }
}
