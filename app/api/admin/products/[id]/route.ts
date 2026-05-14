import { NextRequest, NextResponse } from "next/server"
import { requireAdminFromRequest } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminFromRequest(req.headers)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true, images: true },
  })

  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminFromRequest(req.headers)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { name, slug, description, price, comparePrice, categoryId, gender, brand, isActive, variants, images } = body

  await prisma.$transaction([
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.productImage.deleteMany({ where: { productId: id } }),
  ])

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price,
      comparePrice: comparePrice || null,
      categoryId,
      gender,
      brand: brand || null,
      isActive,
      variants: {
        create: (variants ?? []).map((v: { size: string; color: string; stock: number; sku: string }) => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
          sku: v.sku,
        })),
      },
      images: {
        create: (images ?? []).map((url: string, i: number) => ({
          url,
          position: i,
        })),
      },
    },
    include: { category: true, variants: true, images: true },
  })

  return NextResponse.json(product)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminFromRequest(req.headers)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
