import { requireAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"
import AdminNav from "./components/AdminNav"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  if (!admin) redirect("/login")

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/[0.07] flex flex-col fixed h-full bg-[#0a0a0a]">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/[0.07]">
          <Link href="/" className="text-sm font-bold tracking-tight text-white">MODASTORE</Link>
          <p className="text-[10px] text-white/25 tracking-[0.2em] uppercase mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase px-3 mb-2">General</p>
          <AdminNav />
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/[0.07]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/60 flex-shrink-0">
              {admin.user.name?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white/70 truncate">{admin.user.name}</p>
              <p className="text-[10px] text-white/30 truncate">{admin.user.email}</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-[11px] text-white/30 hover:text-white/70 transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-56 min-h-screen bg-[#0d0d0d]">
        {children}
      </main>
    </div>
  )
}
