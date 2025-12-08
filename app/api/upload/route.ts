import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    try {
        const buffer = Buffer.from(await request.arrayBuffer());

        // Sanitizar nombre de archivo y hacerlo único
        const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueName = `${Date.now()}-${safeName}`;

        // Directorio de destino: public/uploads
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Crear directorio si no existe
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, uniqueName);
        await writeFile(filePath, buffer);

        // Url accesible desde el navegador
        const url = `/uploads/${uniqueName}`;

        return NextResponse.json({
            url,
            pathname: url,
            contentType: request.headers.get('content-type') || 'application/octet-stream'
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
