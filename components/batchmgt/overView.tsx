"use client";

import api from "@/_lib/api";
import { BatchDetailsResponse } from "@/_lib/types";
import { parseProduct } from "@/_lib/utils/helper";

const Overview = ({ batch }: { batch: BatchDetailsResponse }) => {
  const product = parseProduct(batch.productId);
  const handleDownloadQRPDF = async () => {
    try {
      const productId = product?._id;
      const batchId = batch?._id;
      const businessOwnerId =
        typeof window !== "undefined" && localStorage.getItem("businessOwner")
          ? JSON.parse(localStorage.getItem("businessOwner")!)._id
          : "";

      console.log(productId, batchId, businessOwnerId, "data");
      if (!productId || !batchId || !businessOwnerId) {
        alert("Missing required IDs for downloading PDF.");
        return;
      }

      const url = `/tag/export/pdf?productId=${productId}&batchId=${batchId}&businessOwnerId=${businessOwnerId}`;

      const response = await api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `QR-Codes-${batch.batchId}.pdf`;
      link.click();

      window.URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Something went wrong while downloading.");
    }
  };
  const handleDownloadQRExcel = async () => {
    try {
      const productId = product?._id;
      const batchId = batch?._id;

      const businessOwnerId =
        typeof window !== "undefined" && localStorage.getItem("businessOwner")
          ? JSON.parse(localStorage.getItem("businessOwner")!)._id
          : "";

      if (!productId || !batchId || !businessOwnerId) {
        alert("Missing required IDs for downloading Excel.");
        return;
      }

      const url = `/tag/export/excel?productId=${productId}&batchId=${batchId}&businessOwnerId=${businessOwnerId}`;

      const response = await api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileURL = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `QR-Codes-${batch.batchId}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error("Excel download failed:", err);
      alert("Something went wrong while downloading Excel.");
    }
  };

  const serialEnd =
    batch.serialNumberType === "sequential"
      ? Number(batch.startSerialNumber) + Number(batch.noOfItems) - 1
      : null;

  return (
    <div className="space-y-6">
      {/* ---------- Batch Information ---------- */}
      <section className="border rounded-xl bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Batch Information</h3>

        <div className="grid grid-cols-4 gap-6 text-sm">
          <InfoItem label="Batch ID" value={batch.batchId} />

          <InfoItem label="SKU" value={product.skuId || "-"} />

          <InfoItem label="Created By" value={batch.businessOwnerId} />

          <div>
            <p className="text-gray-500">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                batch.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {batch.status}
            </span>
          </div>

          <InfoItem label="Product" value={product.title} />

          <InfoItem
            label="Created At"
            value={new Date(batch.createdAt).toLocaleDateString()}
          />
        </div>
      </section>

      {/* ---------- Manufacturing Details ---------- */}
      <section className="border rounded-xl bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Manufacturing Details</h3>

        <div className="grid grid-cols-4 gap-6 text-sm">
          <InfoItem label="Total Units" value={batch.noOfItems} />

          <InfoItem
            label="Expiry"
            value={
              batch.expireDate
                ? new Date(batch.expireDate).toLocaleDateString()
                : "Not Applicable"
            }
          />

          <InfoItem label="Warranty" value="24 months from purchase" />

          <InfoItem
            label="Manufacture Date"
            value={new Date(batch.manufactureDate).toLocaleDateString()}
          />

          <div>
            <p className="text-gray-500">Serial Numbers</p>

            {batch.serialNumberType === "sequential" ? (
              <p className="font-medium">
                {batch.prefix}-{batch.startSerialNumber} → {serialEnd}
                <span className="text-gray-500 text-xs"> (Sequential)</span>
              </p>
            ) : (
              <p className="font-medium">
                {batch.prefix}-{batch.startSerialNumber}
                <span className="text-gray-500 text-xs"> (Random)</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---------- QR Code Stats ---------- */}
      <section className="border rounded-xl bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">QR Code Statistics</h3>

        <div className="grid grid-cols-4 gap-6 text-sm">
          <InfoItem
            label="Total QR Generated"
            value={`${batch.noOfItems * 2} (${batch.noOfItems} Pre + ${
              batch.noOfItems
            } Post)`}
          />

          <InfoItem label="Downloads" value="3 times" />

          <InfoItem label="Last Downloaded" value="28-Oct-2024" />
        </div>
      </section>

      {/* ---------- Scan Statistics ---------- */}
      <section className="border rounded-xl bg-white p-6">
        <h3 className="text-lg font-semibold mb-6">Scan Statistics</h3>

        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Scans"
            value="45"
            change="+12%"
            color="purple"
          />
          <StatCard label="Pre-scan" value="28" change="+11%" color="pink" />
          <StatCard label="Post-scan" value="17" change="+3.2%" color="green" />
          <StatCard label="Purchased" value="17" change="+12%" color="cyan" />
          <StatCard
            label="Warranties Reg"
            value="12"
            change="+12%"
            color="yellow"
          />
          <StatCard label="Red Flags" value="2" change="+2.3%" color="red" />
        </div>
      </section>

      {/* ---------- Footer Buttons ---------- */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleDownloadQRExcel}
          className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700"
        >
          Download QR Excel
        </button>
        <button
          onClick={handleDownloadQRPDF}
          className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700"
        >
          Download QR PDF
        </button>
        <button className="px-4 py-2 rounded-lg bg-purple-600 text-white">
          Edit Batch
        </button>
        <button className="px-4 py-2 rounded-lg bg-red-100 text-red-600">
          Archive Batch
        </button>
      </div>
    </div>
  );
};

export default Overview;

/* ---------- Components ---------- */

const InfoItem = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const StatCard = ({
  label,
  value,
  change,
  color,
}: {
  label: string;
  value: string | number;
  change: string;
  color: string;
}) => {
  const colorMap: any = {
    purple: "bg-purple-50 text-purple-700",
    pink: "bg-pink-50 text-pink-700",
    green: "bg-green-50 text-green-700",
    cyan: "bg-cyan-50 text-cyan-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div
      className={`p-4 rounded-xl shadow-sm border ${colorMap[color]} flex flex-col`}
    >
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-1">▲ {change} vs last month</p>
    </div>
  );
};
