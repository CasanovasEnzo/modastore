"use client";
import { useCartStore } from "@/store/cart";

export default function CartButton() {
  const count = useCartStore((state) => state.itemCount());

  return (
    <a
      href="/carrito"
      className="relative text-sm bg-white text-black px-5 py-2 rounded-full font-medium hover:bg-gray-200 transition"
    >
      Carrito
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </a>
  );
}
