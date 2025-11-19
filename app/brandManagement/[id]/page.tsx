"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/_lib/api";
import DeleteBrandModal from "@/modals/DeleteModal";
import { Brand } from "@/_lib/types"; // using your Brand only
import ProductSection from "@/components/Brand/Products";

export default function BrandViewPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "categories"
  );

  /* ---------------- Fetch Brand ---------------- */
  const fetchBrand = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/brand/${id}`);
      setBrand(res.data?.data || null);
    } catch (err) {
      console.error("Fetch brand failed:", err);
      setBrand(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBrand();
  }, [id]);

  /* ---------------- Delete Flow ---------------- */
  const handleDelete = () => {
    setBrandToDelete(brand);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!brandToDelete?._id) return;

    try {
      await api.delete(`/brand/${brandToDelete._id}`);
      setIsDeleteOpen(false);
      router.push("/brands");
    } catch (err) {
      console.error("Delete brand failed:", err);
    }
  };

  /* ---------------- Loading ---------------- */
  if (loading || !brand) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.push(`/brandManagement`)}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Brands
        </button>

        <div className="p-6 bg-white rounded-xl shadow">
          <p className="text-gray-600">Loading brand details...</p>
        </div>
      </div>
    );
  }

  /* ---------------- Derived Stats ---------------- */
  const categories = brand.manage_categories || [];
  const totalCategories = categories.length;

  // productCount fallback logic
  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.productCount ?? c.subcategories?.length ?? 0),
    0
  );

  const fallbackLogo = "/mnt/data/Screenshot (6).png";

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/brandManagement`)}
            className="text-blue-600 hover:underline"
          >
            ← Back to Brands
          </button>
          <h1 className="text-2xl font-semibold">Brand View</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/brandManagement/edit/${brand._id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Brand
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteBrandModal
        isOpen={isDeleteOpen}
        brand={brandToDelete}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* Brand Card */}
      <div className="bg-white rounded-xl shadow p-6 border">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex gap-4">
            <img
              src={brand.logo || fallbackLogo}
              className="w-20 h-20 rounded-md border object-cover"
            />

            <div>
              <h2 className="text-2xl font-bold">{brand.name}</h2>

              <p className="text-sm text-gray-500 mt-1">
                Created:{" "}
                {brand.createdAt
                  ? new Date(brand.createdAt).toLocaleDateString()
                  : "—"}
              </p>

              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  className="text-blue-600 underline text-sm mt-1 inline-block"
                >
                  {brand.website}
                </a>
              )}

              {brand.description && (
                <p className="text-gray-700 mt-3 max-w-lg">{brand.description}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <span
            className={`px-3 py-1 rounded-full h-fit text-sm font-medium ${
              brand.status === "active"
                ? "bg-green-50 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {brand.status}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={String(totalProducts)} />
        <StatCard label="Categories" value={String(totalCategories)} />
        <StatCard label="Active Products" value={"—"} />
        <StatCard label="Total Revenue" value={"—"} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-4 shadow border">
        <div className="flex gap-6 border-b pb-2">
          <TabButton
            active={activeTab === "products"}
            onClick={() => setActiveTab("products")}
          >
            All Products
          </TabButton>

          <TabButton
            active={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
          >
            Categories & Subcategories
          </TabButton>
        </div>

        <div className="mt-6">
          {activeTab === "categories" ? (
            <CategorySection categories={categories} />
          ) : (
            <ProductSection brandId={id}/>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sections ---------------- */

function CategorySection({
  categories,
}: {
  categories: Brand["manage_categories"];
}) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-3">
        Categories
        <span className="text-sm text-gray-500 ml-2">
          Total: {categories?.length ?? 0}
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories?.length ? (
          categories.map((cat) => (
            <div key={cat._id} className="bg-gray-50 border rounded-lg p-5">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">{cat.categories}</h4>

                <p className="text-sm text-gray-500">
                  {cat.productCount
                    ? `${cat.productCount} products`
                    : `${cat.subcategories.length} subcategories`}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {cat.subcategories.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-white border text-sm rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No categories found.</p>
        )}
      </div>
    </>
  );
}

// function ProductSection() {
//   return (
//     <p className="text-gray-500">Products list will come after API setup.</p>
//   );
// }

/* ---------------- Small Components ---------------- */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 ${
        active ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
      }`}
    >
      {children}
    </button>
  );
}
