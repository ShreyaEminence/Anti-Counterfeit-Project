"use client";

import { Props } from "@/_lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SuccessModal({
  open,
  setOpen,
  payload,
  onClose,
}: Props) {
  if (!open || !payload) return null;

  const batch = payload?.data?.batch;
  const totalTags = batch?.noOfItems || 0;

  return (
    <div className="fixed inset-0 z-[2000] bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* TOP HEADER */}
        <h1 className="text-xl font-semibold">Batch Created Successfully!</h1>
        <p className="text-gray-500 text-sm mt-1">
          Your Batch Has Been Created And QR Codes Generated
        </p>

        {/* PURPLE SUCCESS BANNER */}
        <div className="mt-6 bg-violet-50 border border-violet-200 rounded-2xl p-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <CheckCircle size={52} className="text-green-600" />

            <h2 className="text-2xl font-bold text-gray-800">
              Batch {batch?.batchId} Created!
            </h2>

            <p className="text-gray-500 text-sm">
              Your batch has been successfully created with QR codes
            </p>
          </div>
        </div>

        {/* MID INFO ROW */}
        <div className="mt-10 grid grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-sm text-gray-500">Product</p>
            <p className="font-semibold text-gray-800 mt-1">
              {payload?.data?.product?.title || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Serial Numbers</p>
            <p className="font-semibold mt-1">
              {batch?.startSerialNumber} -{" "}
              {Number(batch?.startSerialNumber) + totalTags - 1}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Units</p>
            <p className="font-semibold mt-1">{totalTags}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">QR Codes</p>
            <p className="font-semibold mt-1">{totalTags} generated</p>
          </div>
        </div>

        {/* DOWNLOAD CARDS */}
        <h2 className="mt-12 text-lg font-semibold">Download QR Codes</h2>
        <p className="text-sm text-gray-500 mb-3">Choose format to download:</p>

        <div className="grid grid-cols-2 gap-6">
          {/* Excel Card */}
          <div className="p-6 bg-blue-50 rounded-xl border flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Excel Format</h3>
              <p className="text-sm text-gray-500 mt-1">
                Download spreadsheet with product details and QR images
              </p>
            </div>
            <Button className="mt-4">📄 Download Excel</Button>
          </div>

          {/* PDF Card */}
          <div className="p-6 bg-pink-50 rounded-xl border flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">PDF Format</h3>
              <p className="text-sm text-gray-500 mt-1">
                Print-ready PDF with formatted labels
              </p>
            </div>
            <Button className="mt-4">📄 Download PDF</Button>
          </div>
        </div>

        {/* QR PREVIEW SECTION */}
        <h2 className="mt-14 text-lg font-semibold">Download QR Codes</h2>
        <p className="text-sm text-gray-500 mb-4">Choose format to download:</p>

        <div className="border p-10 rounded-2xl bg-white max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
              className="w-16 mb-6 opacity-70"
            />

            <div className="grid grid-cols-2 gap-10">
              {/* Pre-Scan */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">
                  PRE-SCAN
                </p>
                <div className="w-28 h-28 bg-gray-200 rounded-md" />
              </div>

              {/* Post-Scan */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">
                  POST-SCAN
                </p>
                <div className="w-28 h-28 bg-gray-200 rounded-md" />
              </div>
            </div>

            {/* Details */}
            <div className="mt-8 text-center text-sm text-gray-700">
              <p>
                Serial: {batch?.startSerialNumber} -{" "}
                {Number(batch?.startSerialNumber) + totalTags - 1}
              </p>
              <p>Product: {payload?.data?.product?.title}</p>
              <p>Batch: {batch?.batchId}</p>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="mt-12 mb-10 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              onClose && onClose();
            }}
          >
            👁 View Batch Details
          </Button>

          <Button variant="secondary">➕ Create Another Batch</Button>

          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
            🡆 Go to Batches
          </Button>
        </div>
      </div>
    </div>
  );
}
