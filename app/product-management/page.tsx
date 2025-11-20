"use client";

import { useEffect, useState } from "react";
import api from "@/_lib/api";
import { BiEdit, BiTrash, BiDownload, BiSearch } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AddProduct from "@/components/productMgt/addProduct";
import { Pagination } from "@/_lib/types";
// import ViewProduct from "@/components/productMgt/viewProduct";

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);

  const [pagination, setPagination] = useState<Pagination | null>(null);

  const businessOwnerId =
    typeof window !== "undefined" && localStorage.getItem("businessOwner")
      ? JSON.parse(localStorage.getItem("businessOwner")!)._id
      : "";
  const [dateFilter, setDateFilter] = useState("");
  useEffect(() => {
    if (!businessOwnerId) return;
    fetchProducts(1);
  }, [search, brandFilter, categoryFilter, dateFilter]);

  // Fetch products
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await api.get(`/product/business-owner/${businessOwnerId}`);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Product fetch failed", err);
      } finally {
        setLoading(false);
      }
    }

    if (businessOwnerId) load();
  }, [businessOwnerId]);

  // Filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.skuId.toLowerCase().includes(search.toLowerCase());

    const matchesBrand = brandFilter ? p.brandId?.includes(brandFilter) : true;

    const matchesCategory = categoryFilter
      ? p.category === categoryFilter
      : true;

    const matchesStatus = statusFilter
      ? p.warrantyEnable === (statusFilter === "active")
      : true;

    return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
  });
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      let query = `/product?page=${page}&businessOwnerId=${businessOwnerId}`;

      if (search) query += `&search=${search}`;
      if (brandFilter) query += `&brandId=${brandFilter}`;
      if (categoryFilter) query += `&category=${categoryFilter}`;
      if (dateFilter) query += `&dateFilter=${dateFilter}`;

      const res = await api.get(query);

      if (res.data.status) {
        setProducts(res.data.data.products);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCategories = products
    .map((p) => p.category)
    .filter((cat, index, arr) => arr.indexOf(cat) === index);
  if (showAddProduct) {
    return <AddProduct onClose={() => setShowAddProduct(false)} />;
  }
  // if (viewProduct) {
  //   // return <ViewProduct onClose={() => setViewProduct(false)} />;
  // }
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-bold">All Products</h2>
          <p className="text-sm text-gray-500">
            Total: {filteredProducts.length}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <BiDownload className="mr-2" /> Export
          </Button>

          <Button variant="outline">Bulk Upload</Button>

          <Button
            className="bg-purple-600 text-white hover:bg-purple-700"
            onClick={() => setShowAddProduct(true)}
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex items-center border rounded-lg px-3 py-2 w-64 bg-gray-50">
          <BiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Category */}
        <select
          className="border rounded-lg px-3 py-2 min-w-[150px]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Brand */}
        <select
          className="border rounded-lg px-3 py-2 min-w-[150px]"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="">All Brands</option>
          {products.map((p) => {
            const match = p.brandId.match(/'(.+?)'/);
            const id = match ? match[1] : "";
            return (
              <option key={id} value={id}>
                {p.brandId.includes("name")
                  ? p.brandId.split("name: '")[1]?.split("'")[0]
                  : "Brand"}
              </option>
            );
          })}
        </select>

        {/* Status */}
        <select
          className="border rounded-lg px-3 py-2 min-w-[150px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2 min-w-[150px]"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* LOADER */}
      {loading ? (
        <div className="flex justify-center items-center h-[350px]">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent animate-spin rounded-full"></div>
        </div>
      ) : (
        <>
          {/* PRODUCTS TABLE */}
          <div className="mt-6 bg-white border rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Product Title</th>
                  <th className="p-3 text-left">SKU ID</th>
                  <th className="p-3 text-left">Last Updated At</th>
                  <th className="p-3 text-left">Category</th>
                  {/* <th className="p-3 text-left">Brand</th> */}
                  <th className="p-3 text-left">Product Status</th>
                  <th className="p-3 text-left">Capabilities</th>
                  <th className="p-3 text-left">Tag</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((item) => {
                  // const brandName = item.brandId.includes("name")
                  //   ? item.brandId.split("name: '")[1]?.split("'")[0]
                  //   : "Brand";

                  return (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium">{item.title}</td>
                      <td className="p-3">{item.skuId}</td>
                      <td className="p-3">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">{item.category}</td>
                      {/* <td className="p-3">{brandName}</td> */}

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.warrantyEnable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.warrantyEnable ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                          Warranty
                        </span>
                      </td>
                      <td className="p-3 max-w-[180px]">
                        {item.tags?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">No tags</span>
                        )}
                      </td>

                      <td className="p-3 text-right flex justify-end gap-3">
                        <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 transition">
                          View
                        </button>
                        <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 transition">
                          Edit
                        </button>
                        <BiTrash className="mt-1 text-red-600 cursor-pointer text-xl" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {pagination && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <p>
                Showing page {pagination.currentPage} of {pagination.totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => fetchProducts(pagination.currentPage - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <button className="px-3 py-1 border rounded bg-purple-600 text-white">
                  {pagination.currentPage}
                </button>

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => fetchProducts(pagination.currentPage + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
