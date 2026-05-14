"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-white/50 hover:text-white transition duration-200"
    >
      Salir
    </button>
  )
}
