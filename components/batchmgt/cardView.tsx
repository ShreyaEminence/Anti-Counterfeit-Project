"use client";

import { CardViewProps } from "@/_lib/types";
import { getSerialRange, parseProduct } from "@/_lib/utils/helper";

export default function CardView({
  batches,
  selected,
  toggleSelect,
}: CardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {batches.map((b) => (
        <div
          key={b._id}
          className="bg-white shadow-md rounded-2xl border border-gray-200 p-5 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-800">{b.batchId}</p>
              <p className="text-xs text-gray-500 mt-1">
                {parseProduct(b.productId)?.title || "Unknown Product"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(b._id)}
                onChange={() => toggleSelect(b._id)}
                className="cursor-pointer"
              />
              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                Active
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-xs">Created At:</p>
              <p className="font-medium">{b.createdAt?.slice(0, 10)}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-xs">Updated At:</p>
              <p className="font-medium">{b.updatedAt?.slice(0, 10) || "—"}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
              <p className="text-gray-500 text-xs">Serial Numbers:</p>
              <p className="font-medium">
                {
                  getSerialRange(b.prefix, b.startSerialNumber, b.noOfItems)
                    .start
                }{" "}
                –{" "}
                {getSerialRange(b.prefix, b.startSerialNumber, b.noOfItems).end}{" "}
                ({b.noOfItems} {b.noOfItems > 1 ? "units" : "unit"})
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-xs">Manufacture Date:</p>
              <p className="font-medium">
                {b.manufactureDate
                  ? new Date(b.manufactureDate).toISOString().slice(0, 10)
                  : "N/A"}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-gray-500 text-xs">Warranty:</p>
              <p className="font-medium">
                {parseProduct(b.productId)?.warranty || "N/A"}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
              <p className="text-gray-500 text-xs">Expiry:</p>
              <p className="font-medium">
                {b.expireDate
                  ? new Date(b.expireDate).toISOString().slice(0, 10)
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* QR Status */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">
              QR Status:{" "}
              <span className="text-purple-600">50/50 Generated</span>
            </p>

            <div className="w-full bg-purple-100 h-2 rounded mt-2 overflow-hidden">
              <div className="bg-purple-600 h-2 w-full rounded"></div>
            </div>

            <p className="text-right text-xs text-purple-600 font-semibold">
              100%
            </p>
          </div>

          {/* Scan Summary */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Scan Summary</p>

            <div className="flex justify-between mt-2 text-center">
              <div>
                <p className="text-xl font-semibold text-gray-900">
                  {b.scanData?.authentic || 0}
                </p>
                <p className="text-xs text-gray-500">Total Scans</p>
              </div>

              <div>
                <p className="text-xl font-semibold text-gray-900">
                  {b.scanData?.purchased || 0}
                </p>
                <p className="text-xs text-gray-500">Purchased</p>
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <button className="mt-4 w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition">
            View Details →
          </button>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between mt-3 gap-3">
            <button className="flex-1 py-2 text-sm border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
              QR Excel
            </button>
            <button className="flex-1 py-2 text-sm border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
              QR PDF
            </button>

            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100">
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
        </div>
      ))}
    </div>
  );
}
