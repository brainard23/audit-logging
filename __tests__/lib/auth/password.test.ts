import { describe, it, expect } from "@jest/globals"
import { hashPassword, verifyPassword, validatePassword } from "@/lib/auth/password"

describe("Password utilities", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "TestPassword123"
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
    })

    it("should generate different hashes for the same password", async () => {
      const password = "TestPassword123"
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const password = "TestPassword123"
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)

      expect(isValid).toBe(true)
    })

    it("should reject incorrect password", async () => {
      const password = "TestPassword123"
      const hash = await hashPassword(password)
      const isValid = await verifyPassword("WrongPassword123", hash)

      expect(isValid).toBe(false)
    })
  })

  describe("validatePassword", () => {
    it("should accept valid password", () => {
      const result = validatePassword("ValidPass123")

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should reject password without uppercase", () => {
      const result = validatePassword("validpass123")

      expect(result.valid).toBe(false)
      expect(result.errors).toContain("Password must contain at least one uppercase letter")
    })

    it("should reject password without lowercase", () => {
      const result = validatePassword("VALIDPASS123")

      expect(result.valid).toBe(false)
      expect(result.errors).toContain("Password must contain at least one lowercase letter")
    })

    it("should reject password without number", () => {
      const result = validatePassword("ValidPassword")

      expect(result.valid).toBe(false)
      expect(result.errors).toContain("Password must contain at least one number")
    })

    it("should reject short password", () => {
      const result = validatePassword("Pass1")

      expect(result.valid).toBe(false)
      expect(result.errors).toContain("Password must be at least 8 characters long")
    })
  })
})
