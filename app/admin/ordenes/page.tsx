import { prisma } from "@/lib/prisma"
import OrderStatusSelect from "./OrderStatusSelect"

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export default async function AdminOrdenesPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="px-10 py-10">
      <div className="mb-10">
        <p className="text-xs text-white/30 tracking-widest uppercase mb-2">Admin</p>
        <h1 className="text-3xl font-bold tracking-tight">Órdenes</h1>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-white/30 text-sm px-6 py-8">Sin órdenes todavía.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                <th className="text-left px-6 py-3">ID</th>
                <th className="text-left px-6 py-3">Fecha</th>
                <th className="text-left px-6 py-3">Cliente</th>
                <th className="text-left px-6 py-3">Items</th>
                <th className="text-left px-6 py-3">Total</th>
                <th className="text-left px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4 font-mono text-white/50 text-xs">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-white/50 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-white/40 text-xs">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {order.items.map((item) => (
                      <p key={item.id} className="text-xs">
                        {item.name} · {item.size} · x{item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${Number(order.total).toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
