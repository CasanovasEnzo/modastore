import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductForm from "../../ProductForm"

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!product) notFound()

  const initial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    categoryId: product.categoryId,
    gender: product.gender,
    brand: product.brand,
    isActive: product.isActive,
    variants: product.variants.map((v) => ({
      size: v.size,
      color: v.color,
      stock: v.stock,
      sku: v.sku,
    })),
    images: product.images.sort((a, b) => a.position - b.position).map((img) => img.url),
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center gap-2 text-xs text-white/25 mb-6">
        <a href="/admin/productos" className="hover:text-white/50 transition">Productos</a>
        <span>/</span>
        <span className="text-white/50 truncate max-w-[200px]">{product.name}</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Editar producto</h1>
        <p className="text-sm text-white/30 mt-1">{product.name}</p>
      </div>
      <ProductForm categories={categories} initial={initial} />
    </div>
  )
}
