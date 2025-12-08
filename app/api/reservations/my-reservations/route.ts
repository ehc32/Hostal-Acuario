import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

// Force dynamic para evitar cache estático en Vercel
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const auth = await getAuthFromRequest(request);

        if (!auth) {
            return NextResponse.json({ error: 'Debes iniciar sesión para ver tus reservas.' }, { status: 401 });
        }

        const reservations = await prisma.reservation.findMany({
            where: { userId: auth.userId },
            include: {
                room: {
                    select: {
                        id: true,
                        title: true,
                        images: true,
                        slug: true,
                        holder: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' } // Las más recientes arriba
        });

        return NextResponse.json(reservations);

    } catch (error) {
        console.error("Error fetching my reservations:", error);
        return NextResponse.json({ error: 'Error interno al cargar reservaciones.' }, { status: 500 });
    }
}
