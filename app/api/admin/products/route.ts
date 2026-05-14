import { NextRequest, NextResponse } from "next/server"
import { requireAdminFromRequest } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await requireAdminFromRequest(req.headers)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const products = await prisma.product.findMany({
    include: { category: true, variants: true, images: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await requireAdminFromRequest(req.headers)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const body = await req.json()
  const { name, slug, description, price, comparePrice, categoryId, gender, brand, isActive, variants, images } = body

  if (!name || !slug || !price || !categoryId) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      comparePrice: comparePrice || null,
      categoryId,
      gender: gender || "unisex",
      brand: brand || null,
      isActive: isActive !== false,
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

  return NextResponse.json(product, { status: 201 })
}
