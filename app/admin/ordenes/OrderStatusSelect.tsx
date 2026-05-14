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

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className="bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-white/30 transition disabled:opacity-50 cursor-pointer"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value} className="bg-zinc-900">
          {s.label}
        </option>
      ))}
    </select>
  )
}
