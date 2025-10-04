// Authentication middleware for API routes
import type { NextRequest } from "next/server"
import { verifyToken, extractTokenFromHeader } from "./jwt"

export async function authenticateRequest(request: NextRequest): Promise<{ userId: number; email: string } | null> {
  const authHeader = request.headers.get("authorization")
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return null
  }

  return { userId: payload.userId, email: payload.email }
}
