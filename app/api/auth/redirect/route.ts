import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session && (session.user as { role?: string }).role === "admin") {
    return NextResponse.redirect(new URL("/admin", process.env.BETTER_AUTH_URL!))
  }
  return NextResponse.redirect(new URL("/", process.env.BETTER_AUTH_URL!))
}
