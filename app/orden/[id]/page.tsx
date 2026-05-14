import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function OrdenPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order || order.userId !== session.user.id) notFound()

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-8 pt-32 pb-24">
        {/* Confirmación */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Orden confirmada</p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">¡Gracias por tu compra!</h1>
          <p className="text-white/40 text-sm font-mono">#{order.id.slice(-8).toUpperCase()}</p>
        </div>

        {/* Productos */}
        <div className="border border-white/10 rounded-3xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">
            Productos
          </h2>
          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      Talle: {item.size} · Color: {item.color} · x{item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold whitespace-nowrap">
                  ${(Number(item.price) * item.quantity).toLocaleString("es-AR")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border border-white/10 rounded-3xl p-6 mb-10">
          <div className="flex justify-between text-white/40 text-sm mb-3">
            <span>Envío</span>
            <span className="text-green-400">Gratis</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t border-white/10 pt-4">
            <span>Total</span>
            <span>${Number(order.total).toLocaleString("es-AR")}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/mis-ordenes"
            className="flex-1 text-center border border-white/10 py-3.5 rounded-full text-sm font-medium hover:border-white/30 transition"
          >
            Ver mis órdenes
          </a>
          <a
            href="/productos"
            className="flex-1 text-center bg-white text-black py-3.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
          >
            Seguir comprando
          </a>
        </div>
      </div>
    </main>
  )
}
