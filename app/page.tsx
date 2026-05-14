export default function HomePage() {
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
          <div className="col-span-2 aspect-[16/9] bg-gradient-to-br from-white/10 to-white/5 rounded-2xl" />
          <div className="flex flex-col gap-4">
            <div className="flex-1 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl" />
            <div className="flex-1 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl" />
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
            { name: "Remeras", slug: "remeras", items: "5 productos", bg: "from-zinc-800 to-zinc-900" },
            { name: "Pantalones", slug: "pantalones", items: "3 productos", bg: "from-stone-800 to-stone-900" },
            { name: "Accesorios", slug: "accesorios", items: "2 productos", bg: "from-neutral-800 to-neutral-900" },
          ].map((cat) => (
            <a key={cat.name} href={`/productos?categoria=${cat.slug}`}
              className={`group bg-gradient-to-br ${cat.bg} rounded-3xl p-8 aspect-[4/3] flex flex-col justify-end border border-white/5 hover:border-white/20 transition duration-300`}>
              <p className="text-xs text-white/30 mb-2">{cat.items}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{cat.name}</p>
                <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition duration-300">→</span>
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
            { name: "Remera esencial", price: "15.000", tag: "Básico", color: "from-zinc-700 to-zinc-800" },
            { name: "Oversize negra", price: "18.000", tag: "Más vendido", color: "from-neutral-800 to-black" },
            { name: "Jean slim", price: "35.000", tag: "Nuevo", color: "from-slate-700 to-slate-800" },
            { name: "Cargo verde", price: "28.000", tag: "Tendencia", color: "from-stone-700 to-stone-800" },
          ].map((p, i) => (
            <a key={i} href="/productos" className="group">
              <div className={`aspect-[3/4] rounded-2xl mb-4 bg-gradient-to-br ${p.color} flex flex-col justify-between p-5 border border-white/5 group-hover:border-white/20 transition duration-300`}>
                <span className="text-xs font-medium bg-white/10 backdrop-blur px-3 py-1.5 rounded-full w-fit text-white/70">
                  {p.tag}
                </span>
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