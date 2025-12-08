import { prisma } from "@/lib/prisma";
import {
    hashPassword,
    comparePassword,
    signToken,
    TokenPayload,
} from "@/lib/auth-utils";

/* ----------------------------------------------------
   TIPOS
---------------------------------------------------- */

interface RegisterData {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    role?: string;
}

interface LoginData {
    email: string;
    password: string;
}

/* ----------------------------------------------------
   REGISTER USER
---------------------------------------------------- */

export const registerUser = async (data: RegisterData) => {
    const { email, password, name, phone, role } = data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: name ?? "",
            phone: phone ?? "",
            role: role || "CLIENT",
        },
    });

    // VALIDACIÓN NECESARIA
    if (!user.email) {
        throw new Error("User has no valid email");
    }

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    return { user, token };
};

/* ----------------------------------------------------
   LOGIN USER
---------------------------------------------------- */

export const loginUser = async (data: LoginData) => {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Credenciales invalidas");
    }

    if (user.status === "DELETED") {
        throw new Error("Esta cuenta ha sido desactivada");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Credenciales invalidas");
    }

    // VALIDACIÓN DE EMAIL NO NULO
    if (!user.email) {
        throw new Error("User has no valid email");
    }

    // Último login
    await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
    });

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

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

/* ----------------------------------------------------
   GET USER BY ID
---------------------------------------------------- */

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: { id },
        include: { reservations: true },
    });
};
