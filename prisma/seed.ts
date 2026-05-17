import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setImage(productId: string, url: string, altText: string) {
  const count = await prisma.productImage.count({ where: { productId } })
  if (count === 0) {
    await prisma.productImage.create({ data: { productId, url, altText, position: 0 } })
  }
}

async function main() {
  const remeras = await prisma.category.upsert({
    where: { slug: "remeras" },
    update: {},
    create: { name: "Remeras", slug: "remeras" },
  });

  const pantalones = await prisma.category.upsert({
    where: { slug: "pantalones" },
    update: {},
    create: { name: "Pantalones", slug: "pantalones" },
  });

  const accesorios = await prisma.category.upsert({
    where: { slug: "accesorios" },
    update: {},
    create: { name: "Accesorios", slug: "accesorios" },
  });

  // --- Unisex ---
  const remeraBlanca = await prisma.product.upsert({
    where: { slug: "remera-basica-blanca" },
    update: { gender: "unisex" },
    create: {
      name: "Remera básica blanca", slug: "remera-basica-blanca",
      description: "Remera de algodón 100%, corte recto.", price: 15000,
      categoryId: remeras.id, gender: "unisex", brand: "ModaStore",
      variants: { create: [
        { size: "S", color: "Blanco", stock: 10, sku: "REM-BLA-S" },
        { size: "M", color: "Blanco", stock: 15, sku: "REM-BLA-M" },
        { size: "L", color: "Blanco", stock: 8, sku: "REM-BLA-L" },
      ]},
    },
  });
  await setImage(remeraBlanca.id, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", "Remera básica blanca");

  const remeraOversize = await prisma.product.upsert({
    where: { slug: "remera-negra-oversize" },
    update: { gender: "unisex" },
    create: {
      name: "Remera negra oversize", slug: "remera-negra-oversize",
      description: "Remera oversize de algodón premium.", price: 18000,
      categoryId: remeras.id, gender: "unisex", brand: "ModaStore",
      variants: { create: [
        { size: "M", color: "Negro", stock: 12, sku: "REM-NEG-M" },
        { size: "L", color: "Negro", stock: 10, sku: "REM-NEG-L" },
        { size: "XL", color: "Negro", stock: 5, sku: "REM-NEG-XL" },
      ]},
    },
  });
  await setImage(remeraOversize.id, "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", "Remera negra oversize");

  // --- Hombre ---
  const jeanSlim = await prisma.product.upsert({
    where: { slug: "jean-slim-azul" },
    update: { gender: "hombre" },
    create: {
      name: "Jean slim azul", slug: "jean-slim-azul",
      description: "Jean de corte slim fit, denim de alta calidad.", price: 35000,
      categoryId: pantalones.id, gender: "hombre", brand: "ModaStore",
      variants: { create: [
        { size: "S", color: "Azul", stock: 8, sku: "JEA-AZU-S" },
        { size: "M", color: "Azul", stock: 10, sku: "JEA-AZU-M" },
        { size: "L", color: "Azul", stock: 6, sku: "JEA-AZU-L" },
      ]},
    },
  });
  await setImage(jeanSlim.id, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", "Jean slim azul");

  const cargo = await prisma.product.upsert({
    where: { slug: "pantalon-cargo-verde" },
    update: { gender: "hombre" },
    create: {
      name: "Pantalón cargo verde", slug: "pantalon-cargo-verde",
      description: "Pantalón cargo con múltiples bolsillos.", price: 28000,
      categoryId: pantalones.id, gender: "hombre", brand: "ModaStore",
      variants: { create: [
        { size: "M", color: "Verde", stock: 7, sku: "PAN-VER-M" },
        { size: "L", color: "Verde", stock: 9, sku: "PAN-VER-L" },
      ]},
    },
  });
  await setImage(cargo.id, "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", "Pantalón cargo verde");

  const mangaLarga = await prisma.product.upsert({
    where: { slug: "remera-manga-larga-hombre" },
    update: {},
    create: {
      name: "Remera manga larga gris", slug: "remera-manga-larga-hombre",
      description: "Manga larga de algodón pesado, ideal para capas.", price: 22000,
      categoryId: remeras.id, gender: "hombre", brand: "ModaStore",
      variants: { create: [
        { size: "S", color: "Gris", stock: 6, sku: "RML-GRI-S" },
        { size: "M", color: "Gris", stock: 8, sku: "RML-GRI-M" },
        { size: "L", color: "Gris", stock: 5, sku: "RML-GRI-L" },
        { size: "XL", color: "Gris", stock: 3, sku: "RML-GRI-XL" },
      ]},
    },
  });
  await setImage(mangaLarga.id, "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80", "Remera manga larga gris");

  const cinturon = await prisma.product.upsert({
    where: { slug: "cinturon-negro" },
    update: {},
    create: {
      name: "Cinturón negro liso", slug: "cinturon-negro",
      description: "Cinturón de cuero sintético, hebilla plateada.", price: 9500,
      categoryId: accesorios.id, gender: "hombre", brand: "ModaStore",
      variants: { create: [
        { size: "M", color: "Negro", stock: 15, sku: "CIN-NEG-M" },
        { size: "L", color: "Negro", stock: 10, sku: "CIN-NEG-L" },
      ]},
    },
  });
  await setImage(cinturon.id, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", "Cinturón negro liso");

  // --- Mujer ---
  const tirantes = await prisma.product.upsert({
    where: { slug: "remera-tirantes-beige" },
    update: {},
    create: {
      name: "Remera tirantes beige", slug: "remera-tirantes-beige",
      description: "Top de tirantes en tela liviana, corte ajustado.", price: 12000,
      categoryId: remeras.id, gender: "mujer", brand: "ModaStore",
      variants: { create: [
        { size: "XS", color: "Beige", stock: 8, sku: "TOP-BEI-XS" },
        { size: "S", color: "Beige", stock: 12, sku: "TOP-BEI-S" },
        { size: "M", color: "Beige", stock: 10, sku: "TOP-BEI-M" },
      ]},
    },
  });
  await setImage(tirantes.id, "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80", "Remera tirantes beige");

  const jeanFlare = await prisma.product.upsert({
    where: { slug: "jean-flare-negro" },
    update: {},
    create: {
      name: "Jean flare negro", slug: "jean-flare-negro",
      description: "Jean de tiro alto con campana, denim elástico.", price: 38000,
      categoryId: pantalones.id, gender: "mujer", brand: "ModaStore",
      variants: { create: [
        { size: "XS", color: "Negro", stock: 5, sku: "JFL-NEG-XS" },
        { size: "S", color: "Negro", stock: 9, sku: "JFL-NEG-S" },
        { size: "M", color: "Negro", stock: 7, sku: "JFL-NEG-M" },
      ]},
    },
  });
  await setImage(jeanFlare.id, "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", "Jean flare negro");

  const cropBlanca = await prisma.product.upsert({
    where: { slug: "remera-crop-blanca" },
    update: {},
    create: {
      name: "Remera crop blanca", slug: "remera-crop-blanca",
      description: "Remera cropped de algodón, largo a la cintura.", price: 13000,
      categoryId: remeras.id, gender: "mujer", brand: "ModaStore",
      variants: { create: [
        { size: "XS", color: "Blanco", stock: 10, sku: "CRP-BLA-XS" },
        { size: "S", color: "Blanco", stock: 14, sku: "CRP-BLA-S" },
        { size: "M", color: "Blanco", stock: 8, sku: "CRP-BLA-M" },
      ]},
    },
  });
  await setImage(cropBlanca.id, "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80", "Remera crop blanca");

  const tote = await prisma.product.upsert({
    where: { slug: "bolsa-tote-canvas" },
    update: {},
    create: {
      name: "Bolsa tote canvas", slug: "bolsa-tote-canvas",
      description: "Bolsa tote de lona, amplia y resistente.", price: 11000,
      categoryId: accesorios.id, gender: "mujer", brand: "ModaStore",
      variants: { create: [
        { size: "U", color: "Crema", stock: 20, sku: "TOT-CRE-U" },
      ]},
    },
  });
  await setImage(tote.id, "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80", "Bolsa tote canvas");

  // Asignar rol admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const updated = await prisma.user.updateMany({
      where: { email: adminEmail },
      data: { role: "admin" },
    });
    if (updated.count > 0) {
      console.log(`✓ ${adminEmail} ahora es admin`);
    } else {
      console.log(`⚠ No se encontró usuario con email ${adminEmail} (registrate primero)`);
    }
  }

  console.log("✓ Seed completado con géneros y nuevos productos");
}

main().finally(() => prisma.$disconnect());
