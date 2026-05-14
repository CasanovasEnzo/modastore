import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const categoria = searchParams.get("categoria");
    const genero = searchParams.get("genero");

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categoria && { category: { slug: categoria } }),
        ...(genero && genero !== "unisex"
          ? { gender: { in: [genero, "unisex"] } }
          : genero === "unisex"
          ? { gender: "unisex" }
          : {}),
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
