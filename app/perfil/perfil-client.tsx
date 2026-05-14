"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
  user: { id: string; name: string; email: string; createdAt: Date; image?: string | null }
  orderCount: number
  hasPassword: boolean
  providers: string[]
}

export default function PerfilClient({ user, orderCount, hasPassword, providers }: Props) {
  const router = useRouter()

  const [name, setName] = useState(user.name)
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passLoading, setPassLoading] = useState(false)
  const [passMsg, setPassMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  async function saveName(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || name === user.name) return
    setNameLoading(true)
    setNameMsg(null)
    const { error } = await authClient.updateUser({ name: name.trim() })
    if (error) {
      setNameMsg({ ok: false, text: error.message ?? "Error al actualizar" })
    } else {
      setNameMsg({ ok: true, text: "Nombre actualizado" })
      router.refresh()
    }
    setNameLoading(false)
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) {
      setPassMsg({ ok: false, text: "La nueva contraseña debe tener al menos 8 caracteres" })
      return
    }
    setPassLoading(true)
    setPassMsg(null)
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    })
    if (error) {
      setPassMsg({ ok: false, text: error.message ?? "Error al cambiar la contraseña" })
    } else {
      setPassMsg({ ok: true, text: "Contraseña actualizada" })
      setCurrentPassword("")
      setNewPassword("")
    }
    setPassLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-8 pt-32 pb-24">
        <div className="mb-12">
          <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Mi cuenta</p>
          <h1 className="text-5xl font-bold tracking-tight">Perfil</h1>
        </div>

        {/* Avatar + info */}
        <div className="border border-white/10 rounded-3xl p-6 mb-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg truncate">{user.name}</p>
            <p className="text-white/40 text-sm truncate">{user.email}</p>
            <p className="text-white/20 text-xs mt-1">
              Miembro desde{" "}
              {new Date(user.createdAt).toLocaleDateString("es-AR", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          {providers.includes("google") && (
            <span className="text-xs border border-white/10 px-3 py-1 rounded-full text-white/40 flex-shrink-0">
              Google
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <a
            href="/mis-ordenes"
            className="border border-white/10 rounded-2xl p-5 hover:border-white/20 transition group"
          >
            <p className="text-3xl font-bold mb-1">{orderCount}</p>
            <p className="text-sm text-white/40 group-hover:text-white/60 transition">
              {orderCount === 1 ? "Orden" : "Órdenes"} →
            </p>
          </a>
          <div className="border border-white/10 rounded-2xl p-5">
            <p className="text-3xl font-bold mb-1">
              {providers.length}
            </p>
            <p className="text-sm text-white/40">
              {providers.length === 1 ? "Método de acceso" : "Métodos de acceso"}
            </p>
          </div>
        </div>

        {/* Editar nombre */}
        <div className="border border-white/10 rounded-3xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">
            Editar nombre
          </h2>
          <form onSubmit={saveName} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition"
              placeholder="Tu nombre"
            />
            {nameMsg && (
              <p className={`text-sm ${nameMsg.ok ? "text-green-400" : "text-red-400"}`}>
                {nameMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={nameLoading || name === user.name || !name.trim()}
              className="self-start bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-40"
            >
              {nameLoading ? "Guardando..." : "Guardar"}
            </button>
          </form>
        </div>

        {/* Cambiar contraseña — solo si tiene password */}
        {hasPassword && (
          <div className="border border-white/10 rounded-3xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">
              Cambiar contraseña
            </h2>
            <form onSubmit={changePassword} className="flex flex-col gap-4">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition"
                placeholder="Contraseña actual"
                autoComplete="current-password"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition"
                placeholder="Nueva contraseña (mín. 8 caracteres)"
                autoComplete="new-password"
              />
              {passMsg && (
                <p className={`text-sm ${passMsg.ok ? "text-green-400" : "text-red-400"}`}>
                  {passMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={passLoading || !currentPassword || !newPassword}
                className="self-start bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-40"
              >
                {passLoading ? "Cambiando..." : "Cambiar contraseña"}
              </button>
            </form>
          </div>
        )}

        {/* Cerrar sesión */}
        <div className="border border-white/10 rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
            Sesión
          </h2>
          <button
            onClick={async () => {
              await authClient.signOut()
              router.push("/")
            }}
            className="text-sm text-red-400 hover:text-red-300 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  )
}
