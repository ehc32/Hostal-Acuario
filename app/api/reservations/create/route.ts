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

        const bookingType = reservationData.type || 'NIGHTLY'; // Recibimos el tipo

        // Validaciones de fechas
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();

        // Si es NIGHTLY, debe haber al menos 1 día de diferencia
        if (bookingType === 'NIGHTLY') {
            const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (nights <= 0) {
                return NextResponse.json({ error: 'Para hospedaje por noche, la salida debe ser después de la llegada.' }, { status: 400 });
            }
        }
        // Si es HOURLY, la fecha puede ser la misma (pero no anterior)
        else if (bookingType === 'HOURLY') {
            if (diffTime < 0) {
                return NextResponse.json({ error: 'La fecha no es válida.' }, { status: 400 });
            }
        }

        let totalAmount = 0;

        if (bookingType === 'HOURLY') {
            // Precio fijo por sesión (3 Horas)
            // Usamos un casting a 'any' temporal si room.priceHour no es reconocido por tipos viejos
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hourlyPrice = Number((room as any).priceHour) || 0;
            if (hourlyPrice <= 0) {
                return NextResponse.json({ error: 'Esta habitación no admite reservas por horas.' }, { status: 400 });
            }
            totalAmount = hourlyPrice;
        } else {
            // Precio por Noche
            const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalAmount = nights * room.price;
        }

        const reservation = await prisma.reservation.create({
            data: {
                userId,
                roomId,
                startDate: checkInDate,
                endDate: checkOutDate,
                total: totalAmount,
                status: 'PENDING',
                type: bookingType // Guardamos el tipo de reserva (NIGHTLY o HOURLY)
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
