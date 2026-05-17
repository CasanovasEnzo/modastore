"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ role }) => {
        router.replace(role === "admin" ? "/admin" : "/")
      })
      .catch(() => router.replace("/"))
  }, [router])

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-white/40 text-sm">Iniciando sesión...</p>
    </main>
  )
}
