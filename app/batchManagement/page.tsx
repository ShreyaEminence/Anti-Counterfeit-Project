"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/batchmgt/initialCreate";
export default function BatchManagement() {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const businessOwnerId = localStorage.getItem("businessOwnerId");

        if (!businessOwnerId) {
          console.log("No business owner id");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/batch/business-owner/${businessOwnerId}`
        );

        const json = await res.json();

        if (json.status && Array.isArray(json.data)) {
          setBatches(json.data);
        } else {
          setBatches([]);
        }
      } catch (err) {
        console.error(err);
        setBatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!batches.length) {
    return <EmptyState onCreate={() => console.log("Create Batch clicked")} />;
  }
  
  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">All Batches</h1>

        <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
          Create New Batch
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-5">
        <input
          type="text"
          placeholder="Search Batches..."
          className="px-3 py-2 border rounded-lg w-64"
        />

        <select className="px-3 py-2 border rounded-lg">
          <option>All Brands</option>
        </select>

        <select className="px-3 py-2 border rounded-lg">
          <option>All Products</option>
        </select>

        <select className="px-3 py-2 border rounded-lg">
          <option>All Status</option>
        </select>

        <button className="ml-auto px-4 py-2 border rounded-lg">Export</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left text-gray-600">
            <tr>
              <th className="p-3">Batch ID</th>
              <th className="p-3">Date Created</th>
              <th className="p-3">SKU ID</th>
              <th className="p-3">Mfg Date</th>
              <th className="p-3">No. of Items</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {batches.map((item: any, index: number) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 text-gray-700"
              >
                <td className="p-3">{item.batchId}</td>
                <td className="p-3">{item.createdAt?.slice(0, 10)}</td>
                <td className="p-3">{item.sku}</td>
                <td className="p-3">{item.mfgDate?.slice(0, 10)}</td>
                <td className="p-3">{item.itemsCount}</td>

                <td className="p-3 font-medium">
                  {item.status === "active" ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">In Active</span>
                  )}
                </td>

                <td className="p-3 text-right">
                  <button className="px-4 py-1.5 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50">
                    Edit Batch
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 px-2">
        <p className="text-gray-500">Showing {batches.length} results</p>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded">Prev</button>
          <button className="px-3 py-1 border rounded bg-purple-600 text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
