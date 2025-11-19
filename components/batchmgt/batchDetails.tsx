"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/_lib/api";
import SerialNumberPage from "./serialNumberPage";
import QRtab from "./QRtab";
import OverView from "./overView";
import { BatchDetailsResponse } from "@/_lib/types";
export default function BatchDetails({ id }: { id: string }) {
  const [batch, setBatch] = useState<BatchDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!id) return;
    fetchBatch();
  }, [id]);

  const fetchBatch = async () => {
    try {
      const res = await api.get(`/batch/${id}`);
      if (res?.data?.status) {
        setBatch(res.data.data);
      }
    } catch (err) {
      console.error("Batch fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
      </div>
    );

  if (!batch) return <p className="text-center mt-10">Batch not found</p>;

  // // STATIC fallbacks for fields not provided in API:
  // const staticProductName = "Nike - Running Shoe Model A";
  // const staticSKU = "SKU001";
  // const staticCreatedBy = "john.smith@company.com";
  // const staticWarranty = "24 months from purchase";
  // const staticSerialRange = "1001 - 1050 (Sequential)";
  // const staticQRGenerated = "100 (50 Pre + 50 Post)";
  // const staticDownloads = 3;
  // const staticLastDownloaded = "28-Oct-2024";
  // const staticScanStats = {
  //   total: 45,
  //   prescan: 28,
  //   postscan: 17,
  //   purchased: 17,
  //   warrantyReg: 12,
  //   redFlags: 2,
  // };

  return (
    <div className="p-6 space-y-6">
      {/* NAV */}
      <div className="flex gap-4 border-b pb-4">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "overview"
              ? "bg-purple-100 text-purple-700"
              : "text-gray-600"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("serial")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "serial"
              ? "bg-purple-100 text-purple-700"
              : "text-gray-600"
          }`}
        >
          Serial Number
        </button>

        <button
          onClick={() => setActiveTab("qr")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "qr"
              ? "bg-purple-100 text-purple-700"
              : "text-gray-600"
          }`}
        >
          QR Code
        </button>
      </div>

      {activeTab === "overview" && <OverView batch={batch} />}
      {activeTab === "serial" && <SerialNumberPage batch={batch} />}
      {activeTab === "qr" && <QRtab batch={batch} />}
    </div>
  );
}
