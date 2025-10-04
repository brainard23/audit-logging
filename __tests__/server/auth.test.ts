import { describe, it, expect, beforeAll, afterAll } from "@jest/globals"

// Mock environment variables
process.env.JWT_SECRET = "test-secret-key"
process.env.DB_HOST = "localhost"
process.env.DB_PORT = "8889"
process.env.DB_USER = "root"
process.env.DB_PASSWORD = "root"
process.env.DB_NAME = "user_profile_service_test"

describe("Authentication Endpoints", () => {
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = "TestPass123"
  let authToken: string

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty("token")
      expect(data).toHaveProperty("user")
      expect(data.user.email).toBe(testEmail)
      expect(data.user).not.toHaveProperty("password_hash")

      authToken = data.token
    })

    it("should reject duplicate email registration", async () => {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      })

      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data).toHaveProperty("error")
      expect(data.error).toContain("already exists")
    })

    it("should reject weak password", async () => {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `weak-${Date.now()}@example.com`,
          password: "weak",
        }),
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty("error")
      expect(data).toHaveProperty("details")
    })

    it("should reject invalid email format", async () => {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "invalid-email",
          password: testPassword,
        }),
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty("error")
      expect(data.error).toContain("Invalid email")
    })
  })

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("token")
      expect(data).toHaveProperty("user")
      expect(data.user.email).toBe(testEmail)
    })

    it("should reject incorrect password", async () => {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: "WrongPassword123",
        }),
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty("error")
      expect(data.error).toContain("Invalid email or password")
    })

    it("should reject non-existent user", async () => {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: testPassword,
        }),
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty("error")
    })
  })

})
