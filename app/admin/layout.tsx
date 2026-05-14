import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import AdminNav from "./components/AdminNav"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/10 flex flex-col fixed h-full">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-xs text-white/30 tracking-widest uppercase mb-1">Panel</p>
          <p className="text-sm font-semibold">Admin</p>
        </div>

        <div className="flex-1 px-3 py-4">
          <AdminNav />
        </div>

        <div className="px-6 py-4 border-t border-white/10 space-y-2">
          <p className="text-xs text-white/30 truncate">{session?.user.email}</p>
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white transition flex items-center gap-1.5"
          >
            ← Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
