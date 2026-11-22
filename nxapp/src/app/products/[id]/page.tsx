import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Product } from "@/types/product";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(`${process.env.API_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("HTTP " + response.status);
  const product: Product = await response.json();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Link
        href="/products"
        className="mb-6 inline-block rounded border border-gray-400 px-3 py-1 text-gray-700 hover:bg-gray-100"
      >
        ← Back to catalogue
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-xl bg-gray-100 p-6">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={400}
            height={400}
            className="h-80 w-80 object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="mt-1 capitalize text-gray-500">
            Category: {product.category.name}
          </p>
          <p className="mt-4">{product.description}</p>
          <p className="mt-4 text-3xl font-bold text-blue-600">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className="mt-2">Stock: {product.stock}</p>
        </div>
      </div>
    </div>
  );
}