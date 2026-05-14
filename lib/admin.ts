import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  })
  if (!user || user.role !== "admin") return null
  return { session, user }
}

export async function requireAdminFromRequest(reqHeaders: Headers) {
  const session = await auth.api.getSession({ headers: reqHeaders })
  if (!session) return null
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })
  if (!user || user.role !== "admin") return null
  return session
}
