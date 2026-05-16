import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const publicAuthRoutes = ["/login", "/registro"]
const protectedRoutes = ["/mis-ordenes", "/orden", "/perfil"]
const adminRoutes = ["/admin"]

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isAuthRoute = publicAuthRoutes.some((r) => path.startsWith(r))
  const isProtected = protectedRoutes.some((r) => path.startsWith(r))
  const isAdmin = adminRoutes.some((r) => path.startsWith(r))

  const session = await auth.api.getSession({ headers: req.headers })

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  if ((isProtected || isAdmin) && !session) {
    return NextResponse.redirect(new URL(`/login?redirect=${path}`, req.nextUrl))
  }

  if (isAdmin && session && (session.user as { role?: string }).role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
}
