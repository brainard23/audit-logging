"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"

export function DashboardHeader() {
  const router = useRouter()
  const { user, token, clearAuth } = useAuth()

  const handleLogout = async () => {
    try {
      // Call logout API to log the action
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear auth state regardless of API call result
      clearAuth()
      router.push("/")
    }
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </header>
  )
}
