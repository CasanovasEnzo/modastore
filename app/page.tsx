import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session && (session.user as { role?: string }).role === "admin") {
    redirect("/admin")
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Glow background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <p className="text-xs font-semibold tracking-[0.3em] text-white/40 uppercase mb-6">
          Colección Otoño — Invierno 2025
        </p>
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none mb-8">
          Menos es<br />
          <span className="text-white/20">más.</span>
        </h1>
        <p className="text-lg text-white/40 mb-12 max-w-lg leading-relaxed">
          Prendas esenciales para personas que no necesitan llamar la atención para ser vistas.
        </p>
        <div className="flex gap-3">
          <a href="/productos"
            className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition">
            Ver colección
          </a>
          <a href="/productos"
            className="border border-white/20 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:border-white/50 transition">
            Novedades
          </a>
        </div>

        {/* Hero grid de imágenes */}
        <div className="mt-24 w-full max-w-5xl grid grid-cols-3 gap-4">
          <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80"
              alt="Colección Modastore"
              fill
              className="object-cover"
              sizes="66vw"
              priority
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-2xl overflow-hidden relative min-h-[120px]">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                alt="Street style"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden relative min-h-[120px]">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80"
                alt="Colección minimalista"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white/90">
          Diseñado para durar.<br />
          <span className="text-white/30">No para la temporada.</span>
        </h2>
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "Remeras", slug: "remeras", items: "5 productos", img: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80" },
            { name: "Pantalones", slug: "pantalones", items: "3 productos", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" },
            { name: "Accesorios", slug: "accesorios", items: "2 productos", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80" },
          ].map((cat) => (
            <a key={cat.name} href={`/productos?categoria=${cat.slug}`}
              className="group rounded-3xl aspect-[4/3] flex flex-col justify-end border border-white/5 hover:border-white/20 transition duration-300 overflow-hidden relative">
              <Image
                src={cat.img}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative p-8">
                <p className="text-xs text-white/50 mb-2">{cat.items}</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{cat.name}</p>
                  <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition duration-300">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs text-white/30 tracking-widest uppercase mb-2">Selección</p>
            <h2 className="text-4xl font-bold tracking-tight">Más vendidos</h2>
          </div>
          <a href="/productos" className="text-sm text-white/40 hover:text-white transition">Ver todos →</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Remera esencial", slug: "remera-basica-blanca", price: "15.000", tag: "Básico", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
            { name: "Oversize negra", slug: "remera-negra-oversize", price: "18.000", tag: "Más vendido", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80" },
            { name: "Jean slim", slug: "jean-slim-azul", price: "35.000", tag: "Nuevo", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80" },
            { name: "Cargo verde", slug: "pantalon-cargo-verde", price: "28.000", tag: "Tendencia", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80" },
          ].map((p) => (
            <a key={p.slug} href={`/productos/${p.slug}`} className="group">
              <div className="aspect-[3/4] rounded-2xl mb-4 overflow-hidden relative bg-zinc-900 border border-white/5 group-hover:border-white/20 transition duration-300">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 p-4">
                  <span className="text-xs font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/80">
                    {p.tag}
                  </span>
                </div>
              </div>
              <p className="font-medium text-sm text-white">{p.name}</p>
              <p className="text-white/40 text-sm mt-0.5">${p.price}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Banner envío */}
      <section className="mx-8 mb-24 border border-white/10 rounded-3xl px-12 py-20 text-center bg-gradient-to-br from-white/5 to-transparent">
        <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-4">Beneficio exclusivo</p>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Envío gratis a todo el país</h2>
        <p className="text-white/40 mb-10 text-lg">En compras mayores a $50.000 · Entrega en 48hs hábiles</p>
        <a href="/productos"
          className="bg-white text-black px-10 py-4 rounded-full text-sm font-semibold hover:bg-gray-100 transition">
          Comprar ahora
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm font-semibold">MODASTORE</p>
          <p className="text-sm text-white/30">© 2025 · Todos los derechos reservados</p>
          <div className="flex gap-6">
            {["Instagram", "TikTok", "WhatsApp"].map((s) => (
              <a key={s} href="#" className="text-sm text-white/30 hover:text-white transition">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}