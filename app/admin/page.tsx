import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
  })

  const stats = [
    { label: "Productos", value: productCount, suffix: "" },
    { label: "Órdenes", value: orderCount, suffix: "" },
    { label: "Usuarios", value: userCount, suffix: "" },
    { label: "Ingresos", value: Number(revenue._sum.total ?? 0).toLocaleString("es-AR"), suffix: "$" },
  ]

  const statusLabel: Record<string, string> = {
    pending: "Pendiente",
    processing: "En proceso",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  }

  return (
    <div className="px-10 py-10">
      <div className="mb-10">
        <p className="text-xs text-white/30 tracking-widest uppercase mb-2">Panel de administración</p>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">{stat.label}</p>
            <p className="text-2xl font-bold">
              {stat.suffix}{stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
          Últimas órdenes
        </h2>
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          {recentOrders.length === 0 ? (
            <p className="text-white/30 text-sm px-6 py-8">Sin órdenes todavía.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                  <th className="text-left px-6 py-3">ID</th>
                  <th className="text-left px-6 py-3">Cliente</th>
                  <th className="text-left px-6 py-3">Items</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 font-mono text-white/50">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-white/40 text-xs">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-white/60">{order.items.length}</td>
                    <td className="px-6 py-4 font-semibold">
                      ${Number(order.total).toLocaleString("es-AR")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                        {statusLabel[order.status] ?? order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
