"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileEditor } from "@/components/dashboard/profile-editor"
import { AuditLogViewer } from "@/components/dashboard/audit-log-viewer"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileEditor />
          <AuditLogViewer />
        </div>
      </main>
    </div>
  )
}
