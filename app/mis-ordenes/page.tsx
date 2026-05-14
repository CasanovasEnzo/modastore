import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function MisOrdenesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-8 pt-32 pb-24">
        <div className="mb-16">
          <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Mi cuenta</p>
          <h1 className="text-5xl font-bold tracking-tight">Mis órdenes</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32 border border-white/10 rounded-3xl">
            <p className="text-white/40 text-lg mb-8">Todavía no hiciste ninguna compra.</p>
            <a
              href="/productos"
              className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
            >
              Ver productos
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <a
                key={order.id}
                href={`/orden/${order.id}`}
                className="border border-white/10 rounded-3xl p-6 hover:border-white/20 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-white/30 font-mono mb-1">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-white/30">
                      {new Date(order.createdAt).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full capitalize">
                      {order.status === "pending" ? "Pendiente" : order.status}
                    </span>
                    <span className="text-white/30 group-hover:text-white transition text-sm">→</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-4">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-white/60">
                      {item.name} · Talle {item.size} · x{item.quantity}
                    </p>
                  ))}
                </div>

                <p className="text-sm font-semibold">
                  Total: ${Number(order.total).toLocaleString("es-AR")}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
