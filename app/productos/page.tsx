"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  gender: string;
  category: { name: string; slug: string };
  variants: { size: string; color: string }[];
  images: { url: string; altText: string | null }[];
}

const GENEROS = [
  { label: "Todo", value: "" },
  { label: "Hombre", value: "hombre" },
  { label: "Mujer", value: "mujer" },
];

const CATEGORIAS = [
  { label: "Todo", value: "" },
  { label: "Remeras", value: "remeras" },
  { label: "Pantalones", value: "pantalones" },
  { label: "Accesorios", value: "accesorios" },
];

export default function ProductosPage() {
  return (
    <Suspense>
      <ProductosContent />
    </Suspense>
  );
}

function ProductosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const genero = searchParams.get("genero") ?? "";
  const categoria = searchParams.get("categoria") ?? "";
  const talle = searchParams.get("talle") ?? "";

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (genero) params.set("genero", genero);
    if (categoria) params.set("categoria", categoria);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [genero, categoria]);

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/productos?${params.toString()}`);
  }

  const filtered = talle
    ? products.filter((p) => p.variants.some((v) => v.size === talle))
    : products;

  const titulo = genero
    ? genero.charAt(0).toUpperCase() + genero.slice(1)
    : categoria
    ? CATEGORIAS.find((c) => c.value === categoria)?.label ?? "Catálogo"
    : "Catálogo";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        <div className="mb-12">
          <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Colección 2025</p>
          <h1 className="text-5xl font-bold tracking-tight">{titulo}</h1>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-12">
          {/* Género */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-white/30 uppercase tracking-widest w-20">Género</span>
            {GENEROS.map((g) => (
              <button
                key={g.value}
                onClick={() => setFilter("genero", g.value)}
                className={`px-4 py-2 rounded-full text-sm transition duration-200 border ${
                  genero === g.value
                    ? "bg-white text-black border-white"
                    : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Categoría */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-white/30 uppercase tracking-widest w-20">Categoría</span>
            {CATEGORIAS.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter("categoria", c.value)}
                className={`px-4 py-2 rounded-full text-sm transition duration-200 border ${
                  categoria === c.value
                    ? "bg-white text-black border-white"
                    : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Talle */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-white/30 uppercase tracking-widest w-20">Talle</span>
            {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter("talle", talle === s ? "" : s)}
                className={`px-4 py-2 rounded-full text-sm transition duration-200 border ${
                  talle === s
                    ? "bg-white text-black border-white"
                    : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Contador */}
        {!loading && (
          <p className="text-xs text-white/30 mb-8">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 border border-white/10 rounded-3xl">
            <p className="text-white/40 text-lg mb-2">Sin resultados</p>
            <p className="text-white/20 text-sm">Probá con otros filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <a key={p.id} href={`/productos/${p.slug}`} className="group">
                <div className="aspect-[3/4] rounded-2xl mb-4 overflow-hidden border border-white/5 group-hover:border-white/20 transition duration-300 relative bg-zinc-900">
                  {p.images[0] ? (
                    <Image
                      src={p.images[0].url}
                      alt={p.images[0].altText ?? p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                  )}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <span className="text-xs bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/70 w-fit">
                      {p.category.name}
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {p.variants.slice(0, 4).map((v) => (
                        <span key={v.size} className="text-xs text-white/60 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {v.size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="font-medium text-sm text-white">{p.name}</p>
                <p className="text-white/40 text-sm mt-0.5">
                  ${Number(p.price).toLocaleString("es-AR")}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
