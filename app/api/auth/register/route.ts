import { NextResponse } from 'next/server';
import { registerUser } from '@/services/auth-service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user, token } = await registerUser(body);
        return NextResponse.json({ user, token }, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
