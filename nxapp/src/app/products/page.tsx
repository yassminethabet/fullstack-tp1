import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductsResponse } from "@/types/product";

const LIMIT = 12;

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ skip?: string }>;
}) {
  const { skip: skipParam } = await searchParams;
  const skip = Math.max(0, Number(skipParam) || 0);

  const response = await fetch(
    `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`
  );
  if (!response.ok) throw new Error("HTTP " + response.status);
  const data: ProductsResponse = await response.json();

  const hasPrevious = skip > 0;
  const hasNext = skip + LIMIT < data.total;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold">Product catalogue</h1>
      <p className="mb-6 text-gray-500">{data.total} products</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        {hasPrevious ? (
          <Link
            href={`/products?skip=${skip - LIMIT}`}
            className="rounded border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded border border-gray-300 px-4 py-2 text-gray-400">
            Previous
          </span>
        )}

        <span>
          {skip + 1} - {skip + data.products.length} / {data.total}
        </span>

        {hasNext ? (
          <Link
            href={`/products?skip=${skip + LIMIT}`}
            className="rounded border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Next
          </Link>
        ) : (
          <span className="rounded border border-gray-300 px-4 py-2 text-gray-400">
            Next
          </span>
        )}
      </div>
    </div>
  );
}