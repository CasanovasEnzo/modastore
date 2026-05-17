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
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition"
  const labelClass = "block text-[11px] text-white/35 font-medium uppercase tracking-widest mb-1.5"
  const sectionClass = "bg-white/[0.02] border border-white/[0.07] rounded-xl p-6 space-y-5"

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {error && (
        <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/8 text-red-400 text-sm px-4 py-3 rounded-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Información básica</h2>
        </div>

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
                <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Género</label>
            <select className={inputClass} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="unisex" className="bg-zinc-900">Unisex</option>
              <option value="hombre" className="bg-zinc-900">Hombre</option>
              <option value="mujer" className="bg-zinc-900">Mujer</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Marca</label>
            <input className={inputClass} value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-9 h-5 rounded-full border transition ${isActive ? "bg-white border-white" : "bg-white/5 border-white/15"}`}
            onClick={() => setIsActive(!isActive)}>
            <div className={`w-3.5 h-3.5 rounded-full mt-0.5 transition-all ${isActive ? "bg-black ml-4.5 translate-x-[18px]" : "bg-white/30 ml-0.5"}`} />
          </div>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="hidden" />
          <span className="text-sm text-white/55 group-hover:text-white/75 transition">Producto activo (visible en tienda)</span>
        </label>
      </div>

      {/* Variants */}
      <div className={sectionClass}>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Variantes</h2>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 items-end">
              <div>
                {i === 0 && <label className={labelClass}>Talle</label>}
                <input className={inputClass} placeholder="M" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} />
              </div>
              <div>
                {i === 0 && <label className={labelClass}>Color</label>}
                <input className={inputClass} placeholder="Negro" value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} />
              </div>
              <div>
                {i === 0 && <label className={labelClass}>Stock</label>}
                <input className={inputClass} type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)} />
              </div>
              <div>
                {i === 0 && <label className={labelClass}>SKU</label>}
                <input className={inputClass} placeholder="ABC-123" value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className={`${i === 0 ? "mt-5" : ""} w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/25 hover:text-red-400 hover:border-red-500/20 transition`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-2 text-xs text-white/35 hover:text-white transition border border-dashed border-white/[0.1] hover:border-white/20 px-4 py-2.5 rounded-lg w-full justify-center"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar variante
        </button>
      </div>

      {/* Images */}
      <div className={sectionClass}>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Imágenes (URLs)</h2>
        <div className="space-y-2">
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
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/25 hover:text-red-400 hover:border-red-500/20 transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImage}
          className="flex items-center gap-2 text-xs text-white/35 hover:text-white transition border border-dashed border-white/[0.1] hover:border-white/20 px-4 py-2.5 rounded-lg w-full justify-center"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar imagen
        </button>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Guardando...
            </>
          ) : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
        <a
          href="/admin/productos"
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white border border-white/[0.07] hover:border-white/20 transition"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
