import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PerfilClient from "./perfil-client"

export default async function PerfilPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const [orderCount, accounts] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.account.findMany({ where: { userId: session.user.id }, select: { providerId: true } }),
  ])

  const hasPassword = accounts.some((a) => a.providerId === "credential")
  const providers = accounts.map((a) => a.providerId)

  return (
    <PerfilClient
      user={session.user}
      orderCount={orderCount}
      hasPassword={hasPassword}
      providers={providers}
    />
  )
}
