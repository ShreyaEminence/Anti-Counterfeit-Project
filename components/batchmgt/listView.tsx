"use client";

import { ListViewProps } from "@/_lib/types";
import { parseProduct } from "@/_lib/utils/helper";

export default function ListView({
  batches,
  selected,
  toggleSelect,
  toggleSelectAll,
}: ListViewProps) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden mt-4">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 text-left text-gray-600">
          <tr>
            <th className="p-3 w-12">
              <input
                type="checkbox"
                checked={
                  selected.length === batches.length && batches.length > 0
                }
                onChange={toggleSelectAll}
                className="h-4 w-4 cursor-pointer rounded-lg"
              />
            </th>
            <th className="p-3">Batch ID</th>
            <th className="p-3">Product</th>
            <th className="p-3">Brand</th>
            <th className="p-3">Units</th>
            <th className="p-3">QR Status</th>
            <th className="p-3">Scans</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {batches.map((b) => (
            <tr
              key={b._id}
              className="border-b hover:bg-gray-50 text-gray-700 transition"
            >
              <td className="p-3 w-12">
                <input
                  type="checkbox"
                  checked={selected.includes(b._id)}
                  onChange={() => toggleSelect(b._id)}
                  className="h-4 w-4 cursor-pointer"
                />
              </td>

              <td className="p-3 font-medium">{b.batchId}</td>
              <td className="p-3">
                {parseProduct(b.productId)?.title || "N/A"}
              </td>
              <td className="p-3">
                {parseProduct(b.productId)?.brand || "N/A"}
              </td>
              <td className="p-3">{b.noOfItems}</td>
              <td className="p-3">50/50 (100%)</td>

              <td className="p-3">
                {b.scanData ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                      {b.scanData.authentic || 0}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                      {b.scanData.suspicious || 0}
                    </span>
                  </div>
                ) : (
                  "—"
                )}
              </td>

              <td className="p-3 text-right">
                <div className="flex justify-end items-center gap-2">
                  <button className="px-4 py-1.5 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50">
                    More Details
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
