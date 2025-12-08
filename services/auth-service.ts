import { prisma } from '@/lib/prisma';
import { hashPassword, comparePassword, signToken } from '@/lib/auth-utils';

export const registerUser = async (data: any) => {
    const { email, password, name, phone, role } = data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            phone,
            role: role || "CLIENT",
        },
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return { user, token };
};

export const loginUser = async (data: any) => {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error('Credenciales invalidas');
    }

    // Verificar si la cuenta está eliminada
    if (user.status === 'DELETED') {
        throw new Error('Esta cuenta ha sido desactivada');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Credenciales invalidas');
    }

    // Actualizar última sesión
    await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
            lastLogin: new Date(),
        },
    };
};

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: { id },
        include: { reservations: true },
    });
};
