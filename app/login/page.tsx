"use client"

import { useState, Suspense } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") ?? "/"

  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setPending(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    const { data, error } = await authClient.signIn.email({ email, password })

    if (error) {
      setError(error.message ?? "Error al iniciar sesión")
      setPending(false)
      return
    }

    const role = (data?.user as { role?: string })?.role
    router.push(role === "admin" ? "/admin" : redirectTo)
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10 text-center">
        <a href="/" className="text-base font-semibold tracking-tight">
          MODASTORE
        </a>
        <p className="text-white/40 text-sm mt-6">Iniciá sesión en tu cuenta</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs text-white/50 uppercase tracking-widest">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
            placeholder="tu@email.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs text-white/50 uppercase tracking-widest">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 bg-white text-black py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
        >
          {pending ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="text-center text-sm text-white/30 mt-8">
        ¿No tenés cuenta?{" "}
        <a href="/registro" className="text-white/70 hover:text-white transition">
          Registrate
        </a>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
