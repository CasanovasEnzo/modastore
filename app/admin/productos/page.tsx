import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ProductActions from "./ProductActions"

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-sm text-white/30 mt-1">{products.length} productos en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo producto
        </Link>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/20 text-sm">Sin productos todavía.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Producto</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Categoría</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Género</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Precio</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Stock</th>
                <th className="text-left px-5 py-3 text-[11px] text-white/30 font-medium uppercase tracking-widest">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {products.map((product) => {
                const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0)
                return (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-white/85">{product.name}</p>
                      <p className="text-[11px] text-white/25 font-mono mt-0.5">{product.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-white/50 capitalize text-sm">{product.category.name}</td>
                    <td className="px-5 py-3.5 text-white/50 capitalize text-sm">{product.gender}</td>
                    <td className="px-5 py-3.5 font-semibold text-white/80">
                      ${Number(product.price).toLocaleString("es-AR")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-medium ${totalStock === 0 ? "text-red-400" : "text-white/60"}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                        product.isActive
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-white/5 text-white/30 border-white/10"
                      }`}>
                        {product.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <ProductActions id={product.id} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
