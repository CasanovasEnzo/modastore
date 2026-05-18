import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import SignOutButton from "./sign-out-button"
import CartButton from "./cart-button"
import MobileMenu from "./mobile-menu"

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <a href="/" className="text-base font-semibold tracking-tight">
          MODASTORE
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Hombre", href: "/productos?genero=hombre" },
            { label: "Mujer", href: "/productos?genero=mujer" },
            { label: "Remeras", href: "/productos?categoria=remeras" },
            { label: "Pantalones", href: "/productos?categoria=pantalones" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-white/50 hover:text-white transition duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <CartButton />
          {session ? (
            <div className="hidden md:flex items-center gap-3">
              <a href="/mis-ordenes" className="text-sm text-white/50 hover:text-white transition duration-200">
                Órdenes
              </a>
              <a href="/perfil" className="text-sm text-white/50 hover:text-white transition duration-200">
                {session.user.name}
              </a>
              <SignOutButton />
            </div>
          ) : (
            <a
              href="/login"
              className="hidden md:block text-sm text-white/50 hover:text-white transition duration-200"
            >
              Iniciar sesión
            </a>
          )}
          <MobileMenu
            isLoggedIn={!!session}
            userName={session?.user.name}
          />
        </div>
      </div>
    </header>
  )
}
