import { NextRequest, NextResponse } from "next/server"
import { requireAdminFromRequest } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await requireAdminFromRequest(req.headers)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const [productCount, orderCount, userCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ])

  return NextResponse.json({
    productCount,
    orderCount,
    userCount,
    revenue: Number(revenue._sum.total ?? 0),
  })
}
