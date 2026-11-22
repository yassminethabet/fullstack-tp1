import { prisma } from "./prisma.js";

type DummyProduct = {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
};

export async function seedIfEmpty() {
  const count = await prisma.product.count();
  if (count > 0) return;

  console.log("Database empty: seeding products...");
  const res = await fetch("https://dummyjson.com/products?limit=100");
  if (!res.ok) throw new Error("Seed fetch failed: HTTP " + res.status);
  const { products } = (await res.json()) as { products: DummyProduct[] };

  for (const p of products) {
    await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        thumbnail: p.thumbnail,
        stock: p.stock,
        category: {
          connectOrCreate: {
            where: { name: p.category },
            create: { name: p.category },
          },
        },
      },
    });
  }
  console.log(`Seeded ${products.length} products`);
}