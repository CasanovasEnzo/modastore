"use client";
import { useCartStore } from "@/store/cart";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function finalizarCompra() {
    if (!session) {
      router.push("/login?redirect=/carrito");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      router.push(`/orden/${data.orderId}`);
    } catch {
      alert("Error al procesar la orden. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-5 md:px-8 pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="mb-8 md:mb-16">
          <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Tu selección</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Carrito</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 md:py-32 border border-white/10 rounded-3xl">
            <p className="text-white/20 text-6xl mb-6">🛒</p>
            <p className="text-white/40 text-lg mb-8">Tu carrito está vacío.</p>
            <a href="/productos"
              className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition">
              Ver productos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {/* Lista */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.variantId}
                  className="flex items-center gap-3 md:gap-5 border border-white/10 rounded-2xl p-4 md:p-5 hover:border-white/20 transition">
                  {/* Imagen */}
                  <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex-shrink-0" />

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-white/40 mt-1">
                      Talle: {item.size} · Color: {item.color}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      ${item.price.toLocaleString("es-AR")}
                    </p>
                  </div>

                  {/* Cantidad */}
                  <div className="flex items-center gap-3 border border-white/10 rounded-full px-4 py-2">
                    <button
                      onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                      className="text-white/50 hover:text-white transition text-lg leading-none">
                      −
                    </button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="text-white/50 hover:text-white transition text-lg leading-none">
                      +
                    </button>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-white/20 hover:text-red-400 transition text-sm ml-1">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="border border-white/10 rounded-3xl p-6 h-fit sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Resumen</h2>

              <div className="flex flex-col gap-3 mb-6 text-sm">
                <div className="flex justify-between text-white/40">
                  <span>Subtotal</span>
                  <span>${total().toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>Envío</span>
                  <span className="text-green-400">Gratis</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total().toLocaleString("es-AR")}</span>
                </div>
              </div>

              <button
                onClick={finalizarCompra}
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-full text-sm font-semibold hover:bg-gray-100 transition mb-3 disabled:opacity-50"
              >
                {loading ? "Procesando..." : "Finalizar compra"}
              </button>
              <a href="/productos"
                className="block text-center text-sm text-white/30 hover:text-white transition">
                Seguir comprando
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}