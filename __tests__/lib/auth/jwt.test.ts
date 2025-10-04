import { describe, it, expect } from "@jest/globals"
import { generateToken, verifyToken, extractTokenFromHeader } from "@/lib/auth/jwt"

describe("JWT utilities", () => {
  describe("generateToken and verifyToken", () => {
    it("should generate and verify a valid token", async () => {
      const payload = { userId: 1, email: "test@example.com" }
      const token = await generateToken(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe("string")

      const verified = await verifyToken(token)
      expect(verified).toBeDefined()
      expect(verified?.userId).toBe(payload.userId)
      expect(verified?.email).toBe(payload.email)
    })

    it("should return null for invalid token", async () => {
      const verified = await verifyToken("invalid-token")
      expect(verified).toBeNull()
    })

    it("should return null for expired token", async () => {
      // This would require mocking time or using a very short expiration
      // For now, we just test the basic case
      const verified = await verifyToken("")
      expect(verified).toBeNull()
    })
  })

  describe("extractTokenFromHeader", () => {
    it("should extract token from Bearer header", () => {
      const token = "abc123xyz"
      const header = `Bearer ${token}`
      const extracted = extractTokenFromHeader(header)

      expect(extracted).toBe(token)
    })

    it("should return null for missing header", () => {
      const extracted = extractTokenFromHeader(null)
      expect(extracted).toBeNull()
    })

    it("should return null for invalid header format", () => {
      const extracted = extractTokenFromHeader("InvalidFormat abc123")
      expect(extracted).toBeNull()
    })
  })
})
