import api from "@/_lib/api";
import { BatchDetailsResponse } from "@/_lib/types";
import { parseProduct } from "@/_lib/utils/helper";

const QRtab = ({ batch }: { batch: BatchDetailsResponse }) => {
  const product = parseProduct(batch.productId); // extract real product object
  const productId = product?._id; // THIS is what backend needs

  const handleFileDownload = async (endpoint: string, fileName: string) => {
    try {
      const response = await api.get(endpoint, {
        params: { productId }, // ✔ send productId as query param
        responseType: "blob", // ✔ required to download files
      });

      const blobUrl = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="border rounded-xl bg-white p-6 mt-6">
      <h3 className="text-lg font-semibold mb-6">
        Preview QR Codes for this batch
      </h3>

      <div className="grid grid-cols-3 gap-6">
        {batch.tags?.map((tag: any, i: number) => (
          <div key={i} className="border rounded-xl p-4 shadow-sm bg-gray-50">
            <p className="font-medium">Serial: {tag.productSerialNumber}</p>

            {/* PRE */}
            <p className="text-xs font-semibold mt-3">PRE-SCAN QR</p>
            <img
              src={tag.preScannerQRCodeUrl}
              className="w-40 h-40 mx-auto"
              alt="pre QR"
            />
            <button
              className="text-purple-600 mt-2 float-right text-lg"
              onClick={() =>
                handleFileDownload(
                  tag.preScannerQRCodeUrl,
                  `${tag.productSerialNumber}-preScan.svg`
                )
              }
            >
              ⬇
            </button>

            {/* POST */}
            <p className="text-xs font-semibold mt-3">POST-SCAN QR</p>
            <img
              src={tag.postScannerQRCodeUrl}
              className="w-40 h-40 mx-auto"
              alt="post QR"
            />
            <button
              className="text-purple-600 mt-2 float-right text-lg"
              onClick={() =>
                handleFileDownload(
                  tag.postScannerQRCodeUrl,
                  `${tag.productSerialNumber}-postScan.svg`
                )
              }
            >
              ⬇
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() =>
            handleFileDownload(
              "/tag/export/pdf",
              `${batch.batchId}-qrcodes.xlsx`
            )
          }
          className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700"
        >
          Download Excel
        </button>

        <button
          onClick={() =>
            handleFileDownload(
              "/batch/download/csv",
              `${batch.batchId}-qrcodes.csv`
            )
          }
          className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default QRtab;
