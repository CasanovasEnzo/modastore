import { NextRequest, NextResponse } from "next/server"
import { requireAdminFromRequest } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"]

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminFromRequest(req.headers)
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { id } = await params
  const { status } = await req.json()

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(order)
}
