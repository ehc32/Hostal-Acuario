import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Endpoint público para obtener configuración básica (logo, nombre del sitio)
export async function GET() {
    try {
        let config;
        try {
            config = await prisma.configuration.findUnique({
                where: { id: 1 },
                select: {
                    siteName: true,
                    logoUrl: true,
                    siteDescription: true,
                    address: true,
                    phone: true,
                    supportEmail: true
                }
            });
        } catch (dbError) {
            console.error("Database error fetching public config:", dbError);
            // Retornar valores por defecto si falla
            return NextResponse.json({
                siteName: "Hostal Acuario",
                logoUrl: null,
                siteDescription: null,
                address: null,
                phone: null,
                supportEmail: null
            });
        }

        if (!config) {
            // Crear configuración por defecto
            config = await prisma.configuration.create({
                data: {
                    id: 1,
                    siteName: "Hostal Acuario",
                },
                select: {
                    siteName: true,
                    logoUrl: true,
                    siteDescription: true,
                    address: true,
                    phone: true,
                    supportEmail: true
                }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error("Error fetching public config:", error);
        // Retornar valores por defecto en caso de error
        return NextResponse.json({
            siteName: "Hostal Acuario",
            logoUrl: null,
            siteDescription: null,
            address: null,
            phone: null,
            supportEmail: null
        });
    }
}
