"use client"
import { useState } from "react"
import Link from "next/link"

const navLinks = [
  { label: "Hombre", href: "/productos?genero=hombre" },
  { label: "Mujer", href: "/productos?genero=mujer" },
  { label: "Remeras", href: "/productos?categoria=remeras" },
  { label: "Pantalones", href: "/productos?categoria=pantalones" },
]

export default function MobileMenu({
  isLoggedIn,
  userName,
}: {
  isLoggedIn: boolean
  userName?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex flex-col gap-1.5 p-1"
        aria-label="Abrir menú"
      >
        <span className="w-5 h-px bg-white block" />
        <span className="w-5 h-px bg-white block" />
        <span className="w-3 h-px bg-white block" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute right-0 top-0 bottom-0 w-72 bg-[#0d0d0d] border-l border-white/10 flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <span className="text-sm font-bold tracking-tight">MODASTORE</span>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 px-4 py-6 flex flex-col gap-1">
              <p className="text-[10px] text-white/25 tracking-widest uppercase px-3 mb-2">Colección</p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-white/10 mt-4 pt-4">
                <p className="text-[10px] text-white/25 tracking-widest uppercase px-3 mb-2">Mi cuenta</p>
                {isLoggedIn ? (
                  <>
                    <Link href="/perfil" onClick={() => setOpen(false)}
                      className="px-3 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition block">
                      {userName ?? "Perfil"}
                    </Link>
                    <Link href="/mis-ordenes" onClick={() => setOpen(false)}
                      className="px-3 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition block">
                      Mis órdenes
                    </Link>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)}
                    className="px-3 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition block">
                    Iniciar sesión
                  </Link>
                )}
              </div>
            </div>

            <div className="px-4 pb-6">
              <Link
                href="/carrito"
                onClick={() => setOpen(false)}
                className="w-full bg-white text-black py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition text-center block"
              >
                Ver carrito
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
