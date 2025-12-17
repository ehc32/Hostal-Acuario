import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
        return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    try {
        // Fetch config from DB
        const config = await prisma.configuration.findUnique({ where: { id: 1 } });

        if (!config || !config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
            console.error("Cloudinary configuration missing in DB");
            return NextResponse.json({ error: "System upload misconfiguration" }, { status: 500 });
        }

        // Configure dynamically for this request
        cloudinary.config({
            cloud_name: config.cloudinaryCloudName,
            api_key: config.cloudinaryApiKey,
            api_secret: config.cloudinaryApiSecret
        });

        const buffer = Buffer.from(await request.arrayBuffer());

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "uploads" },
                (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                }
            );

            uploadStream.end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
