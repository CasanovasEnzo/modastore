import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ProductActions from "./ProductActions"

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="px-10 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs text-white/30 tracking-widest uppercase mb-2">Admin</p>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden">
        {products.length === 0 ? (
          <p className="text-white/30 text-sm px-6 py-8">Sin productos.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
                <th className="text-left px-6 py-3">Nombre</th>
                <th className="text-left px-6 py-3">Categoría</th>
                <th className="text-left px-6 py-3">Género</th>
                <th className="text-left px-6 py-3">Precio</th>
                <th className="text-left px-6 py-3">Stock</th>
                <th className="text-left px-6 py-3">Estado</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0)
                return (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-white/30 text-xs font-mono">{product.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-white/60 capitalize">{product.category.name}</td>
                    <td className="px-6 py-4 text-white/60 capitalize">{product.gender}</td>
                    <td className="px-6 py-4 font-semibold">
                      ${Number(product.price).toLocaleString("es-AR")}
                    </td>
                    <td className="px-6 py-4 text-white/60">{totalStock}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${
                        product.isActive
                          ? "border-green-500/30 text-green-400 bg-green-500/10"
                          : "border-white/10 text-white/30 bg-white/5"
                      }`}>
                        {product.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
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
