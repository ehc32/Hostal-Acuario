import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userInfo, reservationData } = body;

        if (!reservationData || !reservationData.roomId ||
            (!reservationData.checkIn && !reservationData.startDate) ||
            (!reservationData.checkOut && !reservationData.endDate)) {
            return NextResponse.json({ error: 'Faltan datos de la reserva' }, { status: 400 });
        }

        let userId: number;

        // 1. Verificar Autenticación (Usuario Logueado)
        const auth = await getAuthFromRequest(request); // Await por si acaso auth es async en el futuro o para consistencia

        if (auth) {
            userId = auth.userId;
        } else {
            // 2. Manejo de Usuario Invitado (Creación o Validación)
            if (!userInfo?.email || !userInfo?.phone || !userInfo?.name) {
                return NextResponse.json({ error: 'Para reservar como invitado, necesitamos tu nombre, email y teléfono.' }, { status: 400 });
            }

            // Verificar existencia previa
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: userInfo.email },
                        { phone: userInfo.phone }
                    ]
                }
            });

            if (existingUser) {
                // Si existe pero no está logueado, le pedimos login por seguridad
                return NextResponse.json({
                    error: 'Ya existe una cuenta registrada con este email o teléfono. Por favor inicia sesión para continuar.'
                }, { status: 409 });
            }

            // Crear nuevo usuario automáticamente
            // La contraseña será el número de teléfono por defecto
            const hashedPassword = await bcrypt.hash(userInfo.phone, 10);

            const newUser = await prisma.user.create({
                data: {
                    name: userInfo.name,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    password: hashedPassword,
                    role: 'CLIENT',
                    status: 'ACTIVE'
                }
            });

            userId = newUser.id;
        }

        // 3. Procesar Reserva
        const roomId = Number(reservationData.roomId);
        const room = await prisma.room.findUnique({ where: { id: roomId } });

        if (!room) {
            return NextResponse.json({ error: 'La habitación seleccionada no existe.' }, { status: 404 });
        }

        // Soportar ambos nombres de campos (backward compatibility)
        const checkInDate = new Date(reservationData.startDate || reservationData.checkIn);
        const checkOutDate = new Date(reservationData.endDate || reservationData.checkOut);

        // Calcular noches
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            return NextResponse.json({ error: 'Las fechas de reserva no son válidas.' }, { status: 400 });
        }

        const totalAmount = nights * room.price;

        const reservation = await prisma.reservation.create({
            data: {
                userId,
                roomId,
                startDate: checkInDate,
                endDate: checkOutDate,
                total: totalAmount,
                status: 'PENDING'
            }
        });

        return NextResponse.json({
            success: true,
            reservation,
            message: 'Reserva confirmada exitosamente',
            isNewUser: !auth // Flag para saber si se creó usuario
        });

    } catch (error) {
        console.error("Reservation Creation Error:", error);
        return NextResponse.json({ error: 'Error interno del servidor al procesar la reserva.' }, { status: 500 });
    }
}
