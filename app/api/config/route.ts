import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Helpers
function ok<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
}

function fail(message: string, status = 500, extra?: any) {
    return NextResponse.json(
        { ok: false, message, ...(extra ? { extra } : {}) },
        { status }
    );
}

function normalizeImageField(value: any) {
    // ✅ undefined => no tocar (no viene en el body)
    if (value === undefined) return undefined;

    // ✅ null => borrar explícitamente
    if (value === null) return null;

    // ✅ string (incluso vacío) => guardarlo tal cual
    if (typeof value === "string") return value;

    // Si llega raro (número, objeto, etc), no tocar
    return undefined;
}

function normalizeGallery(value: any) {
    // undefined => no tocar
    if (value === undefined) return undefined;

    // Si no es array, lo dejamos vacío para evitar reventones
    if (!Array.isArray(value)) return [];

    // Filtra basura
    return value
        .filter((x) => typeof x === "string")
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
}

export async function GET() {
    try {
        // Traemos la fila id=1
        const row: any[] =
            await prisma.$queryRaw`SELECT * FROM "Configuration" WHERE id = 1 LIMIT 1`;

        if (!row.length) {
            // Si no existe, la creamos con defaults
            await prisma.$executeRaw`
        INSERT INTO "Configuration" (id, "siteName", "updatedAt")
        VALUES (1, 'Hostal Acuario', NOW())
        ON CONFLICT (id) DO NOTHING
      `;

            return ok({
                id: 1,
                siteName: "Hostal Acuario",
                heroImage: "",
                infoImage: "",
                galleryImages: [],
            });
        }

        const r = row[0];

        // Mapeo robusto (por si hay columnas viejas)
        const config = {
            ...r,
            heroImage: r.hero_image ?? r.heroImage ?? "",
            infoImage: r.info_image ?? r.infoImage ?? "",
            galleryImages: r.gallery_images ?? r.galleryImages ?? [],
            logoUrl: r.logoUrl ?? "",
        };

        return ok(config);
    } catch (error: any) {
        console.error("GET Config Error:", error);
        return fail(
            "Uy, algo pasó consultando la configuración. Intenta de nuevo.",
            500
        );
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        console.log("📥 Body recibido en PUT:", JSON.stringify(body, null, 2));

        // 🔎 Normalizamos campos
        const hero = normalizeImageField(body.heroImage);
        const info = normalizeImageField(body.infoImage);
        const gallery = normalizeGallery(body.galleryImages);

        console.log("✅ Campos normalizados:", { hero, info, gallery });

        // ✅ Construimos el UPDATE dinámico para NO pisar con vacíos
        const fields: string[] = [];
        const values: any[] = [];
        let i = 1;

        const add = (sqlField: string, value: any, cast?: string) => {
            fields.push(`${sqlField} = $${i}${cast ? `::${cast}` : ""}`);
            values.push(value);
            i++;
        };

        // Campos normales (si vienen undefined igual los setea, está bien porque son inputs)
        add(`"siteName"`, body.siteName ?? "");
        add(`"siteDescription"`, body.siteDescription ?? "");
        add(`"supportEmail"`, body.supportEmail ?? "");
        add(`"logoUrl"`, body.logoUrl ?? "");
        add(`"address"`, body.address ?? "");
        add(`"phone"`, body.phone ?? "");
        add(`"cloudinaryCloudName"`, body.cloudinaryCloudName ?? "");
        add(`"cloudinaryApiKey"`, body.cloudinaryApiKey ?? "");
        add(`"cloudinaryApiSecret"`, body.cloudinaryApiSecret ?? "");
        add(`"smtpHost"`, body.smtpHost ?? "smtp.gmail.com");
        add(`"smtpPort"`, body.smtpPort ?? "587");
        add(`"smtpUser"`, body.smtpUser ?? "");
        add(`"smtpPass"`, body.smtpPass ?? "");

        // ✅ SOLO tocamos imagen si viene algo válido (string) o null (borrar)
        if (hero !== undefined) add(`"hero_image"`, hero);
        if (info !== undefined) add(`"info_image"`, info);

        // ✅ SOLO tocamos galería si viene en body (si no viene, no la dañamos)
        if (gallery !== undefined) add(`"gallery_images"`, gallery, "text[]");

        add(`"updatedAt"`, new Date());

        values.push(1); // where id = 1

        const sql = `
      UPDATE "Configuration"
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING *
    `;

        console.log("🔍 SQL generado:", sql);
        console.log("🔍 Valores:", values);

        const updated: any[] = await prisma.$queryRawUnsafe(sql, ...values);
        const u = updated?.[0];

        if (!u) {
            return fail(
                "No pude actualizar la configuración porque no encontré el registro (id=1).",
                404
            );
        }

        console.log("✅ Registro actualizado en DB:", u);

        // Devolvemos consistente con frontend
        const response = {
            ...u,
            heroImage: u.hero_image ?? "",
            infoImage: u.info_image ?? "",
            galleryImages: u.gallery_images ?? [],
        };

        console.log("📤 Response enviado al frontend:", response);

        return ok(response);
    } catch (error: any) {
        console.error("❌ PUT Config Error:", error);

        // Mensaje suave, no brusco
        return fail(
            "Parce, no se pudo guardar la configuración. Revisa la consola del servidor pa' ver el detalle.",
            500
        );
    }
}