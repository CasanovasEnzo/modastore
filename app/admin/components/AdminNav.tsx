"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/admin", label: "Dashboard", icon: "▣" },
  { href: "/admin/productos", label: "Productos", icon: "◈" },
  { href: "/admin/ordenes", label: "Órdenes", icon: "◉" },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const isActive =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-xs">{link.icon}</span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
