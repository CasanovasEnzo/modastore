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
    {
      label: "Productos",
      value: productCount,
      prefix: "",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ),
    },
    {
      label: "Órdenes",
      value: orderCount,
      prefix: "",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
        </svg>
      ),
    },
    {
      label: "Usuarios",
      value: userCount,
      prefix: "",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Ingresos",
      value: Number(revenue._sum.total ?? 0).toLocaleString("es-AR"),
      prefix: "$",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ]

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending:    { label: "Pendiente",   className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    processing: { label: "En proceso",  className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    shipped:    { label: "Enviado",     className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    delivered:  { label: "Entregado",   className: "bg-green-500/10 text-green-400 border-green-500/20" },
    cancelled:  { label: "Cancelado",   className: "bg-red-500/10 text-red-400 border-red-500/20" },
  }

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-white/30 mt-1">Resumen general del negocio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:border-white/15 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-white/35 font-medium">{stat.label}</p>
              <span className="text-white/20">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold tracking-tight">
              {stat.prefix}{stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">Últimas órdenes</h2>
          <a href="/admin/ordenes" className="text-xs text-white/30 hover:text-white transition">Ver todas →</a>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl overflow-hidden">
          {recentOrders.length === 0 ? (
            <p className="text-white/30 text-sm px-6 py-10 text-center">Sin órdenes todavía.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">ID</th>
                  <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Cliente</th>
                  <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Items</th>
                  <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Total</th>
                  <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentOrders.map((order) => {
                  const sc = statusConfig[order.status] ?? { label: order.status, className: "bg-white/5 text-white/40 border-white/10" }
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-white/40">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-white/80">{order.user.name}</p>
                        <p className="text-[11px] text-white/30">{order.user.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-white/50 text-sm">{order.items.length}</td>
                      <td className="px-5 py-3.5 font-semibold text-white/80">
                        ${Number(order.total).toLocaleString("es-AR")}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${sc.className}`}>
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
