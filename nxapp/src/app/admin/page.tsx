"use client";
import { useEffect, useState } from "react";
import type { Product, ProductInput, ProductsResponse } from "@/types/product";

const API = process.env.NEXT_PUBLIC_API_URL;

const EMPTY: ProductInput = {
  title: "",
  description: "",
  price: 0,
  thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.webp",
  stock: 0,
  category: "",
};

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/products?limit=100&skip=0`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data: ProductsResponse = await res.json();
        setProducts(data.products);
      } catch {
        setError("Unable to load the products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reload]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  function edit(p: Product) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      price: Number(p.price),
      thumbnail: p.thumbnail,
      stock: p.stock,
      category: p.category.name,
    });
    setMessage("");
  }

  function cancel() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        editingId ? `${API}/products/${editingId}` : `${API}/products`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("HTTP " + res.status);
      setMessage(editingId ? "Product updated" : "Product created");
      cancel();
      setReload((n) => n + 1);
    } catch {
      setError("Unable to save the product");
    }
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.title}" ?`)) return;
    try {
      const res = await fetch(`${API}/products/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      setMessage("Product deleted");
      setReload((n) => n + 1);
    } catch {
      setError("Unable to delete the product");
    }
  }

  const inputClass = "rounded border border-gray-300 px-3 py-2";

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin</h1>

      {message && (
        <p className="mb-4 rounded bg-green-50 p-3 text-green-700">{message}</p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>
      )}

      <form
        onSubmit={save}
        className="mb-8 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3"
      >
        <h2 className="font-semibold md:col-span-3">
          {editingId ? `Edit product #${editingId}` : "New product"}
        </h2>
        <input
          className={`${inputClass} md:col-span-2`}
          name="title"
          placeholder="Title"
          required
          minLength={2}
          value={form.title}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          name="category"
          placeholder="Category"
          required
          value={form.category}
          onChange={handleChange}
        />
        <textarea
          className={`${inputClass} md:col-span-3`}
          name="description"
          placeholder="Description"
          required
          value={form.description}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          type="number"
          step="0.01"
          min="0.01"
          name="price"
          placeholder="Price"
          required
          value={form.price}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          type="number"
          min="0"
          name="stock"
          placeholder="Stock"
          required
          value={form.stock}
          onChange={handleChange}
        />
        <input
          className={inputClass}
          type="url"
          name="thumbnail"
          placeholder="Image URL"
          required
          value={form.thumbnail}
          onChange={handleChange}
        />
        <div className="flex gap-2 md:col-span-3">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancel}
              className="rounded border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.title}</td>
                  <td className="p-3 capitalize">{p.category.name}</td>
                  <td className="p-3">${Number(p.price).toFixed(2)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => edit(p)}
                      className="mr-2 rounded border border-blue-600 px-2 py-1 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="rounded border border-red-600 px-2 py-1 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}