import { describe, it, expect, beforeAll } from "@jest/globals"

// Mock environment variables
process.env.JWT_SECRET = "test-secret-key"
process.env.DB_HOST = "localhost"
process.env.DB_PORT = "8889"
process.env.DB_USER = "root"
process.env.DB_PASSWORD = "root"
process.env.DB_NAME = "user_profile_service_test"

describe("Profile Endpoints", () => {
  let authToken: string
  const testEmail = `profile-test-${Date.now()}@example.com`
  const testPassword = "TestPass123"

  beforeAll(async () => {
    // Register a test user and get token
    const response = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    })

    const data = await response.json()
    authToken = data.token
  })

  describe("GET /api/profile", () => {
    it("should get user profile with valid token", async () => {
      const response = await fetch("http://localhost:3001/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("profile")
      expect(data.profile).toHaveProperty("id")
      expect(data.profile).toHaveProperty("user_id")
    })

    it("should reject request without token", async () => {
      const response = await fetch("http://localhost:3001/api/profile", {
        method: "GET",
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty("error")
    })

    it("should reject request with invalid token", async () => {
      const response = await fetch("http://localhost:3001/api/profile", {
        method: "GET",
        headers: {
          Authorization: "Bearer invalid-token",
        },
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty("error")
    })
  })

  describe("PUT /api/profile", () => {
    it("should update profile successfully", async () => {
      const profileData = {
        first_name: "John",
        last_name: "Doe",
        bio: "Test bio",
        avatar_url: "https://example.com/avatar.jpg",
      }

      const response = await fetch("http://localhost:3001/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("profile")
      expect(data.profile.first_name).toBe(profileData.first_name)
      expect(data.profile.last_name).toBe(profileData.last_name)
      expect(data.profile.bio).toBe(profileData.bio)
      expect(data.profile.avatar_url).toBe(profileData.avatar_url)
    })

    it("should update partial profile fields", async () => {
      const partialData = {
        first_name: "Jane",
      }

      const response = await fetch("http://localhost:3001/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(partialData),
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.profile.first_name).toBe(partialData.first_name)
    })

    it("should reject update without token", async () => {
      const response = await fetch("http://localhost:3001/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name: "Test" }),
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty("error")
    })

    it("should create audit log entry for profile update", async () => {
      // Update profile
      await fetch("http://localhost:3001/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ bio: "Updated bio for audit test" }),
      })

      // Check audit logs
      const logsResponse = await fetch("http://localhost:3001/api/audit-logs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const logsData = await logsResponse.json()

      expect(logsResponse.status).toBe(200)
      expect(logsData).toHaveProperty("logs")
      expect(Array.isArray(logsData.logs)).toBe(true)

      // Find PROFILE_UPDATED action
      const profileUpdateLog = logsData.logs.find(
        (log: any) => log.action === "PROFILE_UPDATED"
      )

      expect(profileUpdateLog).toBeDefined()
      expect(profileUpdateLog).toHaveProperty("old_values")
      expect(profileUpdateLog).toHaveProperty("new_values")
    })
  })
})
