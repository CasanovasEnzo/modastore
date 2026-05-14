import { NextRequest, NextResponse } from "next/server"
import { requireAdminFromRequest } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await requireAdminFromRequest(req.headers)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}
