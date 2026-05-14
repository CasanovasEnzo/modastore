import { prisma } from "@/lib/prisma"
import ProductForm from "../ProductForm"

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="px-10 py-10">
      <div className="mb-10">
        <p className="text-xs text-white/30 tracking-widest uppercase mb-2">Admin · Productos</p>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo producto</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
