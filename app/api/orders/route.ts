import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface OrderItemInput {
  variantId: string
  name: string
  quantity: number
  size: string
  color: string
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { items } = await req.json() as { items: OrderItemInput[] }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
  }

  // Validar que todas las cantidades sean válidas
  if (items.some((item) => !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    return NextResponse.json({ error: "Cantidad inválida en uno o más items" }, { status: 400 })
  }

  // Obtener variantes desde la BD (precio y stock reales, no del cliente)
  const variantIds = items.map((item) => item.variantId)
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: { select: { id: true, price: true, isActive: true } } },
  })

  // Verificar que todas las variantes existen y sus productos están activos
  if (variants.length !== variantIds.length) {
    return NextResponse.json({ error: "Uno o más productos no existen" }, { status: 400 })
  }

  if (variants.some((v) => !v.product.isActive)) {
    return NextResponse.json({ error: "Uno o más productos no están disponibles" }, { status: 400 })
  }

  // Verificar stock suficiente
  for (const item of items) {
    const variant = variants.find((v) => v.id === item.variantId)!
    if (variant.stock < item.quantity) {
      return NextResponse.json(
        { error: `Stock insuficiente para ${item.name} (${item.size})` },
        { status: 400 }
      )
    }
  }

  // Calcular total con precios de la BD
  const total = items.reduce((acc, item) => {
    const variant = variants.find((v) => v.id === item.variantId)!
    return acc + Number(variant.product.price) * item.quantity
  }, 0)

  // Crear orden y descontar stock en una transacción
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: session.user.id,
        total,
        items: {
          create: items.map((item) => {
            const variant = variants.find((v) => v.id === item.variantId)!
            return {
              productId: variant.product.id,
              variantId: item.variantId,
              name: item.name,
              price: variant.product.price,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            }
          }),
        },
      },
      include: { items: true },
    })

    // Descontar stock de cada variante
    for (const item of items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return newOrder
  })

  return NextResponse.json({ orderId: order.id })
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}
