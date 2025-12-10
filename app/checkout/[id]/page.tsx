import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CheckoutClient } from "@/components/checkout-client"

interface CheckoutPageProps {
    params: Promise<{
        id: string
    }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
    const { id } = await params
    const sp = await searchParams

    const checkIn = sp.checkIn as string
    const checkOut = sp.checkOut as string
    const guests = Number(sp.guests) || 1

    const bookingType = (sp.type as "NIGHTLY" | "HOURLY") || "NIGHTLY"

    const roomId = parseInt(id)

    if (isNaN(roomId)) {
        return notFound()
    }

    const room = await prisma.room.findFirst({
        where: {
            OR: [
                { id: roomId },
                { slug: id } // Intenta buscar por slug si id no es numérico (aunque ya chequeamos isNaN, por si acaso cambiamos routing)
            ]
        }
    })

    if (!room) {
        return notFound()
    }

    return (
        <CheckoutClient
            room={room}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            bookingType={bookingType}
        />
    )
}
