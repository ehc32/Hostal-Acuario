import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, TokenPayload } from '@/lib/auth-utils';

export async function PUT(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = verifyToken(token) as TokenPayload | null;

        if (!decoded) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const { name, phone } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id: decoded.id },
            data: { name, phone },
        });

        return NextResponse.json({
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                phone: updatedUser.phone,
                role: updatedUser.role,
                status: updatedUser.status,
                createdAt: updatedUser.createdAt,
                lastLogin: updatedUser.lastLogin,
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = verifyToken(token) as TokenPayload | null;

        if (!decoded) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        await prisma.user.update({
            where: { id: decoded.id },
            data: { status: 'DELETED' },
        });

        return NextResponse.json({ message: 'Cuenta desactivada exitosamente' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
