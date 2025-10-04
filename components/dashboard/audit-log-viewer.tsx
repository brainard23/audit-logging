"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/hooks/use-auth"
import type { AuditLog } from "@/lib/db/types"

export function AuditLogViewer() {
  const { token } = useAuth()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/audit-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch audit logs")
      }

      const data = await response.json()
      setLogs(data.logs)
    } catch (err) {
      setError("Failed to load audit logs")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      USER_REGISTERED: "Account Created",
      USER_LOGIN: "Logged In",
      PROFILE_UPDATED: "Profile Updated",
    }
    return labels[action] || action
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>View your account activity history</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground">No activity yet</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border-l-2 border-primary pl-4 py-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{getActionLabel(log.action)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(log.created_at)}</p>
                </div>
                {log.new_values && Object.keys(log.new_values).length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Changes:</p>
                    <ul className="list-disc list-inside">
                      {Object.entries(log.new_values).map(([key, value]) => (
                        <li key={key}>
                          {key}: {String(value)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
