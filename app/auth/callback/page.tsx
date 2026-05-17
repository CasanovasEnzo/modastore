"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      const role = (data?.user as { role?: string })?.role
      router.replace(role === "admin" ? "/admin" : "/")
    })
  }, [router])

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-white/40 text-sm">Iniciando sesión...</p>
    </main>
  )
}
