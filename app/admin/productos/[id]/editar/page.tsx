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
    <div className="px-10 py-10">
      <div className="mb-10">
        <p className="text-xs text-white/30 tracking-widest uppercase mb-2">Admin · Productos</p>
        <h1 className="text-3xl font-bold tracking-tight">Editar producto</h1>
        <p className="text-white/40 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm categories={categories} initial={initial} />
    </div>
  )
}
