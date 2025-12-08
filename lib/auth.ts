/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/auth.ts
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export type AuthPayload = {
  userId: number
  role: string
  status: string
}

export function getAuthFromRequest(req: Request): AuthPayload | null {
  const header = req.headers.get("authorization")
  if (!header || !header.startsWith("Bearer ")) return null

  const token = header.split(" ")[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    // Mapeamos 'id' a 'userId' para compatibilidad con tokens antiguos y nuevos
    const rawId = payload.userId || payload.id
    const userId = Number(rawId)

    // Validar que sea un número válido (nuestra DB usa Int)
    if (isNaN(userId)) {
      console.warn("Token inválido: userId no es numérico", rawId)
      return null
    }

    return {
      userId: userId,
      role: payload.role,
      status: payload.status
    } as AuthPayload
  } catch {
    return null
  }
}

export function assertAuthenticated(payload: AuthPayload | null): asserts payload is AuthPayload {
  if (!payload) {
    const error: any = new Error("No autenticado")
    error.status = 401
    throw error
  }
}

export function assertAdmin(payload: AuthPayload | null) {
  assertAuthenticated(payload)

  if (payload.role !== "ADMIN") {
    const error: any = new Error("No autorizado")
    error.status = 403
    throw error
  }
}
