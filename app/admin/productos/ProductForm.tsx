"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Variant {
  size: string
  color: string
  stock: number
  sku: string
}

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  initial?: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    comparePrice: number | null
    categoryId: string
    gender: string
    brand: string | null
    isActive: boolean
    variants: Variant[]
    images: string[]
  }
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function ProductForm({ categories, initial }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!initial

  const [name, setName] = useState(initial?.name ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [price, setPrice] = useState(initial?.price?.toString() ?? "")
  const [comparePrice, setComparePrice] = useState(initial?.comparePrice?.toString() ?? "")
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "")
  const [gender, setGender] = useState(initial?.gender ?? "unisex")
  const [brand, setBrand] = useState(initial?.brand ?? "")
  const [isActive, setIsActive] = useState(initial?.isActive !== false)
  const [variants, setVariants] = useState<Variant[]>(
    initial?.variants.length ? initial.variants : [{ size: "", color: "", stock: 0, sku: "" }]
  )
  const [images, setImages] = useState<string[]>(
    initial?.images.length ? initial.images : [""]
  )
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleNameChange(val: string) {
    setName(val)
    if (!isEdit) setSlug(toSlug(val))
  }

  function updateVariant(i: number, field: keyof Variant, value: string | number) {
    setVariants((prev) => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v))
  }

  function addVariant() {
    setVariants((prev) => [...prev, { size: "", color: "", stock: 0, sku: "" }])
  }

  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateImage(i: number, val: string) {
    setImages((prev) => prev.map((img, idx) => idx === i ? val : img))
  }

  function addImage() {
    setImages((prev) => [...prev, ""])
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const payload = {
      name,
      slug,
      description: description || null,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      categoryId,
      gender,
      brand: brand || null,
      isActive,
      variants: variants.filter((v) => v.size && v.color && v.sku),
      images: images.filter(Boolean),
    }

    const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products"
    const method = isEdit ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Error al guardar")
      return
    }

    router.push("/admin/productos")
    router.refresh()
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition"
  const labelClass = "block text-xs text-white/40 uppercase tracking-widest mb-2"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className="border border-white/10 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Info básica</h2>

        <div>
          <label className={labelClass}>Nombre *</label>
          <input className={inputClass} value={name} onChange={(e) => handleNameChange(e.target.value)} required />
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea className={`${inputClass} min-h-24 resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Precio *</label>
            <input className={inputClass} type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Precio anterior</label>
            <input className={inputClass} type="number" step="0.01" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Categoría *</label>
            <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Género</label>
            <select className={inputClass} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="unisex">Unisex</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Marca</label>
            <input className={inputClass} value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded accent-white"
          />
          <span className="text-sm text-white/60">Producto activo (visible en tienda)</span>
        </label>
      </div>

      {/* Variants */}
      <div className="border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Variantes</h2>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 items-end">
            <div>
              <label className={labelClass}>Talle</label>
              <input className={inputClass} placeholder="M" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input className={inputClass} placeholder="Negro" value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input className={inputClass} type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input className={inputClass} placeholder="ABC-123" value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} />
            </div>
            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="pb-0.5 text-red-400/50 hover:text-red-400 transition text-xs"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="text-xs text-white/40 hover:text-white transition border border-white/10 px-4 py-2 rounded-xl"
        >
          + Agregar variante
        </button>
      </div>

      {/* Images */}
      <div className="border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Imágenes (URLs)</h2>
        {images.map((url, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className={`${inputClass} flex-1`}
              placeholder="https://..."
              value={url}
              onChange={(e) => updateImage(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="text-red-400/50 hover:text-red-400 transition text-xs px-2"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="text-xs text-white/40 hover:text-white transition border border-white/10 px-4 py-2 rounded-xl"
        >
          + Agregar imagen
        </button>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
        <a
          href="/admin/productos"
          className="border border-white/10 px-6 py-3 rounded-full text-sm font-medium text-white/60 hover:text-white hover:border-white/30 transition"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
