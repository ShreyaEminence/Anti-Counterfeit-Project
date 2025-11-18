"use client";

import { useState, useEffect } from "react";
import api from "@/_lib/api";
import { Brand } from "@/_lib/types";
import DeleteBrandModal from "@/modals/DeleteModal";
// --------------------
// TypeScript Interfaces
// --------------------

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface BrandsResponse {
  status: boolean;
  message: string;
  data: Brand[];
  pagination: Pagination;
}

// --------------------
// Component
// --------------------
export default function BrandManagementPage() {
  const [search, setSearch] = useState<string>("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const[openDeleteModal,setOpenDeleteModal]=useState(false);

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      const response = await api.get<BrandsResponse>("/brand");
      console.log(response,"response")
      setBrands(response.data.data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Filtered brands for search
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );
  

   const handleView = (brand: Brand) => {
    console.log("View brand:", brand);
    alert(`View brand: ${brand.name}`);
  };

  const handleEdit = (brand: Brand) => {
    console.log("Edit brand:", brand);
    alert(`Edit brand: ${brand.name}`);
  };

  const handleDelete = (brand: Brand) => {
    setIsDeleteOpen(true)
     setBrandToDelete(brand);
    console.log("Delete brand:", brand);

  };

console.log(isDeleteOpen,"isDeleteOpen")
  console.log(filteredBrands,"filteredBrands")
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500">Total Brands</p>
          <p className="text-4xl font-bold mt-2">{brands.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500">Products Assigned</p>
          {/* <p className="text-4xl font-bold mt-2">
            {brands.reduce((acc, brand) => acc + brand.subcategories.length, 0)}
          </p> */}
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search brand..."
          className="border rounded-lg px-4 py-2 w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="border rounded-lg px-4 py-2 w-44">
          <option>This Week</option>
          <option>Today</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>

        <select className="border rounded-lg px-4 py-2 w-44">
          <option>Select Status</option>
          <option>active</option>
          <option>inactive</option>
        </select>

        <button className="border px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          Export
        </button>
          <button className="border px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          Add Brand
        </button>
      </div>

      {/* CRUD TABLE */}
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

          <tbody>
            {filteredBrands.map((brand) => (
              <tr key={brand._id} className="border-t hover:bg-gray-50">
                <td className="px-5 py-3">{brand.name}</td>
                <td className="px-5 py-3">
                  {new Date(brand.createdAt).toLocaleDateString()}
                </td>
              <td className="px-5 py-3">
  <div className="flex flex-wrap gap-2">
    {brand.manage_categories && brand.manage_categories.length > 0 ? (
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

                <td className="px-5 py-3">{brand.products}</td>
                <td className="px-5 py-3">{brand.status}</td>
                     <td className="px-5 py-3 flex items-center justify-center gap-3">
                  {/* View */}
                  <button
                    className="p-2 rounded hover:bg-gray-200"
                    title="View"
                    onClick={() => handleView(brand)}
                  >
                    👁
                  </button>

                  {/* Edit */}
                  <button
                    className="p-2 rounded hover:bg-green-200"
                    title="Edit"
                    onClick={() => handleEdit(brand)}
                  >
                    ✏️
                  </button>

                  {/* Delete */}
                  <button
                    className="p-2 rounded hover:bg-red-200"
                    title="Delete"
                    onClick={() => handleDelete(brand)}
                  >
                    🗑️
                  </button>
                </td>

                <td className="px-5 py-3 flex items-center justify-center gap-3">
                  {/* View */}
                  <button
                    className="p-2 rounded hover:bg-gray-200"
                    title="View"
                  >
                    {/* SVG icon */}
                  </button>

                  {/* Edit */}
                  <button
                    className="p-2 rounded hover:bg-gray-200"
                    title="Edit"
                  >
                    {/* SVG icon */}
                  </button>

                  {/* Delete */}
                  <button
                    className="p-2 rounded hover:bg-gray-200"
                    title="Delete"
                  >
                    {/* SVG icon */}
                  </button>
                </td>
      
              </tr>


            ))}
          </tbody>
        

        </table>

      
      </div>
         {isDeleteOpen ? <>
       
       <DeleteBrandModal
  isOpen={isDeleteOpen}
  brand={brandToDelete}
  onCancel={() => setIsDeleteOpen(false)}
  onConfirm={(brand) => {
    console.log("Delete confirmed for:", brand);
    setIsDeleteOpen(false);
    // call your delete API here
  }}
/>
       </> : null}
    </div>
  );
}
