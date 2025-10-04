"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  token: string | null
  user: { id: number; email: string } | null
  setAuth: (token: string, user: { id: number; email: string }) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "auth-storage",
    },
  ),
)
