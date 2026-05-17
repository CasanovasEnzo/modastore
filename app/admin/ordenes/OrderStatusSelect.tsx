"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

const statuses = [
  { value: "pending", label: "Pendiente" },
  { value: "processing", label: "En proceso" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleChange(newStatus: string) {
    const prevStatus = status
    setLoading(true)
    setStatus(newStatus)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        setStatus(prevStatus)
        alert("Error al actualizar el estado.")
        return
      }
      router.refresh()
    } catch {
      setStatus(prevStatus)
      alert("Error de conexión. Intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const colorMap: Record<string, string> = {
    pending:    "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    processing: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    shipped:    "text-purple-400 border-purple-500/30 bg-purple-500/10",
    delivered:  "text-green-400 border-green-500/30 bg-green-500/10",
    cancelled:  "text-red-400 border-red-500/30 bg-red-500/10",
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className={`border text-[11px] font-medium rounded-full px-3 py-1.5 focus:outline-none transition disabled:opacity-50 cursor-pointer ${colorMap[status] ?? "text-white/40 border-white/10 bg-white/5"}`}
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value} className="bg-zinc-900 text-white">
          {s.label}
        </option>
      ))}
    </select>
  )
}
