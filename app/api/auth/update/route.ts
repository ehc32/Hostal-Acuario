import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

export async function PUT(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        const { name, phone } = await request.json();

        // Actualizar usuario en la base de datos
        const updatedUser = await prisma.user.update({
            where: { id: decoded.id },
            data: {
                name,
                phone,
            },
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
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = verifyToken(token);

        // Borrado lógico: cambiar estado a DELETED en lugar de eliminar
        await prisma.user.update({
            where: { id: decoded.id },
            data: { status: 'DELETED' }
        });

        return NextResponse.json({ message: 'Cuenta desactivada exitosamente' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
