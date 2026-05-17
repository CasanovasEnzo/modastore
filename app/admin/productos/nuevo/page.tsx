import { prisma } from "@/lib/prisma"
import ProductForm from "../ProductForm"

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="px-8 py-8">
      <div className="flex items-center gap-2 text-xs text-white/25 mb-6">
        <a href="/admin/productos" className="hover:text-white/50 transition">Productos</a>
        <span>/</span>
        <span className="text-white/50">Nuevo</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Nuevo producto</h1>
        <p className="text-sm text-white/30 mt-1">Completá los datos para agregar un producto a la tienda</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
