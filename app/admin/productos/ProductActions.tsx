"use client"

import { useRouter } from "next/navigation"

export default function ProductActions({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("¿Eliminar este producto?")) return
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert("Error al eliminar el producto. Intentá de nuevo.")
      return
    }
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      <a
        href={`/admin/productos/${id}/editar`}
        className="text-xs text-white/40 hover:text-white transition"
      >
        Editar
      </a>
      <button
        onClick={handleDelete}
        className="text-xs text-red-400/60 hover:text-red-400 transition"
      >
        Eliminar
      </button>
    </div>
  )
}
