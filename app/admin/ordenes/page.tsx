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
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Órdenes</h1>
        <p className="text-sm text-white/30 mt-1">{orders.length} órdenes en total</p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/20 text-sm">Sin órdenes todavía.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">ID</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Fecha</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Cliente</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Items</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Total</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-5 py-3.5 font-mono text-[11px] text-white/40">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-xs whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-white/85">{order.user.name}</p>
                    <p className="text-[11px] text-white/30">{order.user.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-white/40 max-w-[200px]">
                    {order.items.map((item) => (
                      <p key={item.id} className="text-[11px] truncate">
                        {item.name} · {item.size} · x{item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-white/80 whitespace-nowrap">
                    ${Number(order.total).toLocaleString("es-AR")}
                  </td>
                  <td className="px-5 py-3.5">
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
