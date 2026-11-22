import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { CategoryWithCount, ProductsResponse } from "@/types/product";

const LIMIT = 12;

type SearchParams = { skip?: string; q?: string; category?: string };

// Yebni el URL m3a el filtre, bech Previous / Next ma yfassakhouch el recherche
function buildUrl(skip: number, q: string, category: string) {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (category) sp.set("category", category);
  if (skip > 0) sp.set("skip", String(skip));
  const qs = sp.toString();
  return qs ? `/products?${qs}` : "/products";
}

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { skip: skipParam, q = "", category = "" } = await searchParams;
  const skip = Math.max(0, Number(skipParam) || 0);

  const apiParams = new URLSearchParams({
    limit: String(LIMIT),
    skip: String(skip),
  });
  if (q) apiParams.set("q", q);
  if (category) apiParams.set("category", category);

  const [productsRes, categoriesRes] = await Promise.all([
    fetch(`${process.env.API_URL}/products?${apiParams}`, { cache: "no-store" }),
    fetch(`${process.env.API_URL}/categories`, { cache: "no-store" }),
  ]);
  if (!productsRes.ok) throw new Error("HTTP " + productsRes.status);
  if (!categoriesRes.ok) throw new Error("HTTP " + categoriesRes.status);

  const data: ProductsResponse = await productsRes.json();
  const categories: CategoryWithCount[] = await categoriesRes.json();

  const hasPrevious = skip > 0;
  const hasNext = skip + LIMIT < data.total;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold">Product catalogue</h1>
      <p className="mb-6 text-gray-500">{data.total} products</p>

      <form action="/products" className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search a product..."
          className="min-w-48 flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <select
          name="category"
          defaultValue={category}
          className="rounded border border-gray-300 px-3 py-2 capitalize"
        >
          <option value="">All categories</option>
          {categories
            .filter((c) => c._count.products > 0)
            .map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({c._count.products})
              </option>
            ))}
        </select>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>
        <Link
          href="/products"
          className="rounded border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Reset
        </Link>
      </form>

      {data.products.length === 0 ? (
        <p className="rounded bg-blue-50 p-4 text-blue-700">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            {hasPrevious ? (
              <Link
                href={buildUrl(skip - LIMIT, q, category)}
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
                href={buildUrl(skip + LIMIT, q, category)}
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
        </>
      )}
    </div>
  );
}