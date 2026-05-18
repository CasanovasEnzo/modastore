"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/cart";
import Image from "next/image";

interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  brand: string;
  variants: Variant[];
  category: { name: string };
  images: { url: string; altText: string | null; position: number }[];
}

export default function ProductoDetallePage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [agregado, setAgregado] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  function agregarAlCarrito() {
    if (!selectedVariant || !product) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      size: selectedVariant.size,
      color: selectedVariant.color,
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-white/30">Producto no encontrado.</p>
    </div>
  );

  const sizes = [...new Set((product.variants ?? []).map((v) => v.size))];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-24 md:pt-32 pb-16 md:pb-24">
        {/* Breadcrumb */}
        <p className="text-sm text-white/30 mb-12">
          <a href="/productos" className="hover:text-white transition">Productos</a>
          <span className="mx-2">→</span>
          <span className="text-white/60">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Imagen */}
          <div className="aspect-[3/4] rounded-3xl border border-white/5 overflow-hidden relative bg-zinc-900">
            {product.images[0] ? (
              <Image
                src={product.images.sort((a, b) => a.position - b.position)[0].url}
                alt={product.images[0].altText ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                <p className="text-white/20 text-sm">Sin imagen</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-8 justify-center">
            <div>
              <p className="text-xs text-white/30 tracking-widest uppercase mb-3">
                {product.category?.name} · {product.brand}
              </p>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
              <p className="text-2xl md:text-3xl font-semibold text-white">
                ${Number(product.price).toLocaleString("es-AR")}
              </p>
            </div>

            <p className="text-white/50 leading-relaxed">{product.description}</p>

            {/* Selector de talle */}
            <div>
              <p className="text-sm text-white/40 mb-4">
                Talle: {selectedVariant
                  ? <span className="text-white font-medium">{selectedVariant.size}</span>
                  : <span>seleccioná uno</span>}
              </p>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((size) => {
                  const variant = product.variants.find((v) => v.size === size);
                  const sinStock = variant?.stock === 0;
                  return (
                    <button key={size}
                      disabled={sinStock}
                      onClick={() => setSelectedVariant(variant!)}
                      className={`w-14 h-14 rounded-2xl text-sm font-medium transition duration-200 border ${
                        selectedVariant?.size === size
                          ? "bg-white text-black border-white"
                          : sinStock
                          ? "border-white/10 text-white/20 cursor-not-allowed"
                          : "border-white/20 text-white/70 hover:border-white hover:text-white"
                      }`}>
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón */}
            <button
              onClick={agregarAlCarrito}
              disabled={!selectedVariant}
              className={`w-full py-4 rounded-full text-sm font-semibold transition duration-200 ${
                agregado
                  ? "bg-green-500 text-white"
                  : selectedVariant
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}>
              {agregado ? "✓ Agregado al carrito" : "Agregar al carrito"}
            </button>

            {/* Info extra */}
            <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
              {["Envío gratis en compras +$50.000", "Devolución gratis en 30 días", "Pago en hasta 12 cuotas"].map((item) => (
                <p key={item} className="text-sm text-white/30 flex items-center gap-2">
                  <span className="text-white/20">✓</span> {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}