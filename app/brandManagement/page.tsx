"use client";

import { useState, useEffect } from "react";
import api from "@/_lib/api";
import { Brand } from "@/_lib/types";
import DeleteBrandModal from "@/modals/DeleteModal";
import { useRouter } from "next/navigation";

// --------------------
// Component
// --------------------
export default function BrandManagementPage() {
  const router = useRouter();

  const [search, setSearch] = useState<string>("");

  const [isTotalBrandsLoading, setIsTotalBrandsLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<string>("");

  const [brands, setBrands] = useState<Brand[]>([]);
  const[totalBrands,setTotalBrands]=useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isBrandsLoading, setIsBrandsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>(""); // "" | "today" | "this_week" | "this_month" | "this_year"

const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10); // number of brands per page

const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentBrands = brands.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(brands.length / itemsPerPage);

  // ------------------------------
  // FETCH BRANDS API
  // ------------------------------
const fetchBrands = async (filters: { status?: string; search?: string; date?: string } = {}) => {
  try {
    setIsBrandsLoading(true);
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.date) params.append("dateFilter", filters.date); // send date filter

    const response = await api.get(`/brand?${params.toString()}`);

    const brandsArray = Array.isArray(response.data.data?.brands)
      ? response.data.data.brands
      : [];

    setBrands(brandsArray);
    setCurrentPage(1); // reset to first page after filtering
  } catch (error) {
    console.error("Fetch error:", error);
    setBrands([]);
  } finally {
    setIsBrandsLoading(false);
  }
};


const fetchTotalBrands = async () => {
  try {
    setIsTotalBrandsLoading(true);
    const res = await api.get("/brand"); // No filters
    const allBrands = res.data?.data?.brands || [];
    setTotalBrands(allBrands.length);
  } catch (err) {
    console.error(err);
  } finally {
    setIsTotalBrandsLoading(false);
  }
};
  // ------------------------------
  // INITIAL FETCH
  // ------------------------------
  useEffect(() => {
    fetchBrands();
    fetchTotalBrands();
  }, []);

  // ------------------------------
  // SEARCH FILTER (debounced)
  // ------------------------------
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBrands({
        search,
        status: statusFilter,
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // ------------------------------
  // DELETE BRAND
  // ------------------------------
  const handleDelete = (brand: Brand) => {
    setIsDeleteOpen(true);
    setBrandToDelete(brand);
  };

  const confirmDelete = async (brand: Brand) => {
    try {
      await api.delete(`/brand/${brand._id}`);
      setIsDeleteOpen(false);
      setBrandToDelete(null);
      fetchBrands();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleView = (brand: Brand) => {
    router.push(`/brandManagement/${brand._id}`);
  };

  const handleEdit = (brand: Brand) => {
    router.push(`/brandManagement/edit/${brand._id}`);
  };
console.log(totalBrands,"totalBrands")
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6 border flex flex-col items-center justify-center">
  <p className="text-gray-500">Total Brands</p>
  <div className="text-4xl font-bold mt-2 flex items-center justify-center">
    {isTotalBrandsLoading ? (
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    ) : (
      totalBrands
    )}
  </div>
</div>


        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500">Products Assigned</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search brand..."
          className="border rounded-lg px-4 py-2 w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Week Filter */}
        <select className="border rounded-lg px-4 py-2 w-44"  value={dateFilter} onChange={(e) => {
    const value = e.target.value;
    setDateFilter(value);
    fetchBrands({
      search,
      status: statusFilter,
      date: value,
    });
  }}><option value="">All Time</option>
  <option value="today">Today</option>
  <option value="this_week">This Week</option>
  <option value="this_month">This Month</option>
  <option value="this_year">This Year</option>
        </select>

        {/* Status Filter */}
        <select
          className="border rounded-lg px-4 py-2 w-44"
          onChange={(e) => {
            const status = e.target.value === "all" ? "" : e.target.value;
            setStatusFilter(status);
            fetchBrands({
              search,
              status,
            });
          }}
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="border px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          Export
        </button>

        <button
          className="border px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          onClick={() => router.push("/brandManagement/new-brand")}
        >
          Add Brand
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow border rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-5 py-3">Brand Name</th>
              <th className="px-5 py-3">Date Created</th>
              <th className="px-5 py-3">Categories</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
{/* 
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id} className="border-t hover:bg-gray-50">
                <td className="px-5 py-3">{brand.name}</td>

                <td className="px-5 py-3">
                  {new Date(brand.createdAt).toLocaleDateString()}
                </td>

                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-2">
                    {brand.manage_categories?.length ? (
                      <>
                        {brand.manage_categories.slice(0, 2).map((cat, i) => (
                          <span
                            key={i}
                            className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
                          >
                            {cat.categories}
                          </span>
                        ))}
                        {brand.manage_categories.length > 2 && (
                          <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-sm">
                            +{brand.manage_categories.length - 2} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400">No Categories</span>
                    )}
                  </div>
                </td>

                <td className="px-5 py-3">{brand.products || "-"}</td>

                <td className="px-5 py-3">{brand.status}</td>

                <td className="px-5 py-3 flex items-center justify-center gap-3">
                  <button
                    className="p-2 rounded hover:bg-gray-200"
                    onClick={() => handleView(brand)}
                  >
                    👁
                  </button>

                  <button
                    className="p-2 rounded hover:bg-green-200"
                    onClick={() => handleEdit(brand)}
                  >
                    ✏️
                  </button>

                  <button
                    className="p-2 rounded hover:bg-red-200"
                    onClick={() => handleDelete(brand)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody> */}


          <tbody>
  {brands.map((brand) => (
    <tr key={brand._id} className="border-t hover:bg-gray-50">
      <td className="px-5 py-3">{brand.name}</td>

      <td className="px-5 py-3">
        {new Date(brand.createdAt).toLocaleDateString()}
      </td>

      <td className="px-5 py-3">
        <div className="flex flex-wrap gap-2">
          {brand.manage_categories?.length ? (
            <>
              {brand.manage_categories.slice(0, 2).map((cat, i) => (
                <span
                  key={i}
                  className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
                >
                  {cat.categories}
                </span>
              ))}
              {brand.manage_categories.length > 2 && (
                <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-sm">
                  +{brand.manage_categories.length - 2} more
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400">No Categories</span>
          )}
        </div>
      </td>

      {/* Fixed Products column */}
      <td className="px-5 py-3">
       {Array.isArray(brand.products) ? brand.products.length : 0}
      </td>

      <td className="px-5 py-3">{brand.status}</td>

      <td className="px-5 py-3 flex items-center justify-center gap-3">
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => handleView(brand)}
        >
          👁
        </button>

        <button
          className="p-2 rounded hover:bg-green-200"
          onClick={() => handleEdit(brand)}
        >
          ✏️
        </button>

        <button
          className="p-2 rounded hover:bg-red-200"
          onClick={() => handleDelete(brand)}
        >
          🗑️
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
        
      </div>
<div className="flex justify-between items-center mt-4 text-sm text-gray-600">
  <p>
    Showing {indexOfFirst + 1} to {Math.min(indexOfLast, brands.length)} of {brands.length} brands
  </p>

  <div className="flex gap-2">
    <button
      className="px-3 py-1 border rounded"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={`px-3 py-1 border rounded ${currentPage === page ? "bg-purple-600 text-white" : ""}`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    <button
      className="px-3 py-1 border rounded"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
</div>

      {/* DELETE MODAL */}
      {isDeleteOpen && (
        <DeleteBrandModal
          isOpen={isDeleteOpen}
          brand={brandToDelete}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
