import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const auth = getAuthFromRequest(req);
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Obtener configuración
        let config = await prisma.configuration.findUnique({
            where: { id: 1 }
        });

        if (!config) {
            // Crear por defecto
            config = await prisma.configuration.create({
                data: {
                    id: 1,
                    siteName: "Hostal Acuario",
                }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error("Error fetching config:", error);
        return NextResponse.json({ error: "Error fetching configuration" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const auth = getAuthFromRequest(req);
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Destructure to sanitize input and avoid passing unknown fields to Prisma
        const {
            siteName,
            siteDescription,
            supportEmail,
            address,
            phone,
            cloudinaryCloudName,
            cloudinaryApiKey,
            cloudinaryApiSecret,
            smtpHost,
            smtpPort,
            smtpUser,
            smtpPass
        } = body;

        const dataToUpdate = {
            siteName,
            siteDescription,
            supportEmail,
            address,
            phone,
            cloudinaryCloudName,
            cloudinaryApiKey,
            cloudinaryApiSecret,
            smtpHost,
            smtpPort,
            smtpUser,
            smtpPass,
            updatedAt: new Date()
        };

        // Remove undefined fields
        Object.keys(dataToUpdate).forEach(key =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (dataToUpdate as any)[key] === undefined && delete (dataToUpdate as any)[key]
        );

        const config = await prisma.configuration.upsert({
            where: { id: 1 },
            update: dataToUpdate,
            create: {
                id: 1,
                ...dataToUpdate
            }
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error("Error updating config:", error);
        // Devolver el mensaje de error real para debugging
        return NextResponse.json({
            error: "Error updating configuration",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
