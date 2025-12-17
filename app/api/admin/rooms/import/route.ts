import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthFromRequest } from "@/lib/auth"
import { ClimateType } from "@prisma/client"

export const dynamic = 'force-dynamic'

function getField(obj: any, possibleKeys: string[]): any {
    for (const key of possibleKeys) {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
            return obj[key];
        }
    }
    return undefined;
}

export async function POST(req: Request) {
    try {
        const auth = getAuthFromRequest(req)
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { rooms } = body

        if (!Array.isArray(rooms) || rooms.length === 0) {
            return NextResponse.json({ error: "No rooms data provided" }, { status: 400 })
        }

        let createdCount = 0
        let errors = 0

        for (const roomData of rooms) {
            try {
                // Mapeo flexible de campos (Español/Inglés)
                const title = getField(roomData, ['title', 'Title', 'Nombre', 'Titulo', 'Habitación']) || "Habitación Importada";
                const description = getField(roomData, ['description', 'Description', 'Descripción', 'Detalle']) || "Sin descripción";

                const priceVal = getField(roomData, ['price', 'Precio', 'Precio/Noche', 'Noche']);
                const price = priceVal ? Number(String(priceVal).replace(/[^0-9.]/g, '')) : 0;

                const priceHourVal = getField(roomData, ['priceHour', 'Precio/Hora', 'Hora']);
                const priceHour = priceHourVal ? Number(String(priceHourVal).replace(/[^0-9.]/g, '')) : 0;

                const holder = getField(roomData, ['holder', 'Holder', 'Propietario', 'Dueño']) || "Admin";

                // Procesar Clima
                const climateRaw = getField(roomData, ['climate', 'Clima', 'Tipo', 'Aire'])?.toString().toUpperCase() || "";
                let climate: ClimateType = ClimateType.NONE;
                if (climateRaw.includes("AIRE") || climateRaw.includes("AC") || climateRaw === "A") climate = ClimateType.AIRE;
                else if (climateRaw.includes("VENTILADOR") || climateRaw.includes("FAN") || climateRaw === "V") climate = ClimateType.VENTILADOR;

                // Procesar Imágenes
                const imageField = getField(roomData, ['images', 'image', 'Imagen', 'Foto', 'Fotos', 'Url']);
                let images: string[] = [];

                if (Array.isArray(imageField)) {
                    images = imageField.filter(i => typeof i === 'string' && i.length > 0);
                } else if (typeof imageField === 'string') {
                    // Separar por comas, punto y coma, o saltos de línea
                    images = imageField.split(/[,;\n]+/).map(s => s.trim()).filter(s => s.length > 0);
                }

                // Si no hay imágenes, poner placeholder si se desea, o dejar vacío array
                if (images.length === 0) {
                    // Opcional: images.push("/placeholder-room.jpg");
                }


                // Generar slug único robusto
                const baseSlug = title.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');

                const slug = `${baseSlug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                await prisma.room.create({
                    data: {
                        title,
                        description,
                        price,
                        priceHour,
                        climate,
                        slug,
                        holder,
                        images,
                        amenities: [], // Por ahora vacío o podrías mapearlo igual
                    }
                })
                createdCount++
            } catch (err) {
                console.error("Error importing room:", roomData, err)
                errors++
            }
        }

        return NextResponse.json({
            success: true,
            imported: createdCount,
            failed: errors
        })
    } catch (error) {
        console.error("Error processing import:", error)
        return NextResponse.json({ error: "Error processing import" }, { status: 500 })
    }
}
