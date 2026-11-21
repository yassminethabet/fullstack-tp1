import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const shortDescription =
    product.description.length > 80
      ? product.description.slice(0, 80) + "..."
      : product.description;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-52 items-center justify-center bg-gray-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={200}
          height={200}
          className="h-48 w-48 object-contain"
        />
        <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-xs capitalize">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-semibold">{product.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="rounded border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}